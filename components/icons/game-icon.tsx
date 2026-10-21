"use client";

import {
  Bomb,
  Building2,
  Circle,
  CircleDot,
  Coins,
  Dices,
  Disc3,
  Flag,
  Gamepad2,
  Gem,
  LineChart,
  PackageOpen,
  Rocket,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SLUG_ICONS: Record<string, LucideIcon> = {
  coinflip: Coins,
  jackpot: Gem,
  upgrader: TrendingUp,
  race: Flag,
  dice: Dices,
  mines: Bomb,
  tower: Building2,
  wheel: CircleDot,
  limbo: Rocket,
  plinko: Circle,
  "case-opening": PackageOpen,
  crash: LineChart,
  roulette: Disc3,
};

export function GameIcon({
  slug,
  className,
  size = "md",
}: {
  slug: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = SLUG_ICONS[slug] ?? Gamepad2;
  const sizeClass =
    size === "lg" ? "h-10 w-10" : size === "sm" ? "h-5 w-5" : "h-8 w-8";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10",
        size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-12 w-12",
        className
      )}
    >
      <Icon className={cn(sizeClass, "text-cyan-300")} aria-hidden />
    </span>
  );
}
