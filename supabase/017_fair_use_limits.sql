-- Track free-plan prompt copies and component usage.
-- Run this once in the Supabase SQL Editor.

create table if not exists public.user_daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null default current_date,
  prompt_copies integer not null default 0 check (prompt_copies >= 0),
  component_copies integer not null default 0 check (component_copies >= 0),
  primary key (user_id, usage_date)
);

create table if not exists public.user_weekly_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  component_visits integer not null default 0 check (component_visits >= 0),
  primary key (user_id, week_start)
);

alter table public.user_daily_usage enable row level security;
alter table public.user_weekly_usage enable row level security;

grant select on public.user_daily_usage, public.user_weekly_usage to authenticated;

drop policy if exists "Users can view their daily usage" on public.user_daily_usage;
create policy "Users can view their daily usage"
  on public.user_daily_usage for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can view their weekly usage" on public.user_weekly_usage;
create policy "Users can view their weekly usage"
  on public.user_weekly_usage for select to authenticated
  using (auth.uid() = user_id);

create or replace function public.consume_project_copy(p_project_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  today date := current_date;
  usage_row public.user_daily_usage;
  project_category text;
begin
  if current_user_id is null then
    return jsonb_build_object('allowed', false, 'reason', 'sign_in_required');
  end if;

  select lower(trim(category)) into project_category
  from public.cms_projects
  where id = p_project_id and status = 'live';

  if project_category is null then
    return jsonb_build_object('allowed', false, 'reason', 'project_unavailable');
  end if;

  insert into public.user_daily_usage (user_id, usage_date)
  values (current_user_id, today)
  on conflict (user_id, usage_date) do nothing;

  select * into usage_row
  from public.user_daily_usage
  where user_id = current_user_id and usage_date = today
  for update;

  -- Once the component-copy allowance is exhausted, block all copy actions.
  if usage_row.component_copies >= 5 then
    return jsonb_build_object('allowed', false, 'reason', 'component_copy_limit', 'used', usage_row.component_copies, 'limit', 5);
  end if;

  if project_category = 'components' then
    update public.user_daily_usage
    set component_copies = component_copies + 1
    where user_id = current_user_id and usage_date = today;
    return jsonb_build_object('allowed', true, 'type', 'component', 'used', usage_row.component_copies + 1, 'limit', 5);
  end if;

  if usage_row.prompt_copies >= 3 then
    return jsonb_build_object('allowed', false, 'reason', 'prompt_limit', 'used', usage_row.prompt_copies, 'limit', 3);
  end if;

  update public.user_daily_usage
  set prompt_copies = prompt_copies + 1
  where user_id = current_user_id and usage_date = today;
  return jsonb_build_object('allowed', true, 'type', 'prompt', 'used', usage_row.prompt_copies + 1, 'limit', 3);
end;
$$;

create or replace function public.consume_component_visit()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_week date := date_trunc('week', current_date)::date;
  visit_count integer;
begin
  if current_user_id is null then
    return jsonb_build_object('allowed', false, 'reason', 'sign_in_required');
  end if;

  insert into public.user_weekly_usage (user_id, week_start)
  values (current_user_id, current_week)
  on conflict (user_id, week_start) do nothing;

  select component_visits into visit_count
  from public.user_weekly_usage
  where user_id = current_user_id and week_start = current_week
  for update;

  if visit_count >= 3 then
    return jsonb_build_object('allowed', false, 'reason', 'component_visit_limit', 'used', visit_count, 'limit', 3);
  end if;

  update public.user_weekly_usage
  set component_visits = component_visits + 1
  where user_id = current_user_id and week_start = current_week;
  return jsonb_build_object('allowed', true, 'used', visit_count + 1, 'limit', 3);
end;
$$;

revoke all on function public.consume_project_copy(uuid) from public;
grant execute on function public.consume_project_copy(uuid) to authenticated;
revoke all on function public.consume_component_visit() from public;
grant execute on function public.consume_component_visit() to authenticated;
