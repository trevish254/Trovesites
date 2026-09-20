-- Assign the first Trovesites admin.
-- Run 001_admin_roles_and_cms_rls.sql before running this file.

do $$
declare
  target_email text;
begin
  select email
    into target_email
  from auth.users
  where id = '30481483-81fc-4584-8a0b-8e5c8d25aefa'::uuid;

  if target_email is null then
    raise exception 'No auth user exists with the supplied UUID';
  end if;

  if lower(target_email) <> lower('kevvprojects@gmail.com') then
    raise exception 'UUID belongs to %, not kevvprojects@gmail.com', target_email;
  end if;

  insert into public.user_roles (user_id, role)
  values ('30481483-81fc-4584-8a0b-8e5c8d25aefa'::uuid, 'admin'::public.app_role)
  on conflict (user_id)
  do update set role = excluded.role;
end $$;

-- Verify the assignment:
select ur.user_id, au.email, ur.role
from public.user_roles ur
join auth.users au on au.id = ur.user_id
where ur.user_id = '30481483-81fc-4584-8a0b-8e5c8d25aefa'::uuid;
