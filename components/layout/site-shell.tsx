"use client";

import Link from "next/link";
import { formatCredits } from "@/lib/utils";
import { NavLinks } from "@/components/layout/nav-links";
import {
  Gamepad2,
  LayoutDashboard,
  Trophy,
  Wallet,
  Package,
  Shield,
  Gem,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DbUser } from "@/lib/types";

const nav = [
  { href: "/", label: "Home", icon: Gamepad2 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/coinflip", label: "CoinFlip", icon: Gem },
  { href: "/jackpot", label: "Jackpot", icon: Gem },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/deposit", label: "Deposit", icon: Wallet },
  { href: "/withdraw", label: "Withdraw", icon: Wallet },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/values", label: "Values", icon: Gem },
];

export function SiteShell({
  children,
  user,
  announcement,
}: {
  children: React.ReactNode;
  user: DbUser | null;
  announcement?: string;
}) {
  return (
    <div className="min-h-screen flex bg-[#070712] text-zinc-100">
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-black/40 p-4 gap-2">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
          AdoptLuck
        </Link>
        <NavLinks items={nav} />
        {user?.role === "admin" && (
          <Link href="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-amber-300 hover:bg-white/5">
            <Shield className="h-4 w-4" /> Admin
          </Link>
        )}
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="lg:hidden font-bold text-cyan-400">AdoptLuck</Link>
          {announcement ? (
            <p className="text-xs text-cyan-200/80 truncate flex-1 text-center">{announcement}</p>
          ) : (
            <div className="flex-1" />
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-400">{user.username}</span>
              <span className="font-semibold text-cyan-300">{formatCredits(user.balance)} cr</span>
              <form action="/api/auth/signout" method="post">
                <Button type="submit" variant="outline" size="sm">Logout</Button>
              </form>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm"><Link href="/login">Login</Link></Button>
              <Button asChild size="sm"><Link href="/register">Register</Link></Button>
            </div>
          )}
        </header>
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
