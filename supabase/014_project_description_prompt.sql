-- Keep the public product description separate from the full copy prompt.
-- Run this once in the Supabase SQL Editor for an existing project table.

alter table public.cms_projects
  add column if not exists prompt text not null default '';

-- Legacy CMS entries stored their full prompt in description. Move that content
-- into prompt so the public detail page can use description for short copy.
update public.cms_projects
set prompt = description,
    description = ''
where coalesce(prompt, '') = ''
  and length(trim(description)) > 0;
