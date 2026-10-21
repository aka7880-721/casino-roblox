import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { executeGamePlay } from "@/lib/bets";
import { getGameBySlug } from "@/lib/data";

async function getOpenRound(admin: ReturnType<typeof createAdminClient>) {
  const { data } = await admin
    .from("jackpot_rounds")
    .select("*")
    .eq("status", "open")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (data) return data;
  const { data: created } = await admin
    .from("jackpot_rounds")
    .insert({ status: "open", pot_value: 0 })
    .select()
    .single();
  return created!;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const game = await getGameBySlug("jackpot");
    if (!game?.enabled) return NextResponse.json({ error: "Jackpot disabled" }, { status: 404 });

    const { amount, petIds } = await request.json();
    const admin = createAdminClient();
    const round = await getOpenRound(admin);

    await executeGamePlay({
      userId: user.id,
      game,
      amount: Number(amount),
      payload: { action: "enter" },
      petIds,
    });

    await admin.from("jackpot_entries").insert({
      round_id: round.id,
      user_id: user.id,
      pet_ids: petIds ?? [],
      value: Number(amount),
    });

    await admin
      .from("jackpot_rounds")
      .update({ pot_value: Number(round.pot_value) + Number(amount) })
      .eq("id", round.id);

    return NextResponse.json({ ok: true, roundId: round.id });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error" },
      { status: 400 }
    );
  }
}
