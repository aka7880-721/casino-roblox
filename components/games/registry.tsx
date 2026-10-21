import type React from "react";
import dynamic from "next/dynamic";
import type { DbGame } from "@/lib/types";

const CoinFlip = dynamic(() => import("./CoinFlip").then((m) => m.CoinFlip));
const Jackpot = dynamic(() => import("./Jackpot").then((m) => m.Jackpot));
const Upgrader = dynamic(() => import("./Upgrader").then((m) => m.Upgrader));
const Race = dynamic(() => import("./Race").then((m) => m.Race));
const Dice = dynamic(() => import("./Dice").then((m) => m.Dice));
const Mines = dynamic(() => import("./Mines").then((m) => m.Mines));
const Tower = dynamic(() => import("./Tower").then((m) => m.Tower));
const Wheel = dynamic(() => import("./Wheel").then((m) => m.Wheel));
const Limbo = dynamic(() => import("./Limbo").then((m) => m.Limbo));
const Plinko = dynamic(() => import("./Plinko").then((m) => m.Plinko));
const CaseOpening = dynamic(() => import("./CaseOpening").then((m) => m.CaseOpening));
const Crash = dynamic(() => import("./Crash").then((m) => m.Crash));
const Roulette = dynamic(() => import("./Roulette").then((m) => m.Roulette));

const map: Record<string, React.ComponentType<{ game: DbGame }>> = {
  coinflip: CoinFlip,
  jackpot: Jackpot,
  upgrader: Upgrader,
  race: Race,
  dice: Dice,
  mines: Mines,
  tower: Tower,
  wheel: Wheel,
  limbo: Limbo,
  plinko: Plinko,
  "case-opening": CaseOpening,
  crash: Crash,
  roulette: Roulette,
};

export function GameRenderer({ game }: { game: DbGame }) {
  const Comp = map[game.slug];
  if (!Comp) {
    return <p className="text-zinc-400">Game UI not found for {game.slug}</p>;
  }
  return <Comp game={game} />;
}
