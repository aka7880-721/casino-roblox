import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { executeGamePlay } from "@/lib/bets";
import { getGameBySlug } from "@/lib/data";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const game = await getGameBySlug(params.slug);
    if (!game || !game.enabled) {
      return NextResponse.json({ error: "Game unavailable" }, { status: 404 });
    }
    const body = await request.json();
    const amount = Number(body.amount);
    const payload = (body.payload ?? {}) as Record<string, unknown>;
    const result = await executeGamePlay({
      userId: user.id,
      game,
      amount,
      payload,
      clientSeed: body.clientSeed,
      nonce: body.nonce,
      petIds: body.petIds,
    });
    return NextResponse.json({
      win: result.win,
      payout: result.payout,
      multiplier: result.multiplier,
      balance: result.balance,
      data: result.data,
      fair: result.fair,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error" },
      { status: 400 }
    );
  }
}
