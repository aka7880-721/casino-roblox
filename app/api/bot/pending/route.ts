import { NextRequest, NextResponse } from "next/server";
import { assertBotSecret } from "@/lib/bot-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  if (!assertBotSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = createAdminClient();
  const { data: deposits } = await admin
    .from("deposits")
    .select("id, user_id, pet_ids, total_value, trade_code, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(50);
  const { data: withdrawals } = await admin
    .from("withdrawals")
    .select("id, user_id, pet_ids, total_value, created_at")
    .in("status", ["pending", "processing"])
    .order("created_at", { ascending: true })
    .limit(50);
  return NextResponse.json({ deposits: deposits ?? [], withdrawals: withdrawals ?? [] });
}
