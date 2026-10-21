"use client";

import { useEffect, useState } from "react";
import type { DbGame } from "@/lib/types";
import { BetControls } from "./game-shell";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { formatCredits } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Jackpot({ game }: { game: DbGame }) {
  const [amount, setAmount] = useState(game.min_bet);
  const [loading, setLoading] = useState(false);
  const [pot, setPot] = useState(0);
  const [entries, setEntries] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: round } = await supabase
        .from("jackpot_rounds")
        .select("*")
        .eq("status", "open")
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (round) {
        setPot(Number(round.pot_value));
        const { count } = await supabase
          .from("jackpot_entries")
          .select("*", { count: "exact", head: true })
          .eq("round_id", round.id);
        setEntries(count ?? 0);
      }
    };
    load();
    const ch = supabase
      .channel("jackpot")
      .on("postgres_changes", { event: "*", schema: "public", table: "jackpot_rounds" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "jackpot_entries" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <BetControls
        game={game}
        amount={amount}
        setAmount={setAmount}
        loading={loading}
        onPlay={async () => {
          setLoading(true);
          try {
            const res = await fetch("/api/games/jackpot/enter", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Enter failed");
            toast.success("Entered jackpot!");
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Error");
          } finally {
            setLoading(false);
          }
        }}
      />
      <Card>
        <CardHeader><CardTitle>Live pot</CardTitle></CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-cyan-300">{formatCredits(pot)}</p>
          <p className="text-zinc-400 mt-2">{entries} entries · countdown on server draw</p>
        </CardContent>
      </Card>
    </div>
  );
}
