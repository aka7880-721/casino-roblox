import type { GameResolver } from "./types";

export const play: GameResolver = (input, fairRng) => {
  const action = String(input.payload.action ?? "reveal");
  const mines = Number(input.config.mines ?? 5);
  const grid = 25;
  if (action === "cashout") {
    const revealed = Number(input.payload.revealed ?? 0);
    const safe = grid - mines;
    let mult = 1;
    for (let i = 0; i < revealed; i++) {
      mult *= (grid - i) / (safe - i);
    }
    mult *= 1 - input.houseEdge;
    return {
      win: true,
      payout: input.amount * mult,
      multiplier: mult,
      data: { action: "cashout", revealed },
    };
  }
  const minePositions = new Set<number>();
  while (minePositions.size < mines) {
    minePositions.add(Math.floor(fairRng() * grid));
  }
  const cell = Number(input.payload.cell ?? 0);
  const hit = minePositions.has(cell);
  const revealed = Number(input.payload.revealed ?? 0) + (hit ? 0 : 1);
  return {
    win: !hit,
    payout: 0,
    data: {
      action: "reveal",
      cell,
      hit,
      revealed,
      minePositions: hit ? Array.from(minePositions) : undefined,
    },
  };
};
