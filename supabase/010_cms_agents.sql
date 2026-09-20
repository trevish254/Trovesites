-- Manually managed CMS agents.
-- Run this in the Supabase SQL Editor.

create table if not exists public.cms_agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role text not null default 'Content editor',
  status text not null default 'Active' check (status in ('Active', 'Away', 'Invited', 'Suspended')),
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists cms_agents_email_unique_idx
  on public.cms_agents (lower(email));

create index if not exists cms_agents_created_at_idx
  on public.cms_agents (created_at desc);

alter table public.cms_agents enable row level security;
revoke all on table public.cms_agents from anon;
grant select, insert, update, delete on table public.cms_agents to authenticated;

drop policy if exists "Admins can view CMS agents" on public.cms_agents;
create policy "Admins can view CMS agents"
  on public.cms_agents for select to authenticated
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));

drop policy if exists "Admins can create CMS agents" on public.cms_agents;
create policy "Admins can create CMS agents"
  on public.cms_agents for insert to authenticated
  with check (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));

drop policy if exists "Admins can update CMS agents" on public.cms_agents;
create policy "Admins can update CMS agents"
  on public.cms_agents for update to authenticated
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));

drop policy if exists "Admins can delete CMS agents" on public.cms_agents;
create policy "Admins can delete CMS agents"
  on public.cms_agents for delete to authenticated
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));
