"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DbPet } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { formatCredits } from "@/lib/utils";

export default function ValuesPage() {
  const [pets, setPets] = useState<DbPet[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    createClient().from("pets").select("*").order("value", { ascending: false }).then(({ data }) => setPets((data as DbPet[]) ?? []));
  }, []);

  const filtered = useMemo(
    () => pets.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())),
    [pets, q]
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pet values</h1>
      <Input placeholder="Search pets…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md" />
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-black/40 text-left">
            <tr>
              <th className="p-3">Pet</th>
              <th className="p-3">Value</th>
              <th className="p-3">Rarity</th>
              <th className="p-3">Demand</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-cyan-300">{formatCredits(p.value)}</td>
                <td className="p-3">{p.rarity}</td>
                <td className="p-3">{p.demand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
