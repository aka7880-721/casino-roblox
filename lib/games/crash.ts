import type { GameResolver } from "./types";

export const play: GameResolver = (input, fairRng) => {
  const edge = 1 - input.houseEdge;
  const crashPoint = Math.max(1, edge / (fairRng() || 0.0001));
  const cashoutAt = Number(input.payload.cashoutAt ?? 0);
  if (cashoutAt <= 0) {
    return {
      win: false,
      payout: 0,
      data: { crashPoint, busted: true },
    };
  }
  const win = cashoutAt <= crashPoint;
  const payout = win ? input.amount * cashoutAt : 0;
  return {
    win,
    payout,
    multiplier: win ? cashoutAt : 0,
    data: { crashPoint, cashoutAt },
  };
};
