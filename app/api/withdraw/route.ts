import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { inventoryIds } = await request.json();
  const admin = createAdminClient();
  const { data: items } = await admin
    .from("inventory")
    .select("id, pet_id, pets(value)")
    .eq("user_id", user.id)
    .in("id", inventoryIds ?? []);
  if (!items?.length) return NextResponse.json({ error: "No items" }, { status: 400 });

  const petIds = items.map((i) => i.pet_id);
  const total = items.reduce((s, i) => {
    const pet = i.pets as { value: number } | { value: number }[] | null;
    const value = Array.isArray(pet) ? pet[0]?.value : pet?.value;
    return s + Number(value ?? 0);
  }, 0);

  const { data, error } = await admin
    .from("withdrawals")
    .insert({
      user_id: user.id,
      pet_ids: petIds,
      total_value: total,
      status: "pending",
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await admin.from("inventory").delete().in("id", items.map((i) => i.id));
  return NextResponse.json(data);
}
