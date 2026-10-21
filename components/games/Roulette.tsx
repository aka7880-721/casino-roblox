"use client";

import { useState } from "react";
import type { DbGame } from "@/lib/types";
import { BetControls, useGamePlay } from "./game-shell";
import { Button } from "@/components/ui/button";

export function Roulette({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const [betType, setBetType] = useState("red");
  const { play, loading, last } = useGamePlay("roulette");
  const num = (last?.data as { number?: number; color?: string })?.number;

  return (
    <BetControls game={game} amount={amount} setAmount={setAmount} loading={loading} onPlay={() => play(amount, { betType })}>
      <div className="flex flex-wrap gap-2">
        {["red", "black", "green"].map((b) => (
          <Button key={b} type="button" variant={betType === b ? "default" : "outline"} onClick={() => setBetType(b)}>{b}</Button>
        ))}
      </div>
      <p className="text-3xl text-center">{num ?? "—"}</p>
    </BetControls>
  );
}
