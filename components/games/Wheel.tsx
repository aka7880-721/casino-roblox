"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { DbGame } from "@/lib/types";
import { BetControls, useGamePlay } from "./game-shell";

export function Wheel({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const { play, loading, last } = useGamePlay("wheel");
  const seg = (last?.data as { segment?: { label: string } })?.segment;

  return (
    <BetControls game={game} amount={amount} setAmount={setAmount} loading={loading} onPlay={() => play(amount, {})}>
      <motion.div animate={{ rotate: last ? 360 * 3 : 0 }} transition={{ duration: 1.5 }} className="mx-auto h-32 w-32 rounded-full border-4 border-cyan-400 flex items-center justify-center">
        {seg?.label ?? "SPIN"}
      </motion.div>
    </BetControls>
  );
}
