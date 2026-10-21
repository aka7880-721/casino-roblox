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
    const body = await request.json();
    const admin = createAdminClient();
    const { error } = await admin.from("games").update(body.updates).eq("id", body.id);
    if (error) throw new Error(error.message);
    await admin.from("audit_log").insert({
      admin_id: user.id,
      action: "game_update",
      payload: body,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error" },
      { status: 403 }
    );
  }
}
