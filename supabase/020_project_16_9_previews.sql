-- Make 16:9 the standard public project preview ratio while keeping portrait support.
alter table public.cms_projects
  alter column aspect_ratio set default '16:9';

alter table public.cms_projects
  drop constraint if exists cms_projects_aspect_ratio_check;

update public.cms_projects
set aspect_ratio = '16:9'
where aspect_ratio is null or aspect_ratio = '4:3';

alter table public.cms_projects
  add constraint cms_projects_aspect_ratio_check
  check (aspect_ratio in ('16:9', '9:16'));
