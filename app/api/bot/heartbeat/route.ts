import { NextRequest, NextResponse } from "next/server";
import { assertBotSecret } from "@/lib/bot-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  if (!assertBotSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = createAdminClient();
  await admin
    .from("bot_status")
    .update({ online: true, last_heartbeat: new Date().toISOString() })
    .eq("id", 1);
  return NextResponse.json({ ok: true });
}
