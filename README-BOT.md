# AdoptLuck Roblox Bot

## Prerequisites

1. Dedicated Roblox account for the bot (not your main).
2. Executor with **HttpService** enabled (Studio API access for testing, or live executor in Adopt Me).
3. Deployed AdoptLuck site with `BOT_SECRET` set in Vercel env.

## Configure

1. Edit `lua/Config.lua`:
   - `API_URL` → your `NEXT_PUBLIC_SITE_URL`
   - `BOT_SECRET` → same as server `BOT_SECRET`
2. Wire `TradeUtil.lua` to current Adopt Me trade remotes (game updates break paths often).

## Run

1. Join **Adopt Me** on the bot account.
2. Load scripts in order: `Config.lua`, `TradeUtil.lua`, `DepositHandler.lua`, `WithdrawHandler.lua`, `BotMain.lua`.
3. `BotMain` heartbeats every 15s and logs pending queue counts.

## Test deposit

1. On the site, create a small deposit and note the **trade code**.
2. Trade the listed pets to the bot account.
3. When `DepositHandler` accepts the trade, the bot POSTs `/api/bot/deposit-confirm`.
4. Deposit status → **confirmed**, credits + inventory update.

## Test withdraw

1. User requests withdraw on site (inventory locked).
2. Bot polls `/api/bot/pending`, sends trade via `WithdrawHandler`.
3. On success, POST `/api/bot/withdraw-confirm`.

## Security

- Never commit `BOT_SECRET` or share executor configs publicly.
- Rotate `BOT_SECRET` if leaked.
