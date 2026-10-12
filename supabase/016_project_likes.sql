-- Store one like per authenticated user and project.
-- Run this once in the Supabase SQL Editor.

create table if not exists public.cms_project_likes (
  project_id uuid not null references public.cms_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create index if not exists cms_project_likes_project_idx
  on public.cms_project_likes (project_id);

alter table public.cms_project_likes enable row level security;

grant select on table public.cms_project_likes to anon, authenticated;
grant insert, delete on table public.cms_project_likes to authenticated;

drop policy if exists "Anyone can view project likes" on public.cms_project_likes;
create policy "Anyone can view project likes"
  on public.cms_project_likes for select
  to anon, authenticated
  using (true);

drop policy if exists "Users can like projects" on public.cms_project_likes;
create policy "Users can like projects"
  on public.cms_project_likes for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove their project likes" on public.cms_project_likes;
create policy "Users can remove their project likes"
  on public.cms_project_likes for delete
  to authenticated
  using (auth.uid() = user_id);

create or replace view public.cms_project_like_counts as
select project_id, count(*)::integer as like_count
from public.cms_project_likes
group by project_id;

grant select on public.cms_project_like_counts to anon, authenticated;
