import type { GameResolver } from "./types";

export const play: GameResolver = (input, fairRng) => {
  const floor = Number(input.payload.floor ?? 0);
  const pick = Number(input.payload.pick ?? 0);
  const tiles = 3;
  const trap = Math.floor(fairRng() * tiles);
  const win = pick !== trap;
  const floors = 9;
  if (!win) {
    return {
      win: false,
      payout: 0,
      data: { floor, pick, trap, gameOver: true },
    };
  }
  const nextFloor = floor + 1;
  const edge = 1 - input.houseEdge;
  const mult = Math.pow(tiles / (tiles - 1), nextFloor) * edge;
  if (nextFloor >= floors || input.payload.cashout) {
    return {
      win: true,
      payout: input.amount * mult,
      multiplier: mult,
      data: { floor: nextFloor, trap, cashedOut: true },
    };
  }
  return {
    win: true,
    payout: 0,
    multiplier: mult,
    data: { floor: nextFloor, trap, continue: true },
  };
};
