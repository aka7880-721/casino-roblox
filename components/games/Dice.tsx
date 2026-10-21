"use client";

import { useState } from "react";
import type { DbGame } from "@/lib/types";
import { BetControls, useGamePlay } from "./game-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Dice({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const [target, setTarget] = useState(50);
  const [direction, setDirection] = useState<"over" | "under">("over");
  const { play, loading, last } = useGamePlay("dice");
  const roll = (last?.data as { roll?: number })?.roll;

  return (
    <BetControls game={game} amount={amount} setAmount={setAmount} loading={loading} onPlay={() => play(amount, { target, direction })}>
      <div className="flex gap-2">
        <Button type="button" variant={direction === "over" ? "default" : "outline"} onClick={() => setDirection("over")}>Over</Button>
        <Button type="button" variant={direction === "under" ? "default" : "outline"} onClick={() => setDirection("under")}>Under</Button>
      </div>
      <Input type="number" min={1} max={99} value={target} onChange={(e) => setTarget(Number(e.target.value))} />
      <p className="text-3xl text-center py-4">{roll ?? "—"}</p>
    </BetControls>
  );
}
