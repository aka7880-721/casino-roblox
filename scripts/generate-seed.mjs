import fs from "fs";

const pets = [
  ["Shadow Dragon", 270, "Legendary", "High"],
  ["Bat Dragon", 180, "Legendary", "High"],
  ["Frost Dragon", 95, "Legendary", "High"],
  ["Giraffe", 85, "Legendary", "High"],
  ["Parrot", 75, "Legendary", "High"],
  ["Owl", 70, "Legendary", "High"],
  ["Crow", 65, "Legendary", "High"],
  ["Evil Unicorn", 60, "Legendary", "High"],
  ["Kitsune", 55, "Legendary", "High"],
  ["Kangaroo", 50, "Legendary", "Medium"],
  ["Turtle", 48, "Legendary", "Medium"],
  ["Arctic Reindeer", 45, "Legendary", "Medium"],
  ["Queen Bee", 42, "Legendary", "Medium"],
  ["King Bee", 38, "Legendary", "Medium"],
  ["Frost Fury", 35, "Legendary", "Medium"],
  ["Skeleton T-Rex", 32, "Legendary", "Medium"],
  ["Frost Unicorn", 30, "Legendary", "Medium"],
  ["Diamond Unicorn", 28, "Legendary", "Medium"],
  ["Golden Unicorn", 26, "Legendary", "Medium"],
  ["Golden Dragon", 24, "Legendary", "Medium"],
  ["Diamond Dragon", 22, "Legendary", "Medium"],
  ["Dancing Dragon", 20, "Legendary", "Medium"],
  ["Ancient Dragon", 18, "Legendary", "Low"],
  ["Phoenix", 17, "Legendary", "Low"],
  ["Grim Dragon", 16, "Legendary", "Low"],
  ["Hedgehog", 14, "Ultra-Rare", "Medium"],
  ["Flamingo", 13, "Ultra-Rare", "Medium"],
  ["Lion", 12, "Ultra-Rare", "Medium"],
  ["Dalmatian", 11, "Ultra-Rare", "Medium"],
  ["Zombie Buffalo", 10, "Ultra-Rare", "Medium"],
  ["Turkey", 9, "Ultra-Rare", "Low"],
  ["Llama", 8.5, "Ultra-Rare", "Low"],
  ["Pig", 8, "Ultra-Rare", "Low"],
  ["Cow", 7.5, "Ultra-Rare", "Low"],
  ["Hyena", 7, "Ultra-Rare", "Low"],
  ["Wild Boar", 6.5, "Ultra-Rare", "Low"],
  ["Elephant", 6, "Ultra-Rare", "Low"],
  ["Crocodile", 5.5, "Rare", "Medium"],
  ["Hyena (Regular)", 5, "Rare", "Low"],
  ["Brown Bear", 4.8, "Rare", "Low"],
  ["Polar Bear", 4.5, "Rare", "Low"],
  ["Reindeer", 4.2, "Rare", "Low"],
  ["Swan", 4, "Rare", "Low"],
  ["Zombie Wolf", 3.8, "Rare", "Low"],
  ["Bee", 3.5, "Rare", "Low"],
  ["Bunny", 3.2, "Rare", "Low"],
  ["Red Panda", 3, "Rare", "Low"],
  ["Penguin", 2.8, "Rare", "Low"],
  ["Koala", 2.5, "Rare", "Low"],
  ["Sloth", 2.2, "Rare", "Low"],
  ["Red Fox", 2, "Uncommon", "Low"],
  ["Shiba Inu", 1.8, "Uncommon", "Low"],
  ["Crab", 1.5, "Uncommon", "Low"],
  ["Seahorse", 1.2, "Uncommon", "Low"],
  ["Dolphin", 1, "Uncommon", "Low"],
  ["Chocolate Labrador", 0.8, "Common", "Low"],
  ["Blue Dog", 0.6, "Common", "Low"],
  ["Cat", 0.4, "Common", "Low"],
  ["Dog", 0.35, "Common", "Low"],
  ["Buffalo", 0.3, "Common", "Low"],
];

const games = [
  ["coinflip", "CoinFlip", "1v1 pet coin flips", "pvp", true, 10, 50000, 0.02, 1],
  ["jackpot", "Jackpot", "Weighted pot winner", "multiplayer", true, 25, 100000, 0.05, 2],
  ["upgrader", "Upgrader", "Risk upgrade rolls", "classic", true, 10, 75000, 0.08, 3],
  ["race", "Race", "5 pet race track", "multiplayer", true, 15, 50000, 0.05, 4],
  ["dice", "Dice", "Over / under", "classic", false, 5, 25000, 0.02, 5],
  ["mines", "Mines", "5x5 grid mines", "classic", false, 5, 25000, 0.03, 6],
  ["tower", "Tower", "Climb 9 floors", "classic", false, 5, 25000, 0.03, 7],
  ["wheel", "Wheel", "Spin multipliers", "classic", false, 5, 25000, 0.04, 8],
  ["limbo", "Limbo", "Target multiplier", "classic", false, 5, 25000, 0.03, 9],
  ["plinko", "Plinko", "Drop the ball", "classic", false, 5, 25000, 0.03, 10],
  ["case-opening", "Case Opening", "Unbox pet pool", "classic", false, 10, 50000, 0.05, 11],
  ["crash", "Crash", "Rising multiplier", "classic", false, 5, 25000, 0.03, 12],
  ["roulette", "Roulette", "Colors and numbers", "classic", false, 5, 25000, 0.027, 13],
];

let sql = `-- AdoptLuck seed\n`;

sql += `INSERT INTO public.pets (name, image_url, value, rarity, demand) VALUES\n`;
sql += pets
  .map(
    ([name, value, rarity, demand]) =>
      `('${name.replace(/'/g, "''")}', 'https://elvebredd.com/images/pets/${encodeURIComponent(name.replace(/ /g, "-"))}.png', ${value * 1000}, '${rarity}', '${demand}')`
  )
  .join(",\n");
sql += ` ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value, rarity = EXCLUDED.rarity, demand = EXCLUDED.demand;\n\n`;

sql += `INSERT INTO public.games (slug, name, description, icon, category, enabled, min_bet, max_bet, house_edge, config, sort_order) VALUES\n`;
sql += games
  .map(
    ([slug, name, desc, cat, en, min, max, edge, sort]) =>
      `('${slug}', '${name}', '${desc}', null, '${cat}', ${en}, ${min}, ${max}, ${edge}, '{}', ${sort})`
  )
  .join(",\n");
sql += ` ON CONFLICT (slug) DO UPDATE SET enabled = EXCLUDED.enabled, house_edge = EXCLUDED.house_edge, sort_order = EXCLUDED.sort_order;\n\n`;

sql += `INSERT INTO public.site_settings (key, value) VALUES
('announcement', '{"text": "Welcome to AdoptLuck — trade pets, play provably fair games!"}'),
('maintenance', '{"enabled": false, "message": ""}'),
('jackpot', '{"roundSeconds": 120}')
ON CONFLICT (key) DO NOTHING;\n\n`;

fs.writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
console.log("Wrote supabase/seed.sql");
