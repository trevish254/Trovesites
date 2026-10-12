-- Define which paid plan unlocks each public project.
-- Run after 018_billing_sync.sql.

alter table public.cms_projects
  add column if not exists access_plan text not null default 'free';

update public.cms_projects
set access_plan = case when is_premium then 'starter' else 'free' end
where access_plan is null or access_plan not in ('free', 'starter', 'studio', 'lifetime');

alter table public.cms_projects
  drop constraint if exists cms_projects_access_plan_check;

alter table public.cms_projects
  add constraint cms_projects_access_plan_check
  check (access_plan in ('free', 'starter', 'studio', 'lifetime'));

-- Replace the original free-only limits with plan-aware limits.
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
  current_plan text := 'free';
  prompt_limit integer := 3;
  component_limit integer := 5;
begin
  if current_user_id is null then
    return jsonb_build_object('allowed', false, 'reason', 'sign_in_required');
  end if;

  select coalesce(plan, 'free') into current_plan
  from public.billing_subscriptions
  where user_id = current_user_id and status in ('active', 'trialing');

  if current_plan = 'starter' then
    prompt_limit := 10;
    component_limit := 15;
  elsif current_plan in ('studio', 'lifetime') then
    prompt_limit := 1000000;
    component_limit := 1000000;
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

  select * into usage_row from public.user_daily_usage
  where user_id = current_user_id and usage_date = today for update;

  if usage_row.component_copies >= component_limit then
    return jsonb_build_object('allowed', false, 'reason', 'component_copy_limit', 'used', usage_row.component_copies, 'limit', component_limit, 'plan', current_plan);
  end if;

  if project_category = 'components' then
    update public.user_daily_usage set component_copies = component_copies + 1
    where user_id = current_user_id and usage_date = today;
    return jsonb_build_object('allowed', true, 'type', 'component', 'used', usage_row.component_copies + 1, 'limit', component_limit, 'plan', current_plan);
  end if;

  if usage_row.prompt_copies >= prompt_limit then
    return jsonb_build_object('allowed', false, 'reason', 'prompt_limit', 'used', usage_row.prompt_copies, 'limit', prompt_limit, 'plan', current_plan);
  end if;

  update public.user_daily_usage set prompt_copies = prompt_copies + 1
  where user_id = current_user_id and usage_date = today;
  return jsonb_build_object('allowed', true, 'type', 'prompt', 'used', usage_row.prompt_copies + 1, 'limit', prompt_limit, 'plan', current_plan);
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
  visit_limit integer := 3;
  current_plan text := 'free';
begin
  if current_user_id is null then
    return jsonb_build_object('allowed', false, 'reason', 'sign_in_required');
  end if;
  select coalesce(plan, 'free') into current_plan from public.billing_subscriptions
  where user_id = current_user_id and status in ('active', 'trialing');
  if current_plan = 'starter' then visit_limit := 7;
  elsif current_plan in ('studio', 'lifetime') then visit_limit := 1000000;
  end if;

  insert into public.user_weekly_usage (user_id, week_start) values (current_user_id, current_week)
  on conflict (user_id, week_start) do nothing;
  select component_visits into visit_count from public.user_weekly_usage
  where user_id = current_user_id and week_start = current_week for update;
  if visit_count >= visit_limit then
    return jsonb_build_object('allowed', false, 'reason', 'component_visit_limit', 'used', visit_count, 'limit', visit_limit, 'plan', current_plan);
  end if;
  update public.user_weekly_usage set component_visits = component_visits + 1
  where user_id = current_user_id and week_start = current_week;
  return jsonb_build_object('allowed', true, 'used', visit_count + 1, 'limit', visit_limit, 'plan', current_plan);
end;
$$;
