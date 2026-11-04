import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/db";
import { invitations, seatingTables, seatAssignments, guests } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { invitationContentSchema } from "@/lib/schema/invitation";
import {
  PublicTableLocator,
  PublicSeatedGuest,
  PublicTableItem,
} from "@/components/guest/public-table-locator";

export const instant = false;

interface TablesPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: TablesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [inv] = await db
    .select({ content: invitations.content })
    .from(invitations)
    .where(eq(invitations.slug, slug))
    .limit(1);

  if (!inv) {
    return {
      title: "Table Locator",
      robots: { index: false, follow: false },
    };
  }

  const parsed = invitationContentSchema.safeParse(inv.content);
  const title = parsed.success
    ? `Find Your Banquet Table - ${parsed.data.couple.partnerOne} & ${parsed.data.couple.partnerTwo}`
    : "Find Your Banquet Table";

  return {
    title,
    description: "Look up your wedding banquet table and seating arrangement.",
    robots: { index: false, follow: false },
  };
}

export default async function TablesPage({ params }: TablesPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // 1. Fetch invitation
  const [inv] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.slug, slug))
    .limit(1);

  if (!inv) {
    notFound();
  }

  const parsedContent = invitationContentSchema.safeParse(inv.content);
  const coupleNames = parsedContent.success
    ? `${parsedContent.data.couple.partnerOne} & ${parsedContent.data.couple.partnerTwo}`
    : "Wedding Celebration";

  // 2. Fetch seating tables
  const dbTables = await db
    .select({
      id: seatingTables.id,
      label: seatingTables.label,
      capacity: seatingTables.capacity,
      published: seatingTables.published,
    })
    .from(seatingTables)
    .where(eq(seatingTables.invitationId, inv.id))
    .orderBy(seatingTables.label);

  const isPublished = dbTables.length > 0 && dbTables.some((tbl) => tbl.published);

  let publicGuests: PublicSeatedGuest[] = [];
  let publicTables: PublicTableItem[] = [];

  if (isPublished) {
    publicTables = dbTables
      .filter((t) => t.published)
      .map((t) => ({
        id: t.id,
        label: t.label,
        capacity: t.capacity,
      }));

    // Fetch seated guests for published tables
    const seatedRows = await db
      .select({
        guestId: guests.id,
        guestName: guests.name,
        headsInvited: guests.headsInvited,
        tableId: seatingTables.id,
        tableLabel: seatingTables.label,
        tableCapacity: seatingTables.capacity,
      })
      .from(seatAssignments)
      .innerJoin(seatingTables, eq(seatAssignments.tableId, seatingTables.id))
      .innerJoin(guests, eq(seatAssignments.guestId, guests.id))
      .where(and(eq(seatingTables.invitationId, inv.id), eq(seatingTables.published, true)))
      .orderBy(guests.name);

    publicGuests = seatedRows;
  }

  return (
    <PublicTableLocator
      slug={slug}
      coupleNames={coupleNames}
      isPublished={isPublished}
      tables={publicTables}
      guests={publicGuests}
      locale={locale}
    />
  );
}
