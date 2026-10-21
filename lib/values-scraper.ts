import * as cheerio from "cheerio";
import { createAdminClient } from "@/lib/supabase/admin";

const FALLBACK = [
  { name: "Shadow Dragon", value: 270000, rarity: "Legendary", demand: "High" },
  { name: "Frost Dragon", value: 95000, rarity: "Legendary", demand: "High" },
  { name: "Bat Dragon", value: 180000, rarity: "Legendary", demand: "High" },
];

export async function refreshPetValues() {
  let scraped: typeof FALLBACK = [];
  try {
    const res = await fetch("https://elvebredd.com/values", {
      headers: { "User-Agent": "AdoptLuck/1.0" },
      next: { revalidate: 0 },
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    $("table tr").each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length < 2) return;
      const name = $(cells[0]).text().trim();
      const valueRaw = $(cells[1]).text().replace(/[^0-9.]/g, "");
      const value = parseFloat(valueRaw);
      if (name && value > 0) {
        scraped.push({ name, value: value * 1000, rarity: "Unknown", demand: "Normal" });
      }
    });
  } catch {
    scraped = [];
  }
  const list = scraped.length ? scraped : FALLBACK;
  const admin = createAdminClient();
  for (const pet of list) {
    await admin
      .from("pets")
      .upsert(
        {
          name: pet.name,
          value: pet.value,
          rarity: pet.rarity,
          demand: pet.demand,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "name" }
      );
  }
  return { count: list.length, fallback: scraped.length === 0 };
}
