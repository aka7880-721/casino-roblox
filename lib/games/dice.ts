import type { GameResolver } from "./types";

export const play: GameResolver = (input, fairRng) => {
  const target = Number(input.payload.target ?? 50);
  const direction = String(input.payload.direction ?? "over");
  const roll = Math.floor(fairRng() * 100) + 1;
  const win =
    direction === "over" ? roll > target : roll < target;
  const prob =
    direction === "over" ? (100 - target) / 100 : (target - 1) / 100;
  const edge = 1 - input.houseEdge;
  const mult = prob > 0 ? edge / prob : 0;
  const payout = win ? input.amount * mult : 0;
  return {
    win,
    payout,
    multiplier: win ? mult : 0,
    data: { roll, target, direction },
  };
};
