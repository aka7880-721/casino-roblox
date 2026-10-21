import { NextRequest, NextResponse } from "next/server";
import { assertBotSecret } from "@/lib/bot-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  if (!assertBotSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { withdrawalId } = await req.json();
  const admin = createAdminClient();
  const { data: w } = await admin.from("withdrawals").select("*").eq("id", withdrawalId).single();
  if (!w) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await admin.from("withdrawals").update({ status: "completed" }).eq("id", withdrawalId);
  return NextResponse.json({ ok: true });
}
