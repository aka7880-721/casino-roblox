# Database

1. **Schema** — run `migrations/20250101000000_init.sql` in the Supabase SQL editor (or `supabase db push` with CLI).
2. **Seed** — run `seed.sql` (pets, 13 games, site settings).

Regenerate seed data after editing `scripts/generate-seed.mjs`:

```bash
node scripts/generate-seed.mjs
```
