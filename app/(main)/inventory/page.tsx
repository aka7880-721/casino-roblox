import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { formatCredits } from "@/lib/utils";

export default async function InventoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();
  const { data } = await supabase
    .from("inventory")
    .select("id, acquired_at, pets(name, value, rarity)")
    .eq("user_id", user.id)
    .order("acquired_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Inventory</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(data ?? []).map((row) => {
          const raw = row.pets as { name: string; value: number; rarity: string } | { name: string; value: number; rarity: string }[] | null;
          const pet = Array.isArray(raw) ? raw[0] : raw;
          return (
            <div key={row.id} className="glass rounded-xl p-4">
              <p className="font-medium">{pet?.name}</p>
              <p className="text-sm text-zinc-400">{pet?.rarity}</p>
              <p className="text-cyan-300">{formatCredits(pet?.value ?? 0)}</p>
            </div>
          );
        })}
      </div>
      {!data?.length && <p className="text-zinc-500">Empty inventory</p>}
    </div>
  );
}
