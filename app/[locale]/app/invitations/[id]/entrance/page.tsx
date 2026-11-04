import { setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { invitationContentSchema } from "@/lib/schema/invitation";
import { EntranceSignView } from "@/components/seating/entrance-sign-view";
import QRCode from "qrcode";

export const instant = false;

interface EntrancePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EntranceSignPage({ params }: EntrancePageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/login`);
  }

  // Strictly owner-scoped
  const [inv] = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.id, id), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!inv) {
    notFound();
  }

  const parsedContent = invitationContentSchema.safeParse(inv.content);
  const coupleNames = parsedContent.success
    ? `${parsedContent.data.couple.partnerOne} & ${parsedContent.data.couple.partnerTwo}`
    : "The Happy Couple";

  const venue = parsedContent.success ? parsedContent.data.events?.[0]?.venue : null;

  // Generate SVG QR Code targeting public table locator
  // In production: https://wedding.lk/${locale}/i/${inv.slug}/tables
  const tableLocatorPath = `/${locale}/i/${inv.slug}/tables`;
  const qrSvg = await QRCode.toString(tableLocatorPath, {
    type: "svg",
    margin: 1,
    color: {
      dark: "#2b2823", // var(--ink) token
      light: "#00000000", // transparent
    },
  });

  const formattedDate = inv.eventDate
    ? new Date(inv.eventDate).toLocaleDateString(locale === "si" ? "si-LK" : locale === "ta" ? "ta-LK" : "en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-4xl py-[var(--space-4)]">
      <EntranceSignView
        invitationId={id}
        slug={inv.slug}
        coupleNames={coupleNames}
        eventDate={formattedDate}
        venue={venue}
        qrSvg={qrSvg}
        tableLocatorUrl={tableLocatorPath}
      />
    </div>
  );
}
