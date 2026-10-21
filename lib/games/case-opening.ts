import type { GameResolver } from "./types";

export const play: GameResolver = (input, fairRng) => {
  const pool =
    (input.config.pool as { name: string; value: number; weight: number }[]) ?? [
      { name: "Common", value: 50, weight: 50 },
      { name: "Rare", value: 200, weight: 30 },
      { name: "Legendary", value: 2000, weight: 5 },
    ];
  const total = pool.reduce((s, p) => s + p.weight, 0);
  let r = fairRng() * total;
  let item = pool[0];
  for (const p of pool) {
    r -= p.weight;
    if (r <= 0) {
      item = p;
      break;
    }
  }
  const edge = 1 - input.houseEdge;
  const payout = item.value * edge;
  return {
    win: payout > input.amount,
    payout,
    multiplier: payout / input.amount,
    data: { item },
  };
};
