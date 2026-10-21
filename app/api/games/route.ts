import { NextResponse } from "next/server";
import { getGames } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { DEMO_GAMES } from "@/lib/demo-games";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const enabled = searchParams.get("enabled") === "true";

  if (!isSupabaseConfigured()) {
    return NextResponse.json(enabled ? DEMO_GAMES : []);
  }

  const games = await getGames(enabled);
  return NextResponse.json(games.length ? games : enabled ? DEMO_GAMES : games);
}
