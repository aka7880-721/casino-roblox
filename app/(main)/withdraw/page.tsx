"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Inv = { id: string; pet_id: string; pets: { name: string; value: number } | { name: string; value: number }[] | null };

export default function WithdrawPage() {
  const [items, setItems] = useState<Inv[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(async ({ data: { user } }) => {
        if (!user) return;
        const { data } = await createClient()
          .from("inventory")
          .select("id, pet_id, pets(name, value)")
          .eq("user_id", user.id);
        setItems((data as unknown as Inv[]) ?? []);
      });
  }, []);

  async function submit() {
    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inventoryIds: Array.from(selected) }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    toast.success("Withdrawal requested — admin/bot will process");
    setSelected(new Set());
  }

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Withdraw</h1>
      <div className="space-y-2">
        {items.map((i) => (
          <label key={i.id} className="flex gap-2 items-center glass p-3 rounded-lg">
            <input
              type="checkbox"
              checked={selected.has(i.id)}
              onChange={(e) => {
                const n = new Set(selected);
                if (e.target.checked) n.add(i.id);
                else n.delete(i.id);
                setSelected(n);
              }}
            />
            {(Array.isArray(i.pets) ? i.pets[0]?.name : i.pets?.name)} ({Array.isArray(i.pets) ? i.pets[0]?.value : i.pets?.value})
          </label>
        ))}
        {!items.length && <p className="text-zinc-500">No inventory — deposit or win pets first.</p>}
      </div>
      <Button onClick={submit} disabled={!selected.size}>Request withdrawal</Button>
    </div>
  );
}
