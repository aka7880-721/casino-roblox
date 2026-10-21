"use client";

import { useEffect, useState } from "react";
import type { DbGame } from "@/lib/types";
import { GameGrid } from "@/components/home/game-grid";
import { DEMO_GAMES } from "@/lib/demo-games";

function normalizeGames(raw: unknown): DbGame[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (g): g is DbGame =>
      g != null &&
      typeof g === "object" &&
      typeof (g as DbGame).slug === "string" &&
      typeof (g as DbGame).name === "string"
  );
}

export function GamesSection() {
  const [games, setGames] = useState<DbGame[]>(DEMO_GAMES);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    const timeout = window.setTimeout(() => ac.abort(), 2500);

    fetch("/api/games?enabled=true", { signal: ac.signal })
      .then((r) => r.json())
      .then((data) => {
        const list = normalizeGames(data);
        if (list.length) {
          setGames(list);
          setLive(true);
        }
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timeout));

    return () => {
      ac.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section id="games" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Live games</h2>
      <p className="text-zinc-400 mb-8 text-sm">
        {live
          ? "Synced from your Supabase games table"
          : "Featured modes — connect Supabase in .env.local for live DB cards"}
      </p>
      <GameGrid games={games.length ? games : DEMO_GAMES} />
    </section>
  );
}
