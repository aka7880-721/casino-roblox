import Link from "next/link";
import { registerAction } from "@/lib/auth-actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupabaseSetupHint } from "@/components/auth/supabase-setup-hint";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <Card className="max-w-md mx-auto bg-black/40">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <p className="text-sm text-zinc-400">Start with 1,000 credits</p>
      </CardHeader>
      <CardContent>
        <SupabaseSetupHint />
        <form action={registerAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" required minLength={3} autoComplete="username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          {searchParams.error && (
            <p className="text-sm text-red-400 whitespace-pre-wrap">{searchParams.error}</p>
          )}
          <SubmitButton label="Register" />
        </form>
        <p className="text-sm text-zinc-400 mt-4 text-center">
          Have an account? <Link href="/login" className="text-cyan-400">Login</Link>
        </p>
      </CardContent>
    </Card>
  );
}
