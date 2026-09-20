-- Lock CMS access to the existing Trovesites admin only.
-- Run this in the Supabase SQL Editor after 001_admin_roles_and_cms_rls.sql.
-- The UUID below is the existing admin from 002_assign_kevvprojects_admin.sql.

begin;

-- The roles table is never writable from the browser.
alter table public.user_roles enable row level security;
revoke all on table public.user_roles from anon, authenticated;
grant select on table public.user_roles to authenticated;

drop policy if exists "Users can view their own role" on public.user_roles;
create policy "Users can view their own role"
  on public.user_roles for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Remove any accidental admin assignment from every other account.
delete from public.user_roles
where user_id <> '30481483-81fc-4584-8a0b-8e5c8d25aefa'::uuid;

-- Ensure the intended admin remains assigned, if that account exists.
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where id = '30481483-81fc-4584-8a0b-8e5c8d25aefa'::uuid
on conflict (user_id) do update set role = excluded.role;

-- Keep the authorization function security-definer and callable only by signed-in users.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'::public.app_role
  );
$$;

revoke execute on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

-- Public users can only read published projects.
alter table public.projects enable row level security;
revoke all on table public.projects from anon, authenticated;
grant select on table public.projects to anon, authenticated;
grant insert, update, delete on table public.projects to authenticated;

drop policy if exists "Published projects are public" on public.projects;
create policy "Published projects are public"
  on public.projects for select
  to anon, authenticated
  using (status = 'published' or (select private.is_admin()));

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects"
  on public.projects for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

commit;

-- Verification queries:
-- select ur.user_id, au.email, ur.role
-- from public.user_roles ur
-- join auth.users au on au.id = ur.user_id;
--
-- Expected result: only kevvprojects@gmail.com / 30481483-81fc-4584-8a0b-8e5c8d25aefa.
