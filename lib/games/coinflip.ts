import type { GameResolver } from "./types";

/** Pick heads/tails; optional PvP uses same roll vs opponent side */
export const play: GameResolver = (input, fairRng) => {
  const side = String(input.payload.side ?? "heads");
  const roll = fairRng() < 0.5 ? "heads" : "tails";
  const win = roll === side;
  const edge = 1 - input.houseEdge;
  const payout = win ? input.amount * 2 * edge : 0;
  return {
    win,
    payout,
    multiplier: win ? 2 * edge : 0,
    data: { roll, side, mode: input.payload.mode ?? "bot" },
  };
};
