-- OSS (JJB app) — schema pour le fil social + la vérification de
-- ceinture réels : profils, posts, likes, follows, académies,
-- codes coach, demandes de grade. Le reste de l'app (open mats,
-- techniques, carnet, messages, admin présences/cotisations) reste
-- sur des données mockées côté app pour l'instant.
--
-- À exécuter dans Supabase : Project > SQL Editor > New query > coller > Run.
-- Ce fichier est cumulatif : si les tables profiles/posts/post_likes/follows
-- existent déjà, ne coller que la partie sous "ACADÉMIES ET VÉRIFICATION
-- DE CEINTURE" ci-dessous.

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

-- ═════════════════════════════════════════════════════════════
-- ACADÉMIES ET VÉRIFICATION DE CEINTURE
-- ═════════════════════════════════════════════════════════════
-- Remplace l'académie fictive codée en dur côté app et le cycle de
-- vérification 100% local par un vrai flux multi-appareils :
-- élève demande → coach de son académie voit la demande → coach
-- valide/refuse → le badge vérifié change pour de vrai en base.

-- ─────────────────────────────────────────────────────────────
-- academies
-- ─────────────────────────────────────────────────────────────
create table public.academies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  neighborhood text not null default '',
  city text not null default '',
  verified boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.academies enable row level security;

create policy "Academies are viewable by everyone"
  on public.academies for select
  using (true);

-- Pas de policy insert/update/delete : le seed et la gestion des
-- académies se font à la main depuis le SQL Editor pour l'instant.

insert into public.academies (name, slug, neighborhood, city)
values ('District Training Zone', 'district-training-zone-montreuil', 'Montreuil', 'Montreuil');

-- ─────────────────────────────────────────────────────────────
-- profiles.academy_id
-- ─────────────────────────────────────────────────────────────
alter table public.profiles
  add column academy_id uuid references public.academies (id);

-- ─────────────────────────────────────────────────────────────
-- academy_coach_codes — jamais lisible côté client (RLS activée,
-- aucune policy). Seules les fonctions security definer ci-dessous
-- peuvent y lire/écrire. Change le code avant de le transmettre à
-- tes coachs : update public.academy_coach_codes set code = '...' where academy_id = '...';
-- ─────────────────────────────────────────────────────────────
create table public.academy_coach_codes (
  academy_id uuid primary key references public.academies (id) on delete cascade,
  code text not null
);

alter table public.academy_coach_codes enable row level security;

insert into public.academy_coach_codes (academy_id, code)
select id, 'DTZ-COACH-2026' from public.academies where slug = 'district-training-zone-montreuil';

-- ─────────────────────────────────────────────────────────────
-- belt_promotions
-- ─────────────────────────────────────────────────────────────
create table public.belt_promotions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  academy_id uuid not null references public.academies (id),
  belt text not null check (belt in ('white', 'blue', 'purple', 'brown', 'black')),
  stripes int not null default 0 check (stripes between 0 and 4),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  requested_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz
);

alter table public.belt_promotions enable row level security;

create policy "Promotions viewable by requester and academy coaches"
  on public.belt_promotions for select
  using (
    auth.uid() = profile_id
    or exists (
      select 1 from public.profiles c
      where c.id = auth.uid() and c.is_coach and c.academy_id = belt_promotions.academy_id
    )
  );

create policy "Users can request their own promotion"
  on public.belt_promotions for insert
  with check (
    auth.uid() = profile_id
    and academy_id = (select academy_id from public.profiles where id = auth.uid())
    and not exists (
      select 1 from public.belt_promotions p
      where p.profile_id = auth.uid() and p.status = 'pending'
    )
  );

-- Pas de policy update : les changements de statut passent
-- uniquement par approve_belt_promotion() ci-dessous.

-- ─────────────────────────────────────────────────────────────
-- Protection anti auto-validation
-- ─────────────────────────────────────────────────────────────
-- Sans ça, un utilisateur pourrait s'auto-valider en appelant
-- directement le SDK Supabase (`update profiles set belt_verified =
-- true where id = auth.uid()`), en contournant complètement l'UI.
-- Les fonctions security definer ci-dessous posent un flag de
-- transaction "trusted" avant d'écrire sur profiles ; ce trigger
-- bloque toute tentative de modifier ces colonnes sur SA PROPRE
-- ligne en dehors de ce contexte.
create or replace function public.prevent_self_promotion()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() = old.id and coalesce(current_setting('app.trusted_write', true), '') <> 'on' then
    if new.is_coach is distinct from old.is_coach
       or new.belt_verified is distinct from old.belt_verified
       or (old.belt_verified and (new.belt is distinct from old.belt or new.stripes is distinct from old.stripes)) then
      raise exception 'not allowed: use belt verification / a coach code to change this';
    end if;
  end if;
  return new;
end;
$$;

create trigger prevent_self_promotion
  before update on public.profiles
  for each row execute procedure public.prevent_self_promotion();

-- ─────────────────────────────────────────────────────────────
-- approve_belt_promotion — appelée par un coach depuis l'app
-- (supabase.rpc('approve_belt_promotion', { promotion_id, decision })).
-- Vérifie que l'appelant est bien coach de la même académie que la
-- demande avant d'écrire quoi que ce soit.
-- ─────────────────────────────────────────────────────────────
create or replace function public.approve_belt_promotion(promotion_id uuid, decision text)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  promo record;
  coach_academy uuid;
begin
  if decision not in ('approved', 'declined') then
    raise exception 'invalid decision';
  end if;

  select * into promo from public.belt_promotions where id = promotion_id;
  if promo is null then
    raise exception 'promotion not found';
  end if;

  select academy_id into coach_academy
  from public.profiles
  where id = auth.uid() and is_coach;

  if coach_academy is null or coach_academy is distinct from promo.academy_id then
    raise exception 'not authorized';
  end if;

  perform set_config('app.trusted_write', 'on', true);

  update public.belt_promotions
  set status = decision, reviewed_by = auth.uid(), reviewed_at = now()
  where id = promotion_id;

  if decision = 'approved' then
    update public.profiles
    set belt = promo.belt, stripes = promo.stripes, belt_verified = true
    where id = promo.profile_id;
  end if;
end;
$$;

grant execute on function public.approve_belt_promotion(uuid, text) to authenticated;

-- ─────────────────────────────────────────────────────────────
-- claim_coach — auto-service : un utilisateur saisit le code de son
-- académie (donné de vive voix par toi) pour devenir coach lui-même,
-- sans que tu aies besoin d'intervenir dans Supabase.
-- (supabase.rpc('claim_coach', { academy_id, code })).
-- ─────────────────────────────────────────────────────────────
create or replace function public.claim_coach(academy_id uuid, code text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.academy_coach_codes c
    where c.academy_id = claim_coach.academy_id and c.code = claim_coach.code
  ) then
    raise exception 'invalid code';
  end if;

  perform set_config('app.trusted_write', 'on', true);

  update public.profiles
  set is_coach = true
  where id = auth.uid();
end;
$$;

grant execute on function public.claim_coach(uuid, text) to authenticated;
