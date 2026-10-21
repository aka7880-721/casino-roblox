# AdoptLuck

Production-style Adopt Me casino web app (Next.js 14 + Supabase) with DB-driven games, provably fair bets, admin panel, and Roblox bot hooks.

## Stack

- Next.js 14 App Router, TypeScript, Tailwind, shadcn-style UI
- Supabase (Postgres, Auth, Realtime)
- Framer Motion, sonner
- Vercel-ready (`vercel.json`)

## Setup

1. **Clone & install**

   ```bash
   npm install
   cp .env.example .env.local
   ```

2. **Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - Run `supabase/migrations/20250101000000_init.sql` in the SQL editor (or `supabase db push` with CLI).
   - Run `supabase/seed.sql` for pets + 13 games (CoinFlip, Jackpot, Upgrader, Race enabled).
   - See `supabase/README.md` for details.
   - Enable Email auth; set site URL to `http://localhost:3000` for dev.

3. **Env** (`.env.local`)

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server + admin API only)
   - `BOT_SECRET`
   - `NEXT_PUBLIC_SITE_URL`

4. **Admin user**

   - Register `admin@adoptluck.gg` with password `password` (or your choice).
   - In SQL: `update public.users set role = 'admin' where email = 'admin@adoptluck.gg';`

5. **Dev**

   Double-click **`run.bat`** (Windows) or run **`./run.sh`** (Mac/Linux), or:

   ```bash
   npm run run
   ```

   Production build + serve: `run.bat --prod` or `npm run run:prod`.

## Adding a game (zero toggle code)

1. `insert into games (...)`.
2. Add `lib/games/{slug}.ts` exporting `play`.
3. Add `components/games/{Name}.tsx` and register in `components/games/registry.tsx`.

## Deploy (Vercel)

1. Import repo, set env vars from `.env.example`.
2. Deploy; point `NEXT_PUBLIC_SITE_URL` to production URL.
3. Update Supabase auth redirect URLs.

## Bot

See [README-BOT.md](./README-BOT.md).

## Values refresh

Admin → Pet values → **Scrape Elvebredd**, or `POST /api/values/refresh` as admin. Falls back to seed if scrape fails.

## Project layout

See **[docs/STRUCTURE.md](./docs/STRUCTURE.md)** for the full tree.

- `app/(marketing)/` — landing `/`
- `app/(main)/` — app pages + sidebar
- `app/api/` — backend routes
- `lib/games/` + `components/games/` — game logic & UI
- `supabase/migrations/` + `seed.sql` — database
- `lua/` — Roblox bot
