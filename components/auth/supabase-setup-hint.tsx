import { isServiceRoleConfigured, isSupabaseConfigured } from "@/lib/env";

export function SupabaseSetupHint() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-amber-200/90 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 mb-4">
        Auth needs a real Supabase project in <code className="text-cyan-300">.env.local</code> (URL + anon key), plus{" "}
        <code className="text-cyan-300">supabase/migrations</code> and <code className="text-cyan-300">seed.sql</code>.
        Restart <code className="text-cyan-300">run.bat</code> after editing env.
      </p>
    );
  }
  if (!isServiceRoleConfigured()) {
    return (
      <p className="text-sm text-amber-200/90 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 mb-4">
        Optional: add <code className="text-cyan-300">SUPABASE_SERVICE_ROLE_KEY</code> if profiles are not created
        automatically (run migrations so the auth trigger creates <code className="text-cyan-300">public.users</code>).
      </p>
    );
  }
  return null;
}
