-- ─────────────────────────────────────────────────────────────────────
-- CLÜSS members area: database setup for Supabase.
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- It is safe to run again: it only creates what is missing.
--
-- Roles, from least to most:
--   member        sees tasks, links and the members list; updates the status of their own tasks
--   collaborator  + creates tasks, writes event and blog DRAFTS, uploads images
--   editor        + publishes events and posts, edits anyone's, manages links
--   admin         + adds and removes people and changes their roles
-- Only emails listed in `members` can sign in at all.
-- ─────────────────────────────────────────────────────────────────────

create extension if not exists citext;

-- ── people ───────────────────────────────────────────────────────────
create table if not exists public.members (
  email      citext primary key,
  name       text not null default '',
  role       text not null default 'member' check (role in ('admin', 'editor', 'collaborator', 'member')),
  committee  text not null default '',
  created_at timestamptz not null default now()
);

create or replace function public.my_email() returns citext
language sql stable as $$ select nullif(auth.jwt() ->> 'email', '')::citext $$;

create or replace function public.role_rank(r text) returns int
language sql immutable as $$
  select case r when 'admin' then 4 when 'editor' then 3 when 'collaborator' then 2 when 'member' then 1 else 0 end
$$;

-- security definer so policies can read roles without recursing through RLS
create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.members where email = public.my_email()
$$;

create or replace function public.has_role(min_role text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.role_rank(public.my_role()) >= public.role_rank(min_role), false)
$$;

-- Never leave the association without an admin.
create or replace function public.keep_one_admin() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if old.role = 'admin' and (tg_op = 'DELETE' or new.role <> 'admin') then
    if not exists (select 1 from public.members where role = 'admin' and email <> old.email) then
      raise exception 'There must always be at least one admin.';
    end if;
  end if;
  return coalesce(new, old);
end $$;

drop trigger if exists keep_one_admin on public.members;
create trigger keep_one_admin before update or delete on public.members
  for each row execute function public.keep_one_admin();

-- Only people on the members list can create a login.
create or replace function public.only_listed_members() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.members where email = new.email::citext) then
    raise exception 'not_a_member';
  end if;
  return new;
end $$;

drop trigger if exists only_listed_members on auth.users;
create trigger only_listed_members before insert on auth.users
  for each row execute function public.only_listed_members();

-- ── shared bookkeeping for the tables below ──────────────────────────
create or replace function public.stamp_row() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    new.created_by := public.my_email();
    new.created_at := now();
  else
    new.created_by := old.created_by;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  return new;
end $$;

-- ── tasks ────────────────────────────────────────────────────────────
create table if not exists public.tasks (
  id         uuid primary key default gen_random_uuid(),
  title      text not null check (char_length(title) between 1 and 200),
  notes      text not null default '' check (char_length(notes) <= 4000),
  assignee   citext references public.members (email) on update cascade on delete set null,
  committee  text not null default '',
  due        date,
  status     text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  created_by citext,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Members may only move their own tasks between statuses.
create or replace function public.task_member_guard() returns trigger
language plpgsql as $$
begin
  if not public.has_role('collaborator')
     and (to_jsonb(new) - 'status' - 'updated_at') <> (to_jsonb(old) - 'status' - 'updated_at') then
    raise exception 'Members can only change the status of their own tasks.';
  end if;
  return new;
end $$;

drop trigger if exists tasks_stamp on public.tasks;
create trigger tasks_stamp before insert or update on public.tasks for each row execute function public.stamp_row();
drop trigger if exists tasks_guard on public.tasks;
create trigger tasks_guard before update on public.tasks for each row execute function public.task_member_guard();

-- ── links (Drive folders, forms, tools) ──────────────────────────────
create table if not exists public.links (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 120),
  url         text not null check (url ~* '^(https?://|/)'),
  category    text not null default 'Drive',
  description text not null default '',
  sort        int  not null default 0,
  created_by  citext,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists links_stamp on public.links;
create trigger links_stamp before insert or update on public.links for each row execute function public.stamp_row();

-- ── events ───────────────────────────────────────────────────────────
create table if not exists public.events (
  id             uuid primary key default gen_random_uuid(),
  status         text not null default 'draft' check (status in ('draft', 'published')),
  date           date not null,
  time           text not null default '',
  place          text not null default '',
  title          text not null check (char_length(title) between 1 and 160),
  lead           text not null default '',
  cartel         text not null default '',
  cartel_small   text not null default '',
  en             text not null default '',
  committee      text not null default '' check (committee in ('', 'academic', 'social', 'media', 'sport')),
  register_url   text not null default '' check (register_url = '' or register_url ~* '^https?://'),
  body           text not null default '',
  list_title     text not null default '',
  list_items     text not null default '',
  image_url      text not null default '' check (image_url = '' or image_url ~* '^(https://|/)'),
  image_alt      text not null default '',
  image_caption  text not null default '',
  article_url    text not null default '' check (article_url = '' or article_url ~* '^https?://'),
  article_source text not null default '',
  article_title  text not null default '',
  flag           text not null default '',
  created_by     citext,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
drop trigger if exists events_stamp on public.events;
create trigger events_stamp before insert or update on public.events for each row execute function public.stamp_row();

-- ── blog posts ───────────────────────────────────────────────────────
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  status       text not null default 'draft' check (status in ('draft', 'published')),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title        text not null check (char_length(title) between 1 and 160),
  excerpt      text not null default '' check (char_length(excerpt) <= 400),
  body         text not null default '',
  cover_url    text not null default '' check (cover_url = '' or cover_url ~* '^(https://|/)'),
  cover_alt    text not null default '',
  author       text not null default '',
  published_at timestamptz,
  created_by   citext,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create or replace function public.post_publish_date() returns trigger
language plpgsql as $$
begin
  if new.status = 'published' and new.published_at is null then new.published_at := now(); end if;
  return new;
end $$;

drop trigger if exists posts_stamp on public.posts;
create trigger posts_stamp before insert or update on public.posts for each row execute function public.stamp_row();
drop trigger if exists posts_publish on public.posts;
create trigger posts_publish before insert or update on public.posts for each row execute function public.post_publish_date();

-- ── who can do what (row level security) ─────────────────────────────
alter table public.members enable row level security;
alter table public.tasks   enable row level security;
alter table public.links   enable row level security;
alter table public.events  enable row level security;
alter table public.posts   enable row level security;

do $$
declare p record;
begin
  for p in select policyname, tablename from pg_policies
           where schemaname = 'public' and tablename in ('members', 'tasks', 'links', 'events', 'posts') loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- members: everyone on the list can see the list; only admins change it
create policy members_read   on public.members for select to authenticated using (public.has_role('member'));
create policy members_insert on public.members for insert to authenticated with check (public.has_role('admin'));
create policy members_update on public.members for update to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));
create policy members_delete on public.members for delete to authenticated using (public.has_role('admin'));

-- tasks
create policy tasks_read   on public.tasks for select to authenticated using (public.has_role('member'));
create policy tasks_insert on public.tasks for insert to authenticated with check (public.has_role('collaborator'));
create policy tasks_update on public.tasks for update to authenticated
  using (public.has_role('collaborator') or assignee = public.my_email())
  with check (public.has_role('collaborator') or assignee = public.my_email());
create policy tasks_delete on public.tasks for delete to authenticated
  using (public.has_role('editor') or created_by = public.my_email());

-- links
create policy links_read  on public.links for select to authenticated using (public.has_role('member'));
create policy links_write on public.links for all    to authenticated using (public.has_role('editor')) with check (public.has_role('editor'));

-- events and posts: the public sees published ones; drafts stay inside
create policy events_read on public.events for select to anon, authenticated
  using (status = 'published' or public.has_role('member'));
create policy events_insert on public.events for insert to authenticated
  with check (public.has_role('editor') or (public.has_role('collaborator') and status = 'draft'));
create policy events_update on public.events for update to authenticated
  using (public.has_role('editor') or (public.has_role('collaborator') and status = 'draft' and created_by = public.my_email()))
  with check (public.has_role('editor') or (public.has_role('collaborator') and status = 'draft'));
create policy events_delete on public.events for delete to authenticated
  using (public.has_role('editor') or (public.has_role('collaborator') and status = 'draft' and created_by = public.my_email()));

create policy posts_read on public.posts for select to anon, authenticated
  using (status = 'published' or public.has_role('member'));
create policy posts_insert on public.posts for insert to authenticated
  with check (public.has_role('editor') or (public.has_role('collaborator') and status = 'draft'));
create policy posts_update on public.posts for update to authenticated
  using (public.has_role('editor') or (public.has_role('collaborator') and status = 'draft' and created_by = public.my_email()))
  with check (public.has_role('editor') or (public.has_role('collaborator') and status = 'draft'));
create policy posts_delete on public.posts for delete to authenticated
  using (public.has_role('editor') or (public.has_role('collaborator') and status = 'draft' and created_by = public.my_email()));

-- ── images for events and posts ──────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists media_read   on storage.objects;
drop policy if exists media_upload on storage.objects;
drop policy if exists media_delete on storage.objects;
create policy media_read   on storage.objects for select using (bucket_id = 'media');
create policy media_upload on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.has_role('collaborator'));
create policy media_delete on storage.objects for delete to authenticated using (bucket_id = 'media' and public.has_role('editor'));

-- ── starting content: the two events already on the site ─────────────
insert into public.events (status, date, time, place, title, lead, cartel, cartel_small, en, committee, register_url, flag)
select 'published', '2026-11-13', '15:00', 'Embajada de Chile, La Haya', 'Visit to the Embassy of Chile',
       'Visita a la', E'EMBA\nJADA', 'de Chile', 'Visit to the Embassy of Chile in The Hague.', 'academic',
       'https://docs.google.com/forms/d/e/1FAIpQLSdWKaKUonSzC4zbgNO0COZVigExLkVKpMFzh2kkwD8WRPBhTA/viewform?usp=header', 'chile'
where not exists (select 1 from public.events where title = 'Visit to the Embassy of Chile');

insert into public.events (status, date, time, place, title, committee, body, list_title, list_items,
                           image_url, image_alt, image_caption, article_url, article_source, article_title)
select 'published', '2026-09-24', '14:15–15:30', 'Embajada de Uruguay', 'Visit to the Embassy of Uruguay', 'academic',
       'A great opportunity for students to learn more about Uruguay, its culture, history, and international relations. There were only 15 places available for students.',
       'During the visit, students learned about:',
       E'Uruguayan culture and traditions\nThe history of Uruguay\nThe role of an embassy\nDiplomacy and international relations\nThe relationship between Uruguay and other countries',
       '/img/embajada-uruguay.jpg', 'A group of CLÜSS students with the Ambassador of Uruguay at the embassy in The Hague',
       'Con el embajador de Uruguay · Photo: Diplomat Magazine',
       'https://diplomatmagazine.eu/2026/09/28/uruguay-a-meeting-place-for-spanish-in-the-hague/', 'Diplomat Magazine',
       'Uruguay, a Meeting Place for Spanish in The Hague'
where not exists (select 1 from public.events where title = 'Visit to the Embassy of Uruguay');

insert into public.links (title, url, category, description, sort)
select * from (values
  ('Firmas de correo', '/miembros/firmas/', 'Herramientas', 'Generador de firmas de la junta', 1),
  ('Fotos de eventos', 'https://drive.google.com/drive/folders/1JDE1fQVyFS2AnGkhsGjEIZngMbpAGhAR?usp=sharing', 'Drive', 'Carpeta compartida con las fotos', 2),
  ('Formulario de miembros activos', 'https://docs.google.com/forms/d/e/1FAIpQLSfHnaI2RyL1F59FiZw6O7IXOa255meYMvB2i-G5CdZGzJJMEg/viewform?usp=header', 'Formularios', '', 3)
) as v(title, url, category, description, sort)
where not exists (select 1 from public.links);
