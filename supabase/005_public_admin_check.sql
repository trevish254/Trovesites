-- Single server-side authorization check used by the homepage and CMS.
-- Run this in Supabase SQL Editor after the admin roles migration.

create or replace function public.is_admin()
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

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Do not use select public.is_admin() as a SQL Editor test: SQL Editor has no auth.uid().
-- Verify the assigned admin row from SQL Editor with:
-- select au.id, au.email, ur.role
-- from auth.users au
-- left join public.user_roles ur on ur.user_id = au.id
-- where lower(au.email) = lower('kevvprojects@gmail.com');
