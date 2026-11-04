"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { quoteRequests, vendors } from "@/db/schema";
import { normalizeLkPhone } from "@/lib/phone";
import { rateLimit } from "@/lib/rate-limit";
import { redirect } from "@/i18n/navigation";

const quoteSchema = z.object({
  locale: z.enum(["si", "ta", "en"]),
  slug: z.string().min(1).max(120),
  name: z.string().trim().min(2).max(80),
  phone: z.string().transform((v, ctx) => {
    const n = normalizeLkPhone(v);
    if (!n) ctx.addIssue({ code: "custom", message: "phone" });
    return n ?? "";
  }),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  guestCount: z.coerce.number().int().min(1).max(5000).optional().or(z.literal("")),
  message: z.string().max(1000).default(""),
});

/** Public, unauthenticated: a couple asks one vendor for a quote. */
export async function requestQuoteAction(formData: FormData) {
  const parsed = quoteSchema.safeParse(Object.fromEntries(formData));
  const locale = (formData.get("locale") as "si" | "ta" | "en") || "si";
  const slug = String(formData.get("slug") ?? "");
  if (!parsed.success) {
    redirect({ href: `/vendors/${encodeURIComponent(slug)}?quote=invalid#quote`, locale });
    return;
  }
  const d = parsed.data;

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`quote:${ip}`, 10, 60 * 60_000)) {
    redirect({ href: `/vendors/${encodeURIComponent(d.slug)}?quote=limit#quote`, locale: d.locale });
    return;
  }

  const [vendor] = await db
    .select({ id: vendors.id })
    .from(vendors)
    .where(and(eq(vendors.slug, d.slug), eq(vendors.published, true)))
    .limit(1);
  if (!vendor) redirect({ href: "/vendors", locale: d.locale });

  await db.insert(quoteRequests).values({
    vendorId: vendor.id,
    name: d.name,
    phone: d.phone,
    eventDate: d.eventDate || null,
    guestCount: d.guestCount === "" || d.guestCount === undefined ? null : d.guestCount,
    message: d.message,
  });

  redirect({ href: `/vendors/${encodeURIComponent(d.slug)}?quote=sent#quote`, locale: d.locale });
}
