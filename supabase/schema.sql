create extension if not exists pgcrypto;

create table if not exists public.submitted_runs (
  id uuid primary key default gen_random_uuid(),
  manager_name text not null check (char_length(manager_name) between 1 and 24),
  class_id text not null check (class_id in ('wizard','goblin','rat','necro','gremlin','commissioner')),
  status text not null check (status in ('victory','defeat')),
  floor integer not null check (floor between 1 and 18),
  duration_seconds integer not null check (duration_seconds between 0 and 43200),
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

alter table public.submitted_runs enable row level security;
alter table public.achievement_feed enable row level security;
alter table public.weekly_challenges enable row level security;

-- No browser policies by design. Validated Netlify Functions use a server-only
-- Supabase secret key; the game remains fully playable when it is absent.
