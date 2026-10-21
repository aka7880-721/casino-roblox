import type { GameResolver } from "./types";

export const play: GameResolver = (input, fairRng) => {
  const rows = Number(input.config.rows ?? 12);
  const risk = String(input.payload.risk ?? "medium");
  const multTable: Record<string, number[]> = {
    low: [0.5, 0.7, 1, 1.2, 1.5, 2, 1.5, 1.2, 1, 0.7, 0.5],
    medium: [0.3, 0.5, 1, 1.5, 2, 3, 2, 1.5, 1, 0.5, 0.3],
    high: [0.1, 0.3, 0.5, 1, 2, 5, 2, 1, 0.5, 0.3, 0.1],
  };
  const slots = multTable[risk] ?? multTable.medium;
  let slot = 0;
  for (let i = 0; i < rows; i++) {
    slot += fairRng() < 0.5 ? 0 : 1;
  }
  slot = Math.min(slots.length - 1, Math.floor((slot / rows) * slots.length));
  const edge = 1 - input.houseEdge;
  const mult = slots[slot] * edge;
  return {
    win: mult > 1,
    payout: input.amount * mult,
    multiplier: mult,
    data: { slot, rows, risk, path: slot },
  };
};
