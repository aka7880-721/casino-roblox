"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { DbGame, DbPet, DbUser } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function AdminPanel() {
  const [games, setGames] = useState<DbGame[]>([]);
  const [users, setUsers] = useState<DbUser[]>([]);
  const [pets, setPets] = useState<DbPet[]>([]);
  const [deposits, setDeposits] = useState<{ id: string; status: string; total_value: number }[]>([]);
  const [withdrawals, setWithdrawals] = useState<{ id: string; status: string }[]>([]);
  const [jackpotRound, setJackpotRound] = useState<{ id: string; pot_value: number } | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const supabase = createClient();

  async function load() {
    const [g, u, p, d, w, jr] = await Promise.all([
      supabase.from("games").select("*").order("sort_order"),
      supabase.from("users").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("pets").select("*").order("value", { ascending: false }).limit(100),
      supabase.from("deposits").select("id, status, total_value").eq("status", "pending"),
      supabase.from("withdrawals").select("id, status").in("status", ["pending", "processing"]),
      supabase.from("jackpot_rounds").select("id, pot_value").eq("status", "open").maybeSingle(),
    ]);
    setGames((g.data as DbGame[]) ?? []);
    setUsers((u.data as DbUser[]) ?? []);
    setPets((p.data as DbPet[]) ?? []);
    setDeposits(d.data ?? []);
    setWithdrawals(w.data ?? []);
    setJackpotRound(jr.data);
    const { data: sett } = await supabase.from("site_settings").select("value").eq("key", "announcement").single();
    setAnnouncement((sett?.value as { text?: string })?.text ?? "");
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function patch(url: string, body: unknown) {
    const res = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    toast.success("Saved");
    load();
  }

  return (
    <Tabs defaultValue="games">
      <TabsList className="flex flex-wrap h-auto">
        <TabsTrigger value="games">Games</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="pets">Pet values</TabsTrigger>
        <TabsTrigger value="deposits">Deposits</TabsTrigger>
        <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        <TabsTrigger value="jackpot">Jackpot</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="games" className="space-y-3 mt-4">
        {games.map((g) => (
          <div key={g.id} className="glass p-4 rounded-lg space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">{g.name}</span>
              <Switch
                checked={g.enabled}
                onCheckedChange={(enabled) => patch("/api/admin/games", { id: g.id, updates: { enabled } })}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              <Input
                defaultValue={g.house_edge}
                type="number"
                step="0.001"
                onBlur={(e) => patch("/api/admin/games", { id: g.id, updates: { house_edge: Number(e.target.value) } })}
              />
              <Input
                defaultValue={g.min_bet}
                type="number"
                onBlur={(e) => patch("/api/admin/games", { id: g.id, updates: { min_bet: Number(e.target.value) } })}
              />
              <Input
                defaultValue={g.max_bet}
                type="number"
                onBlur={(e) => patch("/api/admin/games", { id: g.id, updates: { max_bet: Number(e.target.value) } })}
              />
            </div>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="users" className="space-y-2 mt-4">
        {users.map((u) => (
          <div key={u.id} className="glass p-3 rounded flex flex-wrap gap-2 items-center text-sm">
            <span>{u.username}</span>
            <Input
              className="w-28"
              defaultValue={u.balance}
              type="number"
              onBlur={(e) => patch("/api/admin/users", { id: u.id, updates: { balance: Number(e.target.value) } })}
            />
            <Button size="sm" variant="outline" onClick={() => patch("/api/admin/users", { id: u.id, updates: { banned: !u.banned } })}>
              {u.banned ? "Unban" : "Ban"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => patch("/api/admin/users", { id: u.id, updates: { role: u.role === "admin" ? "user" : "admin" } })}>
              Toggle admin
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const password = prompt("New password (min 6 chars)");
                if (!password) return;
                fetch("/api/admin/users/reset-password", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ userId: u.id, password }),
                }).then(() => toast.success("Password updated"));
              }}
            >
              Reset pw
            </Button>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="pets" className="mt-4 space-y-2">
        <Button onClick={() => fetch("/api/values/refresh", { method: "POST" }).then(() => { toast.success("Refresh queued"); load(); })}>
          Scrape Elvebredd
        </Button>
        {pets.slice(0, 30).map((p) => (
          <div key={p.id} className="flex gap-2 items-center text-sm">
            <span className="w-40 truncate">{p.name}</span>
            <Input
              className="w-32"
              defaultValue={p.value}
              type="number"
              onBlur={(e) => patch("/api/admin/pets", { id: p.id, updates: { value: Number(e.target.value) } })}
            />
          </div>
        ))}
      </TabsContent>

      <TabsContent value="deposits" className="mt-4 space-y-2">
        {deposits.map((d) => (
          <div key={d.id} className="flex gap-2">
            <span>{d.total_value}</span>
            <Button size="sm" onClick={() => patch("/api/admin/deposits", { id: d.id, status: "confirmed" })}>Approve</Button>
            <Button size="sm" variant="destructive" onClick={() => patch("/api/admin/deposits", { id: d.id, status: "rejected" })}>Reject</Button>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="withdrawals" className="mt-4 space-y-2">
        {withdrawals.map((w) => (
          <div key={w.id} className="flex gap-2">
            <span>{w.status}</span>
            <Button size="sm" onClick={() => patch("/api/admin/withdrawals", { id: w.id, status: "processing" })}>Processing</Button>
            <Button size="sm" onClick={() => patch("/api/admin/withdrawals", { id: w.id, status: "completed" })}>Complete</Button>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="jackpot" className="mt-4 space-y-2">
        {jackpotRound && (
          <>
            <p>Pot: {jackpotRound.pot_value}</p>
            <Button onClick={() => fetch("/api/admin/jackpot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "draw", roundId: jackpotRound.id }) }).then(load)}>Force draw</Button>
            <Button variant="destructive" onClick={() => fetch("/api/admin/jackpot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "refund", roundId: jackpotRound.id }) }).then(load)}>Refund round</Button>
          </>
        )}
      </TabsContent>

      <TabsContent value="settings" className="mt-4 space-y-2">
        <Input value={announcement} onChange={(e) => setAnnouncement(e.target.value)} />
        <Button onClick={() => patch("/api/admin/settings", { key: "announcement", value: { text: announcement } })}>Save announcement</Button>
      </TabsContent>
    </Tabs>
  );
}
