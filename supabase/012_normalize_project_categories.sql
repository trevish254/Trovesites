-- Normalize legacy combined categories so Templates and Components remain distinct.
-- Run this once in the Supabase SQL Editor.

update public.cms_projects
set category = 'Templates'
where lower(regexp_replace(trim(category), '\s+', ' ', 'g')) in (
  'templates, components',
  'templates/components',
  'templates & components'
);

-- Prevent the legacy combined value from being saved again.
alter table public.cms_projects
  drop constraint if exists cms_projects_category_not_combined;

alter table public.cms_projects
  add constraint cms_projects_category_not_combined
  check (lower(category) not in ('templates, components', 'templates/components', 'templates & components'));
