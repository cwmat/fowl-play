create extension if not exists pgcrypto;

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  status text not null default 'lobby'
    check (status in ('lobby', 'question_intro', 'answering', 'reveal', 'scoreboard', 'finished')),
  current_q_index integer not null default 0,
  question_started_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key,
  game_id uuid not null references public.games(id) on delete cascade,
  name text not null,
  avatar text not null,
  score integer not null default 0,
  last_seen timestamptz not null default now(),
  joined_at timestamptz not null default now()
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  q_index integer not null,
  choice text not null,
  is_correct boolean,
  points_awarded integer not null default 0,
  answered_at timestamptz not null default now(),
  unique (game_id, player_id, q_index)
);

alter table public.games enable row level security;
alter table public.players enable row level security;
alter table public.answers enable row level security;

create policy "party games are readable" on public.games
  for select using (true);

create policy "party games are writable" on public.games
  for all using (true) with check (true);

create policy "party players are readable" on public.players
  for select using (true);

create policy "party players are writable" on public.players
  for all using (true) with check (true);

create policy "party answers are readable" on public.answers
  for select using (true);

create policy "party answers are writable" on public.answers
  for all using (true) with check (true);

alter publication supabase_realtime add table public.games;
alter publication supabase_realtime add table public.players;
alter publication supabase_realtime add table public.answers;
