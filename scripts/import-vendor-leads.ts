// Import the vendor lead list as HIDDEN listings (published=false, verified=false).
// Listings go live only after the team has called the vendor, got consent and checked details.
// The CSV holds third-party contact data: keep it in /outreach (gitignored), never in the repo.
//
// Dry run (no writes):  npx tsx --env-file=.env.local scripts/import-vendor-leads.ts --dry-run
// Import:               npx tsx --env-file=.env.local scripts/import-vendor-leads.ts
import { readFileSync } from "node:fs";
import { normalizeLkPhone } from "../lib/phone";
import type { vendors as vendorsTable } from "../db/schema";

type VendorRow = typeof vendorsTable.$inferInsert;

const CATEGORY_MAP: Record<string, VendorRow["category"]> = {
  venue: "venue", photographer: "photographer", video: "photographer", decor: "decor",
  salon: "salon", car: "car", dj: "dj", band: "dj",
};
const CITIES = new Set(["colombo", "gampaha", "kandy", "galle", "negombo"]);

/** Minimal CSV parser: handles quoted fields with commas and doubled quotes. */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (ch !== "\r") field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter((r) => r.some(Boolean)).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

export function toVendorRow(lead: Record<string, string>): { skip: string } | { row: VendorRow } {
  const category = CATEGORY_MAP[lead.category];
  if (!category) return { skip: `category:${lead.category || "none"}` };
  if (!CITIES.has(lead.city)) return { skip: `city:${lead.city || "none"}` };
  // Only mobiles can take WhatsApp; landlines stay in the CSV for phone outreach.
  const whatsapp = lead.phone.split("/").map((p) => normalizeLkPhone(p)).find(Boolean) ?? null;
  return {
    row: {
      slug: `${slugify(lead.name)}-${lead.city}`, // deterministic, so re-running the import is a no-op
      name: lead.name.trim(),
      category,
      city: lead.city,
      whatsapp,
      description: "",
      published: false,
      verified: false,
    },
  };
}

// Self-check of the mapping rules (runs on every invocation, before any DB access).
{
  const ok = toVendorRow({ name: "Studio X (Pvt) Ltd", category: "band", city: "kandy", phone: "011 2222222 / 077 123 4567" });
  if (!("row" in ok) || ok.row.slug !== "studio-x-pvt-ltd-kandy" || ok.row.category !== "dj" || ok.row.whatsapp !== "94771234567") throw new Error("self-check failed: mapping");
  if (!("skip" in toVendorRow({ name: "A", category: "cakes", city: "kandy", phone: "" }))) throw new Error("self-check failed: skip");
  const parsed = parseCsv('name,category\n"A, B ""C""",venue\n');
  if (parsed[0].name !== 'A, B "C"') throw new Error("self-check failed: csv");
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const leads = parseCsv(readFileSync("outreach/vendor-leads.csv", "utf8"));
  const rows: VendorRow[] = [];
  const skipped: Record<string, number> = {};
  for (const lead of leads) {
    const r = toVendorRow(lead);
    if ("skip" in r) skipped[r.skip] = (skipped[r.skip] ?? 0) + 1;
    else rows.push(r.row);
  }
  const byCat = rows.reduce<Record<string, number>>((a, r) => ((a[r.category] = (a[r.category] ?? 0) + 1), a), {});
  console.log(`leads=${leads.length} importable=${rows.length} withWhatsApp=${rows.filter((r) => r.whatsapp).length}`);
  console.log("by category:", byCat);
  console.log("skipped:", skipped);
  if (dryRun) return;

  const { db } = await import("../db");
  const { vendors } = await import("../db/schema");
  const inserted = await db.insert(vendors).values(rows).onConflictDoNothing({ target: vendors.slug }).returning({ id: vendors.id });
  console.log(`inserted ${inserted.length} hidden listings (${rows.length - inserted.length} already existed)`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
