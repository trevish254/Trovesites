-- Identify the real CMS administrator and grant CMS access only to that account.
-- Run this in Supabase SQL Editor.

begin;

do $$
declare
  cms_admin_id uuid;
begin
  select id
    into cms_admin_id
  from auth.users
  where lower(email) = lower('kevvprojects@gmail.com')
  limit 1;

  if cms_admin_id is null then
    raise exception 'No Supabase auth user found for kevvprojects@gmail.com';
  end if;

  -- There is exactly one CMS administrator.
  delete from public.user_roles
  where user_id <> cms_admin_id;

  insert into public.user_roles (user_id, role)
  values (cms_admin_id, 'admin'::public.app_role)
  on conflict (user_id)
  do update set role = excluded.role;
end $$;

-- Normal users cannot change or inspect other users' roles.
alter table public.user_roles enable row level security;
revoke all on table public.user_roles from anon, authenticated;
grant select on table public.user_roles to authenticated;

drop policy if exists "Users can view their own role" on public.user_roles;
create policy "Users can view their own role"
  on public.user_roles for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- CMS project data is readable publicly only when published; only admins can manage it.
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

-- Verify the CMS administrator and role:
select ur.user_id, au.email, ur.role
from public.user_roles ur
join auth.users au on au.id = ur.user_id;
