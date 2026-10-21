"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bird, Bug, Crown, Flame, Shell } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DbGame } from "@/lib/types";
import { BetControls, useGamePlay } from "./game-shell";
import { Button } from "@/components/ui/button";

const LANES: { Icon: LucideIcon; label: string }[] = [
  { Icon: Flame, label: "Dragon" },
  { Icon: Bird, label: "Owl" },
  { Icon: Shell, label: "Turtle" },
  { Icon: Crown, label: "Unicorn" },
  { Icon: Bug, label: "Bee" },
];

export function Race({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const [petIndex, setPetIndex] = useState(0);
  const { play, loading, last } = useGamePlay("race");
  const winner = (last?.data as { winner?: number })?.winner;

  return (
    <div className="space-y-6">
      <BetControls
        game={game}
        amount={amount}
        setAmount={setAmount}
        loading={loading}
        onPlay={() => play(amount, { petIndex, odds: 4 })}
      >
        <div className="flex gap-2 flex-wrap">
          {LANES.map(({ Icon, label }, i) => (
            <Button
              key={i}
              type="button"
              variant={petIndex === i ? "default" : "outline"}
              onClick={() => setPetIndex(i)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" aria-hidden />
              Lane {i + 1} · {label}
            </Button>
          ))}
        </div>
      </BetControls>
      <div className="space-y-3">
        {LANES.map(({ Icon }, i) => (
          <div key={i} className="relative h-10 bg-white/5 rounded-lg overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 w-10 flex items-center justify-center text-cyan-300"
              animate={{ x: winner !== undefined ? (winner === i ? 280 : 120 + i * 20) : 0 }}
              transition={{ duration: 1.2 }}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
