"use client";

import { useState } from "react";
import type { DbGame } from "@/lib/types";
import { useGamePlay } from "./game-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Tower({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const [floor, setFloor] = useState(0);
  const { play, loading } = useGamePlay("tower");

  return (
    <div className="space-y-4">
      <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <p className="text-cyan-300">Floor {floor} / 9</p>
      <div className="flex gap-2">
        {[0, 1, 2].map((pick) => (
          <Button
            key={pick}
            disabled={loading}
            onClick={async () => {
              const r = await play(amount, { floor, pick });
              const d = r.data as { gameOver?: boolean; continue?: boolean; floor?: number };
              if (d.gameOver) setFloor(0);
              else if (d.floor) setFloor(d.floor);
            }}
          >
            Tile {pick + 1}
          </Button>
        ))}
      </div>
      <Button variant="outline" onClick={() => play(amount, { floor, pick: 0, cashout: true })} disabled={floor === 0 || loading}>
        Cashout
      </Button>
    </div>
  );
}
