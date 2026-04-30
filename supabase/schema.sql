-- PickSniff Supabase Schema
-- Run this in your Supabase project: Dashboard → SQL Editor → New query → paste → Run

-- PROFILES
create table public.profiles (
  id                  uuid references auth.users on delete cascade primary key,
  username            text unique not null,
  bio                 text default '',
  favorite_fragrance  text default '',
  is_premium          boolean default false,
  premium_expires_at  timestamptz,
  stripe_customer_id  text,
  profile_border_color text default '',
  created_at          timestamptz default now()
);

-- Add premium columns to existing installs (safe to run on fresh db too)
-- alter table public.profiles add column if not exists premium_expires_at timestamptz;
-- alter table public.profiles add column if not exists stripe_customer_id text;
-- alter table public.profiles add column if not exists profile_border_color text default '';
alter table public.profiles enable row level security;
create policy "Profiles are publicly viewable"
  on public.profiles for select using (true);
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- WISHLIST
create table public.wishlist (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users on delete cascade not null,
  fragrance_id text not null,
  created_at   timestamptz default now(),
  unique(user_id, fragrance_id)
);
alter table public.wishlist enable row level security;
create policy "Wishlist is publicly viewable"
  on public.wishlist for select using (true);
create policy "Users can manage their own wishlist"
  on public.wishlist for all using (auth.uid() = user_id);

-- OWNED
create table public.owned (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users on delete cascade not null,
  fragrance_id text not null,
  created_at   timestamptz default now(),
  unique(user_id, fragrance_id)
);
alter table public.owned enable row level security;
create policy "Owned is publicly viewable"
  on public.owned for select using (true);
create policy "Users can manage their own owned collection"
  on public.owned for all using (auth.uid() = user_id);

-- QUIZ RESULTS
create table public.quiz_results (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users on delete cascade not null,
  genders    text[] not null,
  tier       text not null,
  vibe       text not null,
  accords    text[] default '{}',
  created_at timestamptz default now()
);
alter table public.quiz_results enable row level security;
create policy "Quiz results are publicly viewable"
  on public.quiz_results for select using (true);
create policy "Users can manage their own quiz results"
  on public.quiz_results for all using (auth.uid() = user_id);
