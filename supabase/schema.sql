create extension if not exists pgcrypto;

create table if not exists public.submitted_runs (
  id uuid primary key default gen_random_uuid(),
  manager_name text not null check (char_length(manager_name) between 1 and 24),
  class_id text not null check (class_id in ('wizard','goblin','rat','necro','gremlin','commissioner')),
  status text not null check (status in ('victory','defeat')),
  floor integer not null check (floor between 1 and 40),
  duration_seconds integer not null check (duration_seconds between 0 and 86400),
  score integer not null default 0 check (score >= 0),
  week_key text not null,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.achievement_feed (
  id uuid primary key default gen_random_uuid(),
  manager_name text not null check (char_length(manager_name) between 1 and 24),
  achievement_id text not null,
  created_at timestamptz not null default now(),
  unique (manager_name, achievement_id)
);

create table if not exists public.weekly_challenges (
  id uuid primary key default gen_random_uuid(),
  week_key text not null unique,
  seed text not null,
  name text not null,
  modifier text not null,
  featured_boss text not null,
  loot_theme text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at)
);

create table if not exists public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.submitted_runs(id) on delete cascade,
  score integer not null check (score >= 0),
  week_key text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  player_public_id text not null unique,
  manager_name text not null check (char_length(manager_name) between 1 and 24),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meta_progression (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  player_public_id text not null unique,
  manager_name text not null check (char_length(manager_name) between 1 and 24),
  level integer not null check (level between 1 and 50),
  xp integer not null check (xp >= 0),
  essence integer not null check (essence >= 0),
  lifetime_runs integer not null check (lifetime_runs >= 0),
  best_floor integer not null check (best_floor between 0 and 40),
  clears_18 integer not null check (clears_18 >= 0),
  clears_40 integer not null check (clears_40 >= 0),
  unlocked_depth integer not null check (unlocked_depth between 18 and 40),
  class_mastery jsonb not null default '{}'::jsonb,
  achievements jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.meta_run_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  run_seed bigint not null,
  floor integer not null check (floor between 1 and 40),
  class_id text not null check (class_id in ('wizard','goblin','rat','necro','gremlin','commissioner')),
  won boolean not null,
  campaign_cleared boolean not null,
  duration_seconds integer not null check (duration_seconds between 0 and 86400),
  xp_awarded integer not null check (xp_awarded >= 0),
  essence_awarded integer not null check (essence_awarded >= 0),
  created_at timestamptz not null default now()
);

alter table public.submitted_runs enable row level security;
alter table public.achievement_feed enable row level security;
alter table public.leaderboard_entries enable row level security;
alter table public.weekly_challenges enable row level security;
alter table public.profiles enable row level security;
alter table public.meta_progression enable row level security;
alter table public.meta_run_events enable row level security;

grant select, insert, update on public.profiles to service_role;
grant select, insert, update on public.meta_progression to service_role;
grant select, insert on public.meta_run_events to service_role;
grant select, insert on public.submitted_runs to service_role;
grant select, insert on public.leaderboard_entries to service_role;
grant select, insert on public.achievement_feed to service_role;
grant select on public.weekly_challenges to service_role;

-- No browser policies by design. Validated Netlify Functions use a server-only
-- Supabase secret key; the game remains fully playable when it is absent.
