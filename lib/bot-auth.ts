import { NextRequest } from "next/server";

export function assertBotSecret(req: NextRequest) {
  const secret = process.env.BOT_SECRET;
  if (!secret) throw new Error("BOT_SECRET not configured");
  const header = req.headers.get("x-bot-secret");
  if (header !== secret) {
    return false;
  }
  return true;
}
