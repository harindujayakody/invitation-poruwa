// Demo vendors for local development only. All names are fictional.
// Run: npx tsx --env-file=.env.local scripts/seed-vendors.ts
import { db } from "../db";
import { vendors, vendorPackages } from "../db/schema";

type Seed = { slug: string; name: string; category: "venue" | "photographer" | "decor" | "salon" | "car"; city: string; priceFromLkr: number; description: string; packages: [string, number, string][] };

const demo: Seed[] = [
  { slug: "demo-lake-view-banquets", name: "Lake View Banquets (demo)", category: "venue", city: "kandy", priceFromLkr: 4500, description: "Banquet hall for up to 400 guests. Price is per plate.", packages: [["Silver menu", 4500, "Buffet, welcome drink, hall decor"], ["Gold menu", 5800, "Buffet, dessert bar, Poruwa area"]] },
  { slug: "demo-studio-pinkframe", name: "Studio Pinkframe (demo)", category: "photographer", city: "kandy", priceFromLkr: 95000, description: "Wedding and homecoming photography.", packages: [["Poruwa only", 95000, "1 photographer, 300 edited photos, 20-page album"], ["Poruwa + Homecoming", 165000, "2 photographers, video, 40-page album"]] },
  { slug: "demo-coastline-photos", name: "Coastline Photos (demo)", category: "photographer", city: "galle", priceFromLkr: 120000, description: "Beach and hotel weddings on the south coast.", packages: [["Full day", 120000, "2 photographers, drone, online gallery"]] },
  { slug: "demo-lotus-decor", name: "Lotus Decor (demo)", category: "decor", city: "colombo", priceFromLkr: 180000, description: "Poruwa, stage and table decor.", packages: [["Poruwa set", 180000, "Poruwa, flowers, ceremony aisle"]] },
  { slug: "demo-blush-bridal", name: "Blush Bridal Salon (demo)", category: "salon", city: "gampaha", priceFromLkr: 85000, description: "Kandyan and Indian bridal dressing.", packages: [["Bride + 2 maids", 85000, "Dressing, makeup, 1 trial"]] },
  { slug: "demo-vintage-rides", name: "Vintage Rides (demo)", category: "car", city: "negombo", priceFromLkr: 35000, description: "Decorated vintage cars with driver.", packages: [["Half day", 35000, "Car, driver, flower decor"]] },
];

async function main() {
  for (const v of demo) {
    const [row] = await db
      .insert(vendors)
      .values({ slug: v.slug, name: v.name, category: v.category, city: v.city, priceFromLkr: v.priceFromLkr, description: v.description })
      .onConflictDoNothing({ target: vendors.slug })
      .returning({ id: vendors.id });
    if (!row) continue; // already seeded
    await db.insert(vendorPackages).values(v.packages.map(([name, priceLkr, includes], i) => ({ vendorId: row.id, name, priceLkr, includes, sortOrder: i })));
  }
  console.log(`Seeded ${demo.length} demo vendors`);
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
