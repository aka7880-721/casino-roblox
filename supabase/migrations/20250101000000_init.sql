-- AdoptLuck initial schema
create extension if not exists "pgcrypto";

create type public.user_role as enum ('user', 'admin');
create type public.deposit_status as enum ('pending', 'confirmed', 'rejected');
create type public.withdrawal_status as enum ('pending', 'processing', 'completed', 'rejected');
create type public.jackpot_round_status as enum ('open', 'drawing', 'completed', 'refunded');
create type public.race_status as enum ('waiting', 'running', 'completed');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  email text unique not null,
  balance numeric(18, 2) not null default 1000 check (balance >= 0),
  role public.user_role not null default 'user',
  avatar_url text,
  level int not null default 1,
  xp bigint not null default 0,
  banned boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.pets (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  image_url text,
  value numeric(18, 2) not null default 0,
  rarity text not null default 'Common',
  demand text not null default 'Normal',
  updated_at timestamptz not null default now()
);

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete restrict,
  acquired_at timestamptz not null default now()
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  category text not null default 'classic',
  enabled boolean not null default false,
  min_bet numeric(18, 2) not null default 10,
  max_bet numeric(18, 2) not null default 100000,
  house_edge numeric(6, 4) not null default 0.02,
  config jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  game_slug text not null,
  amount numeric(18, 2) not null,
  pet_ids uuid[] default '{}',
  result jsonb not null default '{}'::jsonb,
  payout numeric(18, 2) not null default 0,
  server_seed text not null,
  server_seed_hash text not null,
  client_seed text not null,
  nonce int not null default 0,
  created_at timestamptz not null default now()
);

create table public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  pet_ids uuid[] not null default '{}',
  total_value numeric(18, 2) not null default 0,
  status public.deposit_status not null default 'pending',
  trade_code text,
  created_at timestamptz not null default now()
);

create table public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  pet_ids uuid[] not null default '{}',
  total_value numeric(18, 2) not null default 0,
  status public.withdrawal_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.jackpot_rounds (
  id uuid primary key default gen_random_uuid(),
  status public.jackpot_round_status not null default 'open',
  pot_value numeric(18, 2) not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  winner_id uuid references public.users(id)
);

create table public.jackpot_entries (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.jackpot_rounds(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  pet_ids uuid[] default '{}',
  value numeric(18, 2) not null,
  created_at timestamptz not null default now()
);

create table public.races (
  id uuid primary key default gen_random_uuid(),
  status public.race_status not null default 'waiting',
  entrants jsonb not null default '[]'::jsonb,
  winner_id uuid references public.users(id),
  started_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.users(id),
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.bot_status (
  id int primary key default 1 check (id = 1),
  online boolean not null default false,
  last_heartbeat timestamptz
);

insert into public.bot_status (id, online) values (1, false);

create index bets_user_created on public.bets(user_id, created_at desc);
create index bets_game_created on public.bets(game_slug, created_at desc);
create index inventory_user on public.inventory(user_id);
create index deposits_status on public.deposits(status);
create index withdrawals_status on public.withdrawals(status);

-- Leaderboard helpers
create or replace view public.leaderboard_profit as
select u.id, u.username, u.avatar_url, u.level,
  coalesce(sum(b.payout - b.amount), 0) as metric
from public.users u
left join public.bets b on b.user_id = u.id
where u.banned = false
group by u.id;

create or replace view public.leaderboard_wagered as
select u.id, u.username, u.avatar_url, u.level,
  coalesce(sum(b.amount), 0) as metric
from public.users u
left join public.bets b on b.user_id = u.id
where u.banned = false
group by u.id;

create or replace view public.leaderboard_biggest_win as
select u.id, u.username, u.avatar_url, u.level,
  coalesce(max(b.payout), 0) as metric
from public.users u
left join public.bets b on b.user_id = u.id
where u.banned = false
group by u.id;

create or replace view public.leaderboard_level as
select id, username, avatar_url, level, xp as metric
from public.users
where banned = false
order by level desc, xp desc;

-- New auth user profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  uname text;
begin
  uname := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  while exists (select 1 from public.users where username = uname) loop
    uname := uname || floor(random() * 1000)::text;
  end loop;
  insert into public.users (id, username, email, balance, role)
  values (new.id, uname, new.email, 1000, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.users enable row level security;
alter table public.pets enable row level security;
alter table public.inventory enable row level security;
alter table public.games enable row level security;
alter table public.bets enable row level security;
alter table public.deposits enable row level security;
alter table public.withdrawals enable row level security;
alter table public.jackpot_rounds enable row level security;
alter table public.jackpot_entries enable row level security;
alter table public.races enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_log enable row level security;
alter table public.bot_status enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin' and banned = false
  );
$$;

-- users
create policy users_select_own on public.users for select using (auth.uid() = id or public.is_admin());
create policy users_select_public on public.users for select using (true);
create policy users_update_own on public.users for update using (auth.uid() = id);
create policy users_admin_all on public.users for all using (public.is_admin());

-- pets public read
create policy pets_read on public.pets for select using (true);
create policy pets_admin on public.pets for all using (public.is_admin());

-- inventory
create policy inventory_own on public.inventory for select using (auth.uid() = user_id or public.is_admin());
create policy inventory_insert_own on public.inventory for insert with check (auth.uid() = user_id);
create policy inventory_admin on public.inventory for all using (public.is_admin());

-- games public read
create policy games_read on public.games for select using (true);
create policy games_admin on public.games for all using (public.is_admin());

-- bets
create policy bets_own on public.bets for select using (auth.uid() = user_id or public.is_admin());
create policy bets_insert_own on public.bets for insert with check (auth.uid() = user_id);
create policy bets_admin on public.bets for all using (public.is_admin());

-- deposits / withdrawals
create policy deposits_own on public.deposits for all using (auth.uid() = user_id or public.is_admin());
create policy withdrawals_own on public.withdrawals for all using (auth.uid() = user_id or public.is_admin());

-- jackpot
create policy jackpot_rounds_read on public.jackpot_rounds for select using (true);
create policy jackpot_rounds_admin on public.jackpot_rounds for all using (public.is_admin());
create policy jackpot_entries_read on public.jackpot_entries for select using (true);
create policy jackpot_entries_insert on public.jackpot_entries for insert with check (auth.uid() = user_id);
create policy jackpot_entries_admin on public.jackpot_entries for all using (public.is_admin());

-- races
create policy races_read on public.races for select using (true);
create policy races_admin on public.races for all using (public.is_admin());

-- site settings: public read announcement/maintenance keys only via API; admin write
create policy settings_read on public.site_settings for select using (true);
create policy settings_admin on public.site_settings for all using (public.is_admin());

create policy audit_admin on public.audit_log for select using (public.is_admin());
create policy audit_insert on public.audit_log for insert with check (public.is_admin());

create policy bot_read on public.bot_status for select using (true);
create policy bot_admin on public.bot_status for all using (public.is_admin());

-- Realtime
alter publication supabase_realtime add table public.jackpot_rounds;
alter publication supabase_realtime add table public.jackpot_entries;
alter publication supabase_realtime add table public.races;
