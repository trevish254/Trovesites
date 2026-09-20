-- Database-backed CMS activity used by the Reports page.
-- Run this in the Supabase SQL Editor.

create table if not exists public.cms_activity (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  action text not null check (action in ('created', 'updated', 'duplicated', 'archived', 'restored', 'deleted', 'uploaded')),
  entity_type text not null default 'project',
  entity_id uuid,
  entity_name text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists cms_activity_created_at_idx
  on public.cms_activity (created_at desc);

create index if not exists cms_activity_action_idx
  on public.cms_activity (action, created_at desc);

alter table public.cms_activity enable row level security;
revoke all on table public.cms_activity from anon;
grant select, insert on table public.cms_activity to authenticated;

drop policy if exists "Admins can view CMS activity" on public.cms_activity;
create policy "Admins can view CMS activity"
  on public.cms_activity for select to authenticated
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));

drop policy if exists "Admins can create CMS activity" on public.cms_activity;
create policy "Admins can create CMS activity"
  on public.cms_activity for insert to authenticated
  with check (
    actor_id = auth.uid()
    and exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );
