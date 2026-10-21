"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
import type { DbGame } from "@/lib/types";
import { BetControls, useGamePlay } from "./game-shell";

export function CaseOpening({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const { play, loading, last } = useGamePlay("case-opening");
  const item = (last?.data as { item?: { name: string; value: number } })?.item;

  return (
    <BetControls game={game} amount={amount} setAmount={setAmount} loading={loading} onPlay={() => play(amount, {})}>
      <motion.div
        animate={{ scale: loading ? 1.05 : 1 }}
        className="h-32 rounded-xl bg-purple-900/40 flex flex-col items-center justify-center gap-2 text-xl"
      >
        {!item && <PackageOpen className="h-10 w-10 text-purple-300" aria-hidden />}
        {item ? `${item.name} (${item.value})` : "Unbox"}
      </motion.div>
    </BetControls>
  );
}
