import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCredits } from "@/lib/utils";

async function load(view: string) {
  const supabase = await createClient();
  const table =
    view === "wagered"
      ? "leaderboard_wagered"
      : view === "win"
        ? "leaderboard_biggest_win"
        : view === "level"
          ? "leaderboard_level"
          : "leaderboard_profit";
  const { data } = await supabase.from(table).select("*").order("metric", { ascending: false }).limit(50);
  return data ?? [];
}

function Board({ rows, format }: { rows: { username: string; metric: number; level?: number }[]; format: (n: number) => string }) {
  return (
    <ol className="space-y-2">
      {rows.map((r, i) => (
        <li key={i} className="flex justify-between glass rounded-lg px-4 py-2 text-sm">
          <span>
            #{i + 1} {r.username}
          </span>
          <span className="text-cyan-300">{format(Number(r.metric))}</span>
        </li>
      ))}
    </ol>
  );
}

export default async function LeaderboardPage() {
  const [profit, wagered, win, level] = await Promise.all([
    load("profit"),
    load("wagered"),
    load("win"),
    load("level"),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      <Tabs defaultValue="profit">
        <TabsList>
          <TabsTrigger value="profit">Profit</TabsTrigger>
          <TabsTrigger value="wagered">Wagered</TabsTrigger>
          <TabsTrigger value="win">Biggest win</TabsTrigger>
          <TabsTrigger value="level">Level</TabsTrigger>
        </TabsList>
        <TabsContent value="profit"><Board rows={profit as never} format={formatCredits} /></TabsContent>
        <TabsContent value="wagered"><Board rows={wagered as never} format={formatCredits} /></TabsContent>
        <TabsContent value="win"><Board rows={win as never} format={formatCredits} /></TabsContent>
        <TabsContent value="level"><Board rows={level as never} format={(n) => `Lv ${n}`} /></TabsContent>
      </Tabs>
    </div>
  );
}
