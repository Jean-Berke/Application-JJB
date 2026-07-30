-- OSS (JJB app) — schema minimal pour le fil social réel :
-- profils, posts, likes, follows. Le reste de l'app (open mats,
-- techniques, carnet, messages, admin...) reste sur des données
-- mockées côté app pour l'instant.
--
-- À exécuter dans Supabase : Project > SQL Editor > New query > coller > Run.

-- ─────────────────────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text unique not null,
  display_name text not null,
  bio text not null default '',
  belt text not null default 'white'
    check (belt in ('white', 'blue', 'purple', 'brown', 'black')),
  stripes int not null default 0 check (stripes between 0 and 4),
  belt_verified boolean not null default false,
  is_coach boolean not null default false,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-crée une ligne profiles au moment de l'inscription (auth.users).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, handle, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'handle', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- posts
-- ─────────────────────────────────────────────────────────────
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) <= 280),
  parent_id uuid references public.posts (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Posts are viewable by everyone"
  on public.posts for select
  using (true);

create policy "Users can create their own posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

create policy "Users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

-- ─────────────────────────────────────────────────────────────
-- post_likes
-- ─────────────────────────────────────────────────────────────
create table public.post_likes (
  post_id uuid not null references public.posts (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, profile_id)
);

alter table public.post_likes enable row level security;

create policy "Likes are viewable by everyone"
  on public.post_likes for select
  using (true);

create policy "Users can like as themselves"
  on public.post_likes for insert
  with check (auth.uid() = profile_id);

create policy "Users can remove their own like"
  on public.post_likes for delete
  using (auth.uid() = profile_id);

-- ─────────────────────────────────────────────────────────────
-- follows
-- ─────────────────────────────────────────────────────────────
create table public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  followee_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

alter table public.follows enable row level security;

create policy "Follows are viewable by everyone"
  on public.follows for select
  using (true);

create policy "Users can follow as themselves"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow as themselves"
  on public.follows for delete
  using (auth.uid() = follower_id);
