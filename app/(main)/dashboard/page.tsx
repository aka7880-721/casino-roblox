import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { formatCredits } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();
  const { data: bets } = await supabase
    .from("bets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(8);
  const wagered = (bets ?? []).reduce((s, b) => s + Number(b.amount), 0);
  const profit = (bets ?? []).reduce((s, b) => s + Number(b.payout) - Number(b.amount), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Balance</CardTitle></CardHeader><CardContent className="text-2xl text-cyan-300">{formatCredits(user.balance)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Level</CardTitle></CardHeader><CardContent className="text-2xl">{user.level}</CardContent></Card>
        <Card><CardHeader><CardTitle>Recent P/L</CardTitle></CardHeader><CardContent className={`text-2xl ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>{formatCredits(profit)}</CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild><Link href="/deposit">Deposit</Link></Button>
        <Button asChild variant="outline"><Link href="/withdraw">Withdraw</Link></Button>
        <Button asChild variant="outline"><Link href="/coinflip">CoinFlip</Link></Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent bets</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {(bets ?? []).map((b) => (
            <div key={b.id} className="flex justify-between border-b border-white/5 py-2">
              <span>{b.game_slug}</span>
              <span>{formatCredits(b.amount)} → {formatCredits(b.payout)}</span>
            </div>
          ))}
          {!bets?.length && <p className="text-zinc-500">No bets yet</p>}
          <p className="text-xs text-zinc-500 pt-2">Wagered (sample): {formatCredits(wagered)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
