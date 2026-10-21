import { createRound, fairRngFromRound, reveal } from "@/lib/fair";
import { getGameResolver } from "@/lib/games";
import type { DbGame } from "@/lib/types";
import { createAdminClient } from "@/lib/supabase/admin";

export async function executeGamePlay(params: {
  userId: string;
  game: DbGame;
  amount: number;
  payload: Record<string, unknown>;
  clientSeed?: string;
  nonce?: number;
  petIds?: string[];
}) {
  const admin = createAdminClient();
  const { data: user, error: userErr } = await admin
    .from("users")
    .select("balance, banned, xp, level")
    .eq("id", params.userId)
    .single();
  if (userErr || !user) throw new Error("User not found");
  if (user.banned) throw new Error("Account banned");
  if (params.amount < params.game.min_bet || params.amount > params.game.max_bet) {
    throw new Error("Bet out of limits");
  }
  if (Number(user.balance) < params.amount) throw new Error("Insufficient balance");

  const resolver = getGameResolver(params.game.slug);
  if (!resolver) throw new Error("Game not implemented");

  const round = createRound(params.clientSeed, params.nonce ?? 0);
  const fairRng = fairRngFromRound(round);
  const result = resolver(
    {
      amount: params.amount,
      houseEdge: Number(params.game.house_edge),
      config: params.game.config ?? {},
      payload: params.payload,
    },
    fairRng
  );

  const newBalance = Number(user.balance) - params.amount + Number(result.payout);
  const xpGain = Math.floor(params.amount / 10);
  const xp = Number(user.xp) + xpGain;
  const level = Math.floor(xp / 1000) + 1;

  const { error: betErr } = await admin.from("bets").insert({
    user_id: params.userId,
    game_slug: params.game.slug,
    amount: params.amount,
    pet_ids: params.petIds ?? [],
    result: { ...result.data, win: result.win },
    payout: result.payout,
    server_seed: round.serverSeed,
    server_seed_hash: round.serverSeedHash,
    client_seed: round.clientSeed,
    nonce: round.nonce,
  });
  if (betErr) throw new Error(betErr.message);

  const { error: balErr } = await admin
    .from("users")
    .update({ balance: newBalance, xp, level })
    .eq("id", params.userId);
  if (balErr) throw new Error(balErr.message);

  return {
    ...result,
    balance: newBalance,
    fair: reveal(round),
  };
}
