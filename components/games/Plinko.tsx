"use client";

import { useState } from "react";
import type { DbGame } from "@/lib/types";
import { BetControls, useGamePlay } from "./game-shell";
import { Button } from "@/components/ui/button";

export function Plinko({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const [risk, setRisk] = useState("medium");
  const { play, loading, last } = useGamePlay("plinko");

  return (
    <BetControls game={game} amount={amount} setAmount={setAmount} loading={loading} onPlay={() => play(amount, { risk })}>
      <div className="flex gap-2">
        {["low", "medium", "high"].map((r) => (
          <Button key={r} type="button" variant={risk === r ? "default" : "outline"} onClick={() => setRisk(r)}>{r}</Button>
        ))}
      </div>
      <p className="text-center">Multiplier: {last?.multiplier?.toFixed(2) ?? "—"}</p>
    </BetControls>
  );
}
