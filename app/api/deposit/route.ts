import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { petIds } = await request.json();
  if (!Array.isArray(petIds) || petIds.length === 0) {
    return NextResponse.json({ error: "Select pets" }, { status: 400 });
  }
  const admin = createAdminClient();
  const { data: pets } = await admin.from("pets").select("id, value").in("id", petIds);
  const total = (pets ?? []).reduce((s, p) => s + Number(p.value), 0);
  const trade_code = randomBytes(4).toString("hex").toUpperCase();
  const { data, error } = await admin
    .from("deposits")
    .insert({
      user_id: user.id,
      pet_ids: petIds,
      total_value: total,
      status: "pending",
      trade_code,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
