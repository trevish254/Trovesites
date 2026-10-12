-- CMS projects with Cloudinary image references.
-- Run this in the Supabase SQL Editor.

create table if not exists public.cms_projects (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references public.cms_folders(id) on delete set null,
  name text not null,
  slug text not null unique,
  category text not null default 'Uncategorized',
  description text not null default '',
  prompt text not null default '',
  tags text[] not null default '{}',
  aspect_ratio text not null default '4:3' check (aspect_ratio in ('4:3', '9:16')),
  is_premium boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'live', 'archived')),
  image_url text,
  cloudinary_public_id text,
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_projects_folder_order_idx
  on public.cms_projects (folder_id, updated_at desc);

create or replace function public.cms_set_project_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cms_projects_updated_at on public.cms_projects;
create trigger cms_projects_updated_at
before update on public.cms_projects
for each row execute function public.cms_set_project_updated_at();

alter table public.cms_projects enable row level security;
revoke all on table public.cms_projects from anon;
grant select, insert, update, delete on table public.cms_projects to authenticated;

drop policy if exists "Admins can view CMS projects" on public.cms_projects;
create policy "Admins can view CMS projects"
  on public.cms_projects for select to authenticated
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));

drop policy if exists "Admins can create CMS projects" on public.cms_projects;
create policy "Admins can create CMS projects"
  on public.cms_projects for insert to authenticated
  with check (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));

drop policy if exists "Admins can update CMS projects" on public.cms_projects;
create policy "Admins can update CMS projects"
  on public.cms_projects for update to authenticated
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ))
  with check (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));

drop policy if exists "Admins can delete CMS projects" on public.cms_projects;
create policy "Admins can delete CMS projects"
  on public.cms_projects for delete to authenticated
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  ));
