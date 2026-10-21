"use client";

import { useState } from "react";
import type { DbGame } from "@/lib/types";
import { BetControls, useGamePlay } from "./game-shell";
import { Input } from "@/components/ui/input";

export function Limbo({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const [target, setTarget] = useState(2);
  const { play, loading, last } = useGamePlay("limbo");
  const result = (last?.data as { result?: number })?.result;

  return (
    <BetControls game={game} amount={amount} setAmount={setAmount} loading={loading} onPlay={() => play(amount, { target })}>
      <Input type="number" step={0.1} min={1.01} value={target} onChange={(e) => setTarget(Number(e.target.value))} />
      <p className="text-center text-2xl">{result ? `${result.toFixed(2)}x` : "—"}</p>
    </BetControls>
  );
}
