import { createHash, randomBytes } from "crypto";

export type FairRound = {
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
};

export function hashServerSeed(serverSeed: string): string {
  return createHash("sha256").update(serverSeed).digest("hex");
}

export function createRound(clientSeed?: string, nonce = 0): FairRound {
  const serverSeed = randomBytes(32).toString("hex");
  return {
    serverSeed,
    serverSeedHash: hashServerSeed(serverSeed),
    clientSeed: clientSeed ?? randomBytes(8).toString("hex"),
    nonce,
  };
}

export function combineSeed(
  serverSeed: string,
  clientSeed: string,
  nonce: number
): string {
  return `${serverSeed}:${clientSeed}:${nonce}`;
}

export function hashToFloat(hash: string, index = 0): number {
  const slice = hash.slice(index * 8, index * 8 + 8);
  const num = parseInt(slice || hash.slice(0, 8), 16);
  return num / 0xffffffff;
}

export function fairRngFromRound(round: FairRound) {
  const base = createHash("sha256")
    .update(combineSeed(round.serverSeed, round.clientSeed, round.nonce))
    .digest("hex");
  let cursor = 0;
  return () => {
    if (cursor + 8 > base.length) {
      cursor = 0;
    }
    const v = hashToFloat(base, cursor);
    cursor += 1;
    return v;
  };
}

export function reveal(round: FairRound) {
  return {
    serverSeed: round.serverSeed,
    serverSeedHash: round.serverSeedHash,
    clientSeed: round.clientSeed,
    nonce: round.nonce,
  };
}

export function verify(
  serverSeed: string,
  serverSeedHash: string,
  clientSeed: string,
  nonce: number
): boolean {
  if (hashServerSeed(serverSeed) !== serverSeedHash) return false;
  void combineSeed(serverSeed, clientSeed, nonce);
  return true;
}

export type FairRng = () => number;
