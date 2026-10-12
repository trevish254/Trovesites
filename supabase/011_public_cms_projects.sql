-- Allow the public site to read only published CMS projects.
-- Run this in the Supabase SQL Editor after 008_cms_projects.sql.

grant select on table public.cms_projects to anon, authenticated;

drop policy if exists "Published CMS projects are public" on public.cms_projects;
create policy "Published CMS projects are public"
  on public.cms_projects for select
  to anon, authenticated
  using (status = 'live');
