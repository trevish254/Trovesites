-- Store the public card aspect ratio for each CMS project.
-- Run this once in the Supabase SQL Editor for an existing project table.

alter table public.cms_projects
  add column if not exists aspect_ratio text not null default '16:9';

update public.cms_projects
set aspect_ratio = '16:9'
where aspect_ratio is null
   or aspect_ratio not in ('16:9', '9:16');

alter table public.cms_projects
  drop constraint if exists cms_projects_aspect_ratio_check;

alter table public.cms_projects
  add constraint cms_projects_aspect_ratio_check
  check (aspect_ratio in ('16:9', '9:16'));
