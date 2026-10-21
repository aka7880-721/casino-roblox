import type { GameResolver } from "./types";

const RED = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

export const play: GameResolver = (input, fairRng) => {
  const number = Math.floor(fairRng() * 37);
  const betType = String(input.payload.betType ?? "red");
  const edge = 1 - input.houseEdge;
  let win = false;
  let mult = 0;
  if (betType === "red") {
    win = RED.has(number) && number !== 0;
    mult = 2 * edge;
  } else if (betType === "black") {
    win = !RED.has(number) && number !== 0;
    mult = 2 * edge;
  } else if (betType === "green") {
    win = number === 0;
    mult = 14 * edge;
  } else {
    const pick = Number(input.payload.number ?? 0);
    win = number === pick;
    mult = 36 * edge;
  }
  const payout = win ? input.amount * mult : 0;
  return {
    win,
    payout,
    multiplier: win ? mult : 0,
    data: { number, betType, color: number === 0 ? "green" : RED.has(number) ? "red" : "black" },
  };
};
