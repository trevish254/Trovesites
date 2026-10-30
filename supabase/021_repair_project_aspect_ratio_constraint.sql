-- Reconcile the CMS project aspect-ratio constraint with the values used by
-- the current CMS form. Run this in the Supabase SQL Editor after migration 020.

alter table public.cms_projects
  alter column aspect_ratio set default '16:9';

-- Remove the stale check before normalizing rows to the supported values.
alter table public.cms_projects
  drop constraint if exists cms_projects_aspect_ratio_check;

-- Normalize legacy values before tightening the check constraint.
update public.cms_projects
set aspect_ratio = '16:9'
where aspect_ratio is null
   or aspect_ratio not in ('16:9', '9:16');

alter table public.cms_projects
  add constraint cms_projects_aspect_ratio_check
  check (aspect_ratio in ('16:9', '9:16'));
