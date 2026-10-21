export type DbUser = {
  id: string;
  username: string;
  email: string;
  balance: number;
  role: "user" | "admin";
  avatar_url: string | null;
  level: number;
  xp: number;
  banned: boolean;
  created_at: string;
};

export type DbPet = {
  id: string;
  name: string;
  image_url: string | null;
  value: number;
  rarity: string;
  demand: string;
  updated_at: string;
};

export type DbGame = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: string;
  enabled: boolean;
  min_bet: number;
  max_bet: number;
  house_edge: number;
  config: Record<string, unknown>;
  sort_order: number;
  created_at: string;
};

export type PlayResult = {
  win: boolean;
  payout: number;
  multiplier?: number;
  data: Record<string, unknown>;
};

export type GamePlayInput = {
  amount: number;
  houseEdge: number;
  config: Record<string, unknown>;
  payload: Record<string, unknown>;
};
