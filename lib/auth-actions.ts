"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { ensureUserProfile } from "@/lib/ensure-user-profile";
import { redirect } from "next/navigation";

function configError() {
  redirect(
    `/register?error=${encodeURIComponent(
      "Supabase is not configured. Add real NEXT_PUBLIC_SUPABASE_URL and keys to .env.local, run migrations + seed, then restart the dev server."
    )}`
  );
}

export async function loginAction(formData: FormData) {
  if (!isSupabaseConfigured()) configError();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    try {
      await ensureUserProfile(
        data.user.id,
        data.user.email ?? email,
        data.user.user_metadata?.username as string | undefined,
        supabase
      );
    } catch (e) {
      redirect(
        `/login?error=${encodeURIComponent(
          e instanceof Error ? e.message : "Could not create user profile. Run supabase migrations."
        )}`
      );
    }
  }

  const next = String(formData.get("next") ?? "").trim();
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  redirect(safeNext);
}

export async function registerAction(formData: FormData) {
  if (!isSupabaseConfigured()) configError();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "").trim();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    try {
      await ensureUserProfile(data.user.id, email, username, supabase);
    } catch (e) {
      redirect(
        `/register?error=${encodeURIComponent(
          e instanceof Error ? e.message : "Profile setup failed. Apply DB migrations and SUPABASE_SERVICE_ROLE_KEY."
        )}`
      );
    }
  }

  if (!data.session) {
    redirect(
      `/login?error=${encodeURIComponent(
        "Account created. If email confirmation is on in Supabase, confirm your email first, then log in."
      )}`
    );
  }

  redirect("/dashboard");
}
