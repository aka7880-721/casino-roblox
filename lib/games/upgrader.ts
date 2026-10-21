import type { GameResolver } from "./types";

export const play: GameResolver = (input, fairRng) => {
  const target = Number(input.payload.targetMultiplier ?? 2);
  const clamped = Math.min(10, Math.max(1.5, target));
  const winChance = (1 - input.houseEdge) / clamped;
  const roll = fairRng();
  const win = roll < winChance;
  const payout = win ? input.amount * clamped : 0;
  return {
    win,
    payout,
    multiplier: win ? clamped : 0,
    data: { roll, winChance, targetMultiplier: clamped },
  };
};
