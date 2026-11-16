"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { quoteRequests, vendorBlockedDates, vendorPackages, vendors } from "@/db/schema";
import { auth } from "@/lib/auth";
import { normalizeLkPhone } from "@/lib/phone";
import { CATEGORIES, CITIES } from "@/lib/vendors";
import { redirect } from "@/i18n/navigation";

const locale = z.enum(["si", "ta", "en"]).catch("si");
const uuid = z.string().uuid();
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** Every vendor mutation goes through here: signed in, and the vendor must belong to the caller. */
async function ownedVendorId(formData: FormData): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const vendorId = uuid.safeParse(formData.get("vendorId"));
  if (!session || !vendorId.success) return null;
  const [v] = await db
    .select({ id: vendors.id })
    .from(vendors)
    .where(and(eq(vendors.id, vendorId.data), eq(vendors.ownerId, session.user.id)))
    .limit(1);
  return v?.id ?? null;
}

function back(formData: FormData, status: string): never {
  return redirect({ href: `/app/vendor?s=${status}`, locale: locale.parse(formData.get("locale")) });
}

const createSchema = z.object({
  name: z.string().trim().min(2).max(80),
  category: z.enum(CATEGORIES),
  city: z.enum(CITIES),
  whatsapp: z.string().optional().default(""),
  priceFromLkr: z.coerce.number().int().min(0).max(100_000_000).optional().or(z.literal("")),
  description: z.string().trim().max(1500).default(""),
});

export async function createVendorAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) back(formData, "unauthorized");
  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) back(formData, "invalid");
  const d = parsed.data;
  const whatsapp = d.whatsapp ? normalizeLkPhone(d.whatsapp) : null;
  if (d.whatsapp && !whatsapp) back(formData, "invalid");

  const base = d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "vendor";
  await db.insert(vendors).values({
    ownerId: session.user.id,
    slug: `${base}-${randomBytes(3).toString("hex")}`, // suffix avoids slug collisions without a lookup
    name: d.name,
    category: d.category,
    city: d.city,
    whatsapp,
    priceFromLkr: d.priceFromLkr === "" || d.priceFromLkr === undefined ? null : d.priceFromLkr,
    description: d.description,
    published: false, // team approves before it goes live
  });
  back(formData, "created");
}

const packageSchema = z.object({
  name: z.string().trim().min(2).max(80),
  priceLkr: z.coerce.number().int().min(0).max(100_000_000),
  includes: z.string().trim().max(300).default(""),
});

export async function addPackageAction(formData: FormData) {
  const vendorId = await ownedVendorId(formData);
  const parsed = packageSchema.safeParse(Object.fromEntries(formData));
  if (!vendorId || !parsed.success) back(formData, "invalid");
  await db.insert(vendorPackages).values({ vendorId, ...parsed.data });
  back(formData, "saved");
}

export async function deletePackageAction(formData: FormData) {
  const vendorId = await ownedVendorId(formData);
  const id = uuid.safeParse(formData.get("id"));
  if (!vendorId || !id.success) back(formData, "invalid");
  await db.delete(vendorPackages).where(and(eq(vendorPackages.id, id.data), eq(vendorPackages.vendorId, vendorId)));
  back(formData, "saved");
}

export async function blockDateAction(formData: FormData) {
  const vendorId = await ownedVendorId(formData);
  const date = isoDate.safeParse(formData.get("date"));
  if (!vendorId || !date.success) back(formData, "invalid");
  await db.insert(vendorBlockedDates).values({ vendorId, date: date.data }).onConflictDoNothing();
  back(formData, "saved");
}

export async function unblockDateAction(formData: FormData) {
  const vendorId = await ownedVendorId(formData);
  const id = uuid.safeParse(formData.get("id"));
  if (!vendorId || !id.success) back(formData, "invalid");
  await db.delete(vendorBlockedDates).where(and(eq(vendorBlockedDates.id, id.data), eq(vendorBlockedDates.vendorId, vendorId)));
  back(formData, "saved");
}

export async function setQuoteStatusAction(formData: FormData) {
  const vendorId = await ownedVendorId(formData);
  const id = uuid.safeParse(formData.get("id"));
  const status = z.enum(["new", "replied", "closed"]).safeParse(formData.get("status"));
  if (!vendorId || !id.success || !status.success) back(formData, "invalid");
  await db
    .update(quoteRequests)
    .set({ status: status.data })
    .where(and(eq(quoteRequests.id, id.data), eq(quoteRequests.vendorId, vendorId)));
  back(formData, "saved");
}
