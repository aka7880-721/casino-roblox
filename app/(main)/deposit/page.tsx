"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { DbPet } from "@/lib/types";
import { formatCredits } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DepositPage() {
  const [pets, setPets] = useState<DbPet[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lastCode, setLastCode] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .from("pets")
      .select("*")
      .order("value", { ascending: false })
      .then(({ data }) => setPets((data as DbPet[]) ?? []));
  }, []);

  const total = pets.filter((p) => selected.has(p.id)).reduce((s, p) => s + Number(p.value), 0);

  async function submit() {
    const res = await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petIds: Array.from(selected) }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    setLastCode(data.trade_code);
    toast.success("Deposit pending — trade pets to bot");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Deposit pets</h1>
      <Card>
        <CardHeader><CardTitle>Select pets (Elvebredd values)</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
          {pets.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm glass rounded p-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={(e) => {
                  const n = new Set(selected);
                  if (e.target.checked) n.add(p.id);
                  else n.delete(p.id);
                  setSelected(n);
                }}
              />
              <span className="flex-1">{p.name}</span>
              <span className="text-cyan-400">{formatCredits(p.value)}</span>
            </label>
          ))}
        </CardContent>
      </Card>
      <p className="text-lg">Total: {formatCredits(total)} credits</p>
      <Button onClick={submit} disabled={selected.size === 0}>Create deposit</Button>
      {lastCode && (
        <div className="glass p-4 rounded-lg text-sm space-y-2">
          <p>Trade code: <strong className="text-cyan-300">{lastCode}</strong></p>
          <p>1. Join AdoptLuck bot in Adopt Me</p>
          <p>2. Open trade and send selected pets</p>
          <p>3. Status: pending → confirmed when bot accepts</p>
        </div>
      )}
    </div>
  );
}
