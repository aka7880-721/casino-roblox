import type { FairRng } from "@/lib/fair";
import type { GamePlayInput, PlayResult } from "@/lib/types";

export type GameResolver = (
  input: GamePlayInput,
  fairRng: FairRng
) => PlayResult;
