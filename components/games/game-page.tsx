import { notFound, redirect } from "next/navigation";
import { getCurrentUser, getGameBySlug } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { GameRenderer } from "@/components/games/registry";

export async function GamePage({ slug }: { slug: string }) {
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  if (!game.enabled) {
    return (
      <p className="text-zinc-400">This game is disabled. Check back later or ask an admin.</p>
    );
  }

  const supabaseOn = isSupabaseConfigured();
  const user = supabaseOn ? await getCurrentUser() : null;

  if (supabaseOn && !user) {
    redirect(`/login?error=${encodeURIComponent("Log in to play")}&next=/${slug}`);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{game.name}</h1>
      {!supabaseOn && (
        <p className="text-sm text-amber-200/90 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
          Demo mode — connect Supabase to save balance and bets.
        </p>
      )}
      <GameRenderer game={game} />
    </div>
  );
}
