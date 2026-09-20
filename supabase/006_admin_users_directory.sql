-- Expose the minimum user directory fields to CMS administrators only.
-- Run this migration in the Supabase SQL Editor before opening the Users page.

create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  role text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    au.id,
    au.email::text,
    coalesce(
      au.raw_user_meta_data ->> 'full_name',
      au.raw_user_meta_data ->> 'name',
      au.raw_user_meta_data ->> 'preferred_username'
    )::text as full_name,
    case when ur.role is null then 'user' else ur.role::text end as role,
    au.created_at,
    au.last_sign_in_at
  from auth.users as au
  left join public.user_roles as ur on ur.user_id = au.id
  where exists (
    select 1
    from public.user_roles as actor_role
    where actor_role.user_id = auth.uid()
      and actor_role.role = 'admin'
  )
  order by au.created_at desc;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;
