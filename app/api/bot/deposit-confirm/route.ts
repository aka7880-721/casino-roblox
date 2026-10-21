import { NextRequest, NextResponse } from "next/server";
import { assertBotSecret } from "@/lib/bot-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  if (!assertBotSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { depositId } = await req.json();
  const admin = createAdminClient();
  const { data: dep } = await admin.from("deposits").select("*").eq("id", depositId).single();
  if (!dep || dep.status !== "pending") {
    return NextResponse.json({ error: "Invalid deposit" }, { status: 400 });
  }
  await admin.from("deposits").update({ status: "confirmed" }).eq("id", depositId);
  const { data: user } = await admin.from("users").select("balance").eq("id", dep.user_id).single();
  if (user) {
    await admin
      .from("users")
      .update({ balance: Number(user.balance) + Number(dep.total_value) })
      .eq("id", dep.user_id);
  }
  for (const petId of dep.pet_ids ?? []) {
    await admin.from("inventory").insert({ user_id: dep.user_id, pet_id: petId });
  }
  return NextResponse.json({ ok: true });
}
