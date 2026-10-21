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
    const { id, status } = await request.json();
    const admin = createAdminClient();
    if (status === "confirmed") {
      const { data: dep } = await admin.from("deposits").select("*").eq("id", id).single();
      if (dep) {
        const { data: u } = await admin.from("users").select("balance").eq("id", dep.user_id).single();
        await admin
          .from("users")
          .update({ balance: Number(u?.balance ?? 0) + Number(dep.total_value) })
          .eq("id", dep.user_id);
        for (const petId of dep.pet_ids ?? []) {
          await admin.from("inventory").insert({ user_id: dep.user_id, pet_id: petId });
        }
      }
    }
    await admin.from("deposits").update({ status }).eq("id", id);
    await admin.from("audit_log").insert({
      admin_id: user.id,
      action: "deposit_review",
      payload: { id, status },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error" },
      { status: 403 }
    );
  }
}
