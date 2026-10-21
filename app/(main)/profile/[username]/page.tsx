import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { formatCredits } from "@/lib/utils";

export default async function ProfilePage({ params }: { params: { username: string } }) {
  if (!isSupabaseConfigured()) notFound();
  const supabase = await createClient();
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", params.username)
    .single();
  if (!user) notFound();

  const { data: bets } = await supabase
    .from("bets")
    .select("game_slug, amount, payout, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const wagered = (bets ?? []).reduce((s, b) => s + Number(b.amount), 0);

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6">
        <h1 className="text-2xl font-bold">{user.username}</h1>
        <p className="text-zinc-400">Level {user.level}</p>
        <p className="text-sm text-zinc-500 mt-2">Wagered (recent): {formatCredits(wagered)}</p>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Recent games</h2>
        <ul className="space-y-1 text-sm">
          {(bets ?? []).map((b) => (
            <li key={b.created_at + b.game_slug} className="flex justify-between glass px-3 py-2 rounded">
              <span>{b.game_slug}</span>
              <span>{formatCredits(b.payout)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
