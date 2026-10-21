import type { GameResolver } from "./types";
import { play as coinflip } from "./coinflip";
import { play as jackpot } from "./jackpot";
import { play as upgrader } from "./upgrader";
import { play as race } from "./race";
import { play as dice } from "./dice";
import { play as mines } from "./mines";
import { play as tower } from "./tower";
import { play as wheel } from "./wheel";
import { play as limbo } from "./limbo";
import { play as plinko } from "./plinko";
import { play as caseOpening } from "./case-opening";
import { play as crash } from "./crash";
import { play as roulette } from "./roulette";

export const gameResolvers: Record<string, GameResolver> = {
  coinflip,
  jackpot,
  upgrader,
  race,
  dice,
  mines,
  tower,
  wheel,
  limbo,
  plinko,
  "case-opening": caseOpening,
  crash,
  roulette,
};

export function getGameResolver(slug: string): GameResolver | undefined {
  return gameResolvers[slug];
}
