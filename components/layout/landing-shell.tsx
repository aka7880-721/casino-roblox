import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#070712] text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
          >
            AdoptLuck
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-400">
            <Link href="#games" className="hover:text-white">Games</Link>
            <Link href="#fair" className="hover:text-white">Provably fair</Link>
            <Link href="/values" className="hover:text-white">Values</Link>
            <Link href="/leaderboard" className="hover:text-white">Leaderboard</Link>
          </nav>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-500">
        AdoptLuck — fan project · not affiliated with Roblox or Adopt Me
      </footer>
    </div>
  );
}
