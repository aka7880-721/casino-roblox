# Project structure

```
adoptluck/
├── app/
│   ├── layout.tsx              # Root HTML shell + toaster
│   ├── globals.css
│   ├── (marketing)/            # Public landing (no sidebar)
│   │   ├── layout.tsx          # Top nav only
│   │   └── page.tsx            # /
│   ├── (main)/                 # App pages (sidebar shell)
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── coinflip/ jackpot/ upgrader/ race/   # featured games
│   │   ├── games/[slug]/     # all other games
│   │   ├── deposit/ withdraw/ inventory/ values/
│   │   ├── leaderboard/ profile/[username]/
│   │   ├── login/ register/ admin/
│   └── api/                    # Route handlers (see below)
├── components/
│   ├── ui/                     # shadcn-style primitives
│   ├── layout/                 # SiteShell, LandingShell, NavLinks
│   ├── home/                   # LandingPage, GamesSection, GameGrid
│   ├── games/                  # One TSX per game + registry + game-shell
│   └── admin/                  # AdminPanel
├── lib/
│   ├── games/                  # One resolver per game (provably fair play())
│   ├── supabase/               # browser / server / admin clients
│   ├── fair.ts                 # Seeds, verify, RNG
│   ├── bets.ts                 # Shared bet execution
│   ├── data.ts                 # Server data loaders
│   └── env.ts                  # Supabase configured? + timeouts
├── supabase/
│   ├── migrations/             # Source of truth for DB schema
│   └── seed.sql                # Pets + games + settings
├── lua/                        # Roblox bot (HttpService)
├── scripts/
│   ├── run.mjs                 # Used by run.bat / run.sh
│   └── generate-seed.mjs       # Regenerate seed.sql
├── run.bat / run.sh            # Start dev on any PC
├── middleware.ts               # Auth cookie refresh (when Supabase configured)
└── README.md / README-BOT.md
```

## API routes (`app/api/`)

| Path | Purpose |
|------|---------|
| `games`, `games/[slug]/play`, `games/jackpot/enter` | Play & jackpot |
| `deposit`, `withdraw` | User flows |
| `bot/*` | Roblox bot (header `x-bot-secret`) |
| `admin/*` | Admin CRUD + jackpot control |
| `values/refresh` | Elvebredd scrape |
| `auth/signout` | Logout |

## Adding a game

1. Row in `games` table (via admin or SQL).
2. `lib/games/{slug}.ts` → export `play`.
3. `components/games/{Name}.tsx` + entry in `components/games/registry.tsx`.
