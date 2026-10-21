import { createAdminClient } from "@/lib/supabase/admin";
import { isServiceRoleConfigured, isSupabaseConfigured } from "@/lib/env";
import type { SupabaseClient } from "@supabase/supabase-js";

async function profileExists(
  client: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await client.from("users").select("id").eq("id", userId).maybeSingle();
  return !!data;
}

/** Wait for DB trigger `on_auth_user_created` after sign-up. */
export async function waitForUserProfile(
  client: SupabaseClient,
  userId: string,
  maxMs = 5000
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    if (await profileExists(client, userId)) return true;
    await new Promise((r) => setTimeout(r, 250));
  }
  return await profileExists(client, userId);
}

export async function ensureUserProfile(
  userId: string,
  email: string,
  username?: string,
  sessionClient?: SupabaseClient
) {
  if (!isSupabaseConfigured()) return;

  if (sessionClient && (await profileExists(sessionClient, userId))) return;
  if (sessionClient && (await waitForUserProfile(sessionClient, userId, 4000))) return;

  if (!isServiceRoleConfigured()) {
    throw new Error(
      "User profile was not created. Run supabase/migrations in your project (trigger creates the profile), or add SUPABASE_SERVICE_ROLE_KEY to .env.local."
    );
  }

  const admin = createAdminClient();
  if (await profileExists(admin, userId)) return;

  let uname = username?.trim() || email.split("@")[0] || "player";
  const { data: clash } = await admin.from("users").select("id").eq("username", uname).maybeSingle();
  if (clash) uname = `${uname}${Math.floor(Math.random() * 10000)}`;

  const { error } = await admin.from("users").insert({
    id: userId,
    email,
    username: uname,
    balance: 1000,
    role: "user",
  });
  if (error) {
    if (error.code === "23505") return;
    throw new Error(error.message);
  }
}
