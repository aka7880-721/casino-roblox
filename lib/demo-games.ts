import type { DbGame } from "@/lib/types";

/** Shown when Supabase is offline or DB has no enabled rows yet */
export const DEMO_GAMES: DbGame[] = [
  {
    id: "demo-1",
    slug: "coinflip",
    name: "CoinFlip",
    description: "1v1 pet flips",
    icon: null,
    category: "pvp",
    enabled: true,
    min_bet: 10,
    max_bet: 50000,
    house_edge: 0.02,
    config: {},
    sort_order: 1,
    created_at: "",
  },
  {
    id: "demo-2",
    slug: "jackpot",
    name: "Jackpot",
    description: "Weighted pot",
    icon: null,
    category: "multiplayer",
    enabled: true,
    min_bet: 25,
    max_bet: 100000,
    house_edge: 0.05,
    config: {},
    sort_order: 2,
    created_at: "",
  },
  {
    id: "demo-3",
    slug: "upgrader",
    name: "Upgrader",
    description: "Risk to upgrade",
    icon: null,
    category: "classic",
    enabled: true,
    min_bet: 10,
    max_bet: 75000,
    house_edge: 0.08,
    config: {},
    sort_order: 3,
    created_at: "",
  },
  {
    id: "demo-4",
    slug: "race",
    name: "Race",
    description: "5 pet race",
    icon: null,
    category: "multiplayer",
    enabled: true,
    min_bet: 15,
    max_bet: 50000,
    house_edge: 0.05,
    config: {},
    sort_order: 4,
    created_at: "",
  },
];

const MORE_DEMO: DbGame[] = [
  "dice",
  "mines",
  "tower",
  "wheel",
  "limbo",
  "plinko",
  "case-opening",
  "crash",
  "roulette",
].map((slug, i) => ({
  id: `demo-${slug}`,
  slug,
  name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  description: "Demo mode",
  icon: null,
  category: "classic",
  enabled: false,
  min_bet: 5,
  max_bet: 25000,
  house_edge: 0.03,
  config: {},
  sort_order: 10 + i,
  created_at: "",
}));

export const ALL_DEMO_GAMES = [...DEMO_GAMES, ...MORE_DEMO];

export function getDemoGameBySlug(slug: string): DbGame | null {
  return ALL_DEMO_GAMES.find((g) => g.slug === slug) ?? null;
}
