"use client";

import Link from "next/link";
import type { DbGame } from "@/lib/types";
import { formatCredits } from "@/lib/utils";
import { GameIcon } from "@/components/icons/game-icon";
import { Badge } from "@/components/ui/badge";

export function GameGrid({ games }: { games: DbGame[] }) {
  if (!games?.length) {
    return (
      <p className="text-zinc-500 text-sm rounded-xl border border-dashed border-white/10 p-8 text-center">
        No games to show. Run <code className="text-cyan-400">supabase/seed.sql</code> or use demo mode offline.
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {games.map((g) => (
        <Link
          key={g.id ?? g.slug}
          href={
            ["coinflip", "jackpot", "upgrader", "race"].includes(g.slug)
              ? `/${g.slug}`
              : `/games/${g.slug}`
          }
          className="block rounded-xl glass p-4 hover:border-cyan-500/40 transition-colors h-full"
        >
          <div className="flex items-start justify-between gap-2">
            <GameIcon slug={g.slug} />
            <Badge variant="secondary">{g.category}</Badge>
          </div>
          <h3 className="font-semibold mt-3">{g.name}</h3>
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{g.description}</p>
          <p className="text-xs text-cyan-400/80 mt-3">
            {formatCredits(Number(g.min_bet))} – {formatCredits(Number(g.max_bet))} cr
          </p>
        </Link>
      ))}
    </div>
  );
}
