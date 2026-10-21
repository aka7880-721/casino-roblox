import type { GameResolver } from "./types";

export const play: GameResolver = (input, fairRng) => {
  const target = Number(input.payload.target ?? 2);
  const edge = 1 - input.houseEdge;
  const result = edge / (fairRng() || 0.0001);
  const win = result >= target;
  const payout = win ? input.amount * target : 0;
  return {
    win,
    payout,
    multiplier: win ? target : 0,
    data: { result, target },
  };
};
