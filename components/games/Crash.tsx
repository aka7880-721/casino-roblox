"use client";

import { useState } from "react";
import type { DbGame } from "@/lib/types";
import { BetControls, useGamePlay } from "./game-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Crash({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const [cashoutAt, setCashoutAt] = useState(2);
  const { play, loading, last } = useGamePlay("crash");
  const crash = (last?.data as { crashPoint?: number })?.crashPoint;

  return (
    <BetControls game={game} amount={amount} setAmount={setAmount} loading={loading} onPlay={() => play(amount, { cashoutAt })}>
      <Label>Cashout at</Label>
      <Input type="number" step={0.1} min={1.01} value={cashoutAt} onChange={(e) => setCashoutAt(Number(e.target.value))} />
      <p className="text-center text-red-400">Crashed at {crash?.toFixed(2) ?? "—"}x</p>
    </BetControls>
  );
}
