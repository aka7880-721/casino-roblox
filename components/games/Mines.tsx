"use client";

import { useState } from "react";
import type { DbGame } from "@/lib/types";
import { useGamePlay } from "./game-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Mines({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const [revealed, setRevealed] = useState(0);
  const { play, loading } = useGamePlay("mines");

  return (
    <Card>
      <CardHeader><CardTitle>Mines</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 25 }).map((_, cell) => (
            <Button
              key={cell}
              variant="outline"
              disabled={loading}
              onClick={async () => {
                const r = await play(amount, { action: "reveal", cell, revealed });
                const hit = (r.data as { hit?: boolean })?.hit;
                if (!hit) setRevealed((x) => x + 1);
              }}
            >
              ?
            </Button>
          ))}
        </div>
        <Button onClick={() => play(amount, { action: "cashout", revealed })} disabled={loading || revealed === 0}>
          Cashout ({revealed} safe)
        </Button>
      </CardContent>
    </Card>
  );
}
