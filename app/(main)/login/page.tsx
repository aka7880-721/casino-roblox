import Link from "next/link";
import { loginAction } from "@/lib/auth-actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupabaseSetupHint } from "@/components/auth/supabase-setup-hint";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  return (
    <Card className="max-w-md mx-auto bg-black/40">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <SupabaseSetupHint />
        <form action={loginAction} className="space-y-4">
          {searchParams.next && (
            <input type="hidden" name="next" value={searchParams.next} />
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          {searchParams.error && (
            <p className="text-sm text-red-400 whitespace-pre-wrap">{searchParams.error}</p>
          )}
          <SubmitButton label="Sign in" />
        </form>
        <p className="text-sm text-zinc-400 mt-4 text-center">
          No account? <Link href="/register" className="text-cyan-400">Register</Link>
        </p>
      </CardContent>
    </Card>
  );
}
