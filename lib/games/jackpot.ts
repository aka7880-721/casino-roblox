import type { GameResolver } from "./types";

/** Single entry weight check — round winner picked server-side separately */
export const play: GameResolver = (input, fairRng) => {
  const ticket = fairRng();
  return {
    win: true,
    payout: 0,
    data: { ticket, entryValue: input.amount, action: "enter" },
  };
};
