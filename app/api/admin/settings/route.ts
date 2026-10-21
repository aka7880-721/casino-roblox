import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await requireAdmin(user.id);
    const { key, value } = await request.json();
    const admin = createAdminClient();
    await admin.from("site_settings").upsert({ key, value });
    await admin.from("audit_log").insert({
      admin_id: user.id,
      action: "settings_update",
      payload: { key, value },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error" },
      { status: 403 }
    );
  }
}
