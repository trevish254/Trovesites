-- Add premium product labeling to CMS projects.
-- Run this once in the Supabase SQL Editor for an existing project table.

alter table public.cms_projects
  add column if not exists is_premium boolean not null default false;
