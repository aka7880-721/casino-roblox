import type { GameResolver } from "./types";

export const play: GameResolver = (input, fairRng) => {
  const petIndex = Number(input.payload.petIndex ?? 0);
  const lanes = 5;
  const speeds = Array.from({ length: lanes }, () => fairRng());
  const winner = speeds.indexOf(Math.max(...speeds));
  const win = winner === petIndex;
  const odds = Number(input.payload.odds ?? 4);
  const edge = 1 - input.houseEdge;
  const payout = win ? input.amount * odds * edge : 0;
  return {
    win,
    payout,
    multiplier: win ? odds * edge : 0,
    data: { speeds, winner, petIndex, odds },
  };
};
