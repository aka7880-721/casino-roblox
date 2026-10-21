import type { GameResolver } from "./types";

export const play: GameResolver = (input, fairRng) => {
  const segments =
    (input.config.segments as { label: string; mult: number }[]) ?? [
      { label: "0.5x", mult: 0.5 },
      { label: "1x", mult: 1 },
      { label: "2x", mult: 2 },
      { label: "5x", mult: 5 },
      { label: "10x", mult: 10 },
    ];
  const idx = Math.floor(fairRng() * segments.length);
  const seg = segments[idx];
  const edge = 1 - input.houseEdge;
  const mult = seg.mult * edge;
  const payout = input.amount * mult;
  return {
    win: mult >= input.amount,
    payout,
    multiplier: mult,
    data: { index: idx, segment: seg },
  };
};
