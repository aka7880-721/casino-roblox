"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { DbGame } from "@/lib/types";
import { BetControls, useGamePlay } from "./game-shell";
import { Button } from "@/components/ui/button";

export function CoinFlip({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const [side, setSide] = useState<"heads" | "tails">("heads");
  const { play, loading, last } = useGamePlay("coinflip");
  const roll = (last?.data as { roll?: string })?.roll;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <BetControls
        game={game}
        amount={amount}
        setAmount={setAmount}
        loading={loading}
        onPlay={() => play(amount, { side, mode: "bot" })}
      >
        <div className="flex gap-2">
          {(["heads", "tails"] as const).map((s) => (
            <Button
              key={s}
              variant={side === s ? "default" : "outline"}
              onClick={() => setSide(s)}
              type="button"
            >
              {s}
            </Button>
          ))}
        </div>
      </BetControls>
      <div className="flex items-center justify-center">
        <motion.div
          animate={{ rotateY: roll ? 720 : 0 }}
          transition={{ duration: 1 }}
          className="h-40 w-40 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-[0_0_40px_rgba(34,211,238,0.4)]"
        >
          {roll ?? "?"}
        </motion.div>
      </div>
    </div>
  );
}
