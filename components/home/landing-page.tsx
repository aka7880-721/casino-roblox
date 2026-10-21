import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GamesSection } from "@/components/home/games-section";
import { Sparkles, Shield, Zap, Trophy } from "lucide-react";

export function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.2),transparent_45%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggIGQ9Ik0gNjAgMCBMIDAgMCAwIDYwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==')] opacity-40" />
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Adopt Me pets · provably fair · live jackpot
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-3xl leading-[1.1]">
            <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-400 bg-clip-text text-transparent">
              Win big with your pets
            </span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-xl">
            Deposit Adopt Me inventory, play DB-driven games with transparent odds, and cash out to pets. Built for speed — no waiting on broken config.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/register">Get 1,000 free credits</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
              <Link href="/coinflip">Play CoinFlip</Link>
            </Button>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: "Provably fair", sub: "Seeds on every bet" },
              { icon: Zap, label: "13 games", sub: "Toggle from admin" },
              { icon: Trophy, label: "Leaderboards", sub: "Profit & wagers" },
              { icon: Sparkles, label: "Pet values", sub: "Elvebredd sync" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="rounded-xl border border-white/10 bg-black/30 p-4 backdrop-blur">
                <Icon className="h-5 w-5 text-cyan-400 mb-2" />
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-zinc-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GamesSection />

      <section id="fair" className="max-w-6xl mx-auto px-4 py-16 border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Every roll is verifiable</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Server seed hash before you bet. Client seed + nonce on each play. Reveal after the round. Stored on every row in{" "}
              <code className="text-cyan-400/90">bets</code> — same flow for CoinFlip, Crash, Mines, and the rest.
            </p>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/50 to-cyan-950/30 p-6 font-mono text-xs text-zinc-400 space-y-2">
            <p>server_seed_hash: 8f3a…c21</p>
            <p>client_seed: player_xyz</p>
            <p>nonce: 42</p>
            <p className="text-green-400/80">verify() → true</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to trade luck?</h2>
        <p className="text-zinc-400 mb-8">Join with email — start at level 1 with 1,000 credits.</p>
        <Button asChild size="lg">
          <Link href="/register">Create account</Link>
        </Button>
      </section>
    </>
  );
}
