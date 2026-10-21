import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, withTimeout } from "@/lib/env";
import { getDemoGameBySlug } from "@/lib/demo-games";
import { ensureUserProfile } from "@/lib/ensure-user-profile";
import type { DbGame, DbUser } from "@/lib/types";

export async function getSiteSettings(): Promise<Record<string, unknown>> {
  if (!isSupabaseConfigured()) return {};
  return withTimeout(
    (async () => {
      const supabase = await createClient();
      const { data } = await supabase.from("site_settings").select("key, value");
      const map: Record<string, unknown> = {};
      data?.forEach((r) => {
        map[r.key] = r.value;
      });
      return map;
    })(),
    2500,
    {}
  );
}

export async function getCurrentUser(): Promise<DbUser | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let { data: profile } = await supabase.from("users").select("*").eq("id", user.id).maybeSingle();

  if (!profile) {
    try {
      await ensureUserProfile(
        user.id,
        user.email ?? "",
        user.user_metadata?.username as string | undefined,
        supabase
      );
      const retry = await supabase.from("users").select("*").eq("id", user.id).maybeSingle();
      profile = retry.data;
    } catch {
      return null;
    }
  }

  return profile as DbUser | null;
}

export async function getGames(enabledOnly = false): Promise<DbGame[]> {
  if (!isSupabaseConfigured()) return [];
  return withTimeout(
    (async () => {
      const supabase = await createClient();
      let q = supabase.from("games").select("*").order("sort_order");
      if (enabledOnly) q = q.eq("enabled", true);
      const { data } = await q;
      return (data ?? []) as DbGame[];
    })(),
    2500,
    []
  );
}

export async function getGameBySlug(slug: string): Promise<DbGame | null> {
  if (!isSupabaseConfigured()) {
    return getDemoGameBySlug(slug);
  }
  const supabase = await createClient();
  const { data } = await supabase.from("games").select("*").eq("slug", slug).maybeSingle();
  if (data) return data as DbGame;
  return getDemoGameBySlug(slug);
}

export async function requireAdmin(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin.from("users").select("role, banned").eq("id", userId).single();
  if (!data || data.role !== "admin" || data.banned) {
    throw new Error("Forbidden");
  }
}
