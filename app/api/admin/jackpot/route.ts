import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";
import { fairRngFromRound, createRound } from "@/lib/fair";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await requireAdmin(user.id);
    const { action, roundId } = await request.json();
    const admin = createAdminClient();
    const { data: round } = await admin.from("jackpot_rounds").select("*").eq("id", roundId).single();
    if (!round) return NextResponse.json({ error: "Round not found" }, { status: 404 });

    if (action === "refund") {
      const { data: entries } = await admin.from("jackpot_entries").select("*").eq("round_id", roundId);
      for (const e of entries ?? []) {
        const { data: u } = await admin.from("users").select("balance").eq("id", e.user_id).single();
        await admin
          .from("users")
          .update({ balance: Number(u?.balance ?? 0) + Number(e.value) })
          .eq("id", e.user_id);
      }
      await admin
        .from("jackpot_rounds")
        .update({ status: "refunded", ended_at: new Date().toISOString() })
        .eq("id", roundId);
      await admin.from("jackpot_rounds").insert({ status: "open", pot_value: 0 });
      return NextResponse.json({ ok: true });
    }

    if (action === "draw") {
      const { data: entries } = await admin.from("jackpot_entries").select("*").eq("round_id", roundId);
      if (!entries?.length) return NextResponse.json({ error: "No entries" }, { status: 400 });
      const total = entries.reduce((s, e) => s + Number(e.value), 0);
      const roundFair = createRound();
      const rng = fairRngFromRound(roundFair);
      let ticket = rng() * total;
      let winner = entries[0];
      for (const e of entries) {
        ticket -= Number(e.value);
        if (ticket <= 0) {
          winner = e;
          break;
        }
      }
      const { data: wUser } = await admin.from("users").select("balance").eq("id", winner.user_id).single();
      await admin
        .from("users")
        .update({ balance: Number(wUser?.balance ?? 0) + Number(round.pot_value) })
        .eq("id", winner.user_id);
      await admin
        .from("jackpot_rounds")
        .update({
          status: "completed",
          winner_id: winner.user_id,
          ended_at: new Date().toISOString(),
        })
        .eq("id", roundId);
      await admin.from("jackpot_rounds").insert({ status: "open", pot_value: 0 });
      await admin.from("audit_log").insert({
        admin_id: user.id,
        action: "jackpot_draw",
        payload: { roundId, winner_id: winner.user_id },
      });
      return NextResponse.json({ ok: true, winner_id: winner.user_id });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error" },
      { status: 403 }
    );
  }
}
