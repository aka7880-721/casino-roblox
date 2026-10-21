"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { DbGame } from "@/lib/types";
import { BetControls, useGamePlay } from "./game-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Upgrader({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const [target, setTarget] = useState(2);
  const { play, loading, last } = useGamePlay("upgrader");

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <BetControls
        game={game}
        amount={amount}
        setAmount={setAmount}
        loading={loading}
        onPlay={() => play(amount, { targetMultiplier: target })}
      >
        <div className="space-y-2">
          <Label>Target multiplier (1.5–10)</Label>
          <Input type="number" step={0.5} min={1.5} max={10} value={target} onChange={(e) => setTarget(Number(e.target.value))} />
        </div>
      </BetControls>
      <motion.div
        key={String(last?.win)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="h-48 rounded-xl border border-white/10 flex items-center justify-center text-2xl"
      >
        {last ? (last.win ? "UPGRADE!" : "FAIL") : "Roll to upgrade"}
      </motion.div>
    </div>
  );
}
