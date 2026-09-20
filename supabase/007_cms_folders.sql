-- CMS folders for the admin Content workspace.
-- Run this in the Supabase SQL Editor.

create table if not exists public.cms_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  item_count integer not null default 0 check (item_count >= 0),
  preview_images text[] not null default '{}',
  sort_order integer not null default 0,
  created_by uuid default auth.uid() references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.cms_set_folder_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cms_folders_updated_at on public.cms_folders;
create trigger cms_folders_updated_at
before update on public.cms_folders
for each row execute function public.cms_set_folder_updated_at();

alter table public.cms_folders enable row level security;
revoke all on table public.cms_folders from anon;
grant select, insert, update, delete on table public.cms_folders to authenticated;

drop policy if exists "Admins can view CMS folders" on public.cms_folders;
create policy "Admins can view CMS folders"
  on public.cms_folders for select
  to authenticated
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));

drop policy if exists "Admins can create CMS folders" on public.cms_folders;
create policy "Admins can create CMS folders"
  on public.cms_folders for insert
  to authenticated
  with check (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));

drop policy if exists "Admins can update CMS folders" on public.cms_folders;
create policy "Admins can update CMS folders"
  on public.cms_folders for update
  to authenticated
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ))
  with check (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));

drop policy if exists "Admins can delete CMS folders" on public.cms_folders;
create policy "Admins can delete CMS folders"
  on public.cms_folders for delete
  to authenticated
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));

insert into public.cms_folders (name, slug, item_count, preview_images, sort_order)
values
  ('Templates', 'templates', 6, array['https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122', 'https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024'], 10),
  ('Components', 'components', 4, array['https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004', 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122'], 20),
  ('Sections', 'sections', 12, array['https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024', 'https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004'], 30),
  ('Backgrounds', 'backgrounds', 3, array['https://framerusercontent.com/images/PmMTtBWdns9q73sBmlgu6h7pB0.png?width=1122&height=1402', 'https://framerusercontent.com/images/GqQks9HafgkRK7rdTAf0oC9JI.png?width=2004&height=2004'], 40),
  ('Branding', 'branding', 12, array['https://framerusercontent.com/images/GqQks9HafgkRK7rdTAf0oC9JI.png?width=2004&height=2004', 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122'], 50),
  ('Automations', 'automations', 9, array['https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024', 'https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004'], 60)
on conflict (slug) do nothing;

select id, name, slug, item_count, sort_order
from public.cms_folders
order by sort_order;
