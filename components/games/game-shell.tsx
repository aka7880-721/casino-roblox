"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DbGame } from "@/lib/types";
import { formatCredits } from "@/lib/utils";

type PlayResponse = {
  win?: boolean;
  payout?: number;
  multiplier?: number;
  balance?: number;
  fair?: Record<string, unknown>;
  data?: Record<string, unknown>;
  error?: string;
};

export function useGamePlay(slug: string) {
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<PlayResponse | null>(null);

  async function play(amount: number, payload: Record<string, unknown>) {
    setLoading(true);
    try {
      const res = await fetch(`/api/games/${slug}/play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, payload }),
      });
      const data = (await res.json()) as PlayResponse;
      if (!res.ok) throw new Error(data.error ?? "Play failed");
      setLast(data);
      if (data.win) toast.success(`Won ${formatCredits(data.payout ?? 0)} credits!`);
      else toast.message("Round complete");
      return data;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { play, loading, last };
}

export function BetControls({
  game,
  amount,
  setAmount,
  onPlay,
  loading,
  children,
}: {
  game: DbGame;
  amount: number;
  setAmount: (n: number) => void;
  onPlay: () => void;
  loading: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Card className="bg-black/30">
      <CardHeader>
        <CardTitle>{game.name}</CardTitle>
        <p className="text-sm text-zinc-400">{game.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <div className="space-y-2">
          <Label>Bet amount</Label>
          <Input
            type="number"
            min={game.min_bet}
            max={game.max_bet}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <p className="text-xs text-zinc-500">
            Min {formatCredits(game.min_bet)} · Max {formatCredits(game.max_bet)} · Edge{" "}
            {(Number(game.house_edge) * 100).toFixed(1)}%
          </p>
        </div>
        <Button className="w-full" onClick={onPlay} disabled={loading}>
          {loading ? "Playing…" : "Play"}
        </Button>
      </CardContent>
    </Card>
  );
}
