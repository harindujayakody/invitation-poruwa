import { setRequestLocale, getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations, seatingTables, seatAssignments, guests, rsvps } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { InvitationNav } from "@/components/app/invitation-nav";
import {
  SeatingCanvasManager,
  SeatingTableItem,
  SeatingGuestItem,
} from "@/components/seating/seating-canvas-manager";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export const instant = false;

interface SeatingPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function SeatingPage({ params }: SeatingPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/login`);
  }

  // Strictly owner-scoped query
  const [inv] = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.id, id), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!inv) {
    notFound();
  }

  // Fetch tables
  const dbTables = await db
    .select({
      id: seatingTables.id,
      label: seatingTables.label,
      capacity: seatingTables.capacity,
      x: seatingTables.x,
      y: seatingTables.y,
      published: seatingTables.published,
    })
    .from(seatingTables)
    .where(eq(seatingTables.invitationId, id))
    .orderBy(seatingTables.label);

  const initialTables: SeatingTableItem[] = dbTables.map((t) => ({
    id: t.id,
    label: t.label,
    capacity: t.capacity,
    x: t.x,
    y: t.y,
    published: t.published,
  }));

  // Fetch guests joined with seatAssignments and rsvps
  const rawGuests = await db
    .select({
      id: guests.id,
      name: guests.name,
      headsInvited: guests.headsInvited,
      side: guests.side,
      groupName: guests.groupName,
      rsvpStatus: rsvps.status,
      tableId: seatAssignments.tableId,
    })
    .from(guests)
    .leftJoin(seatAssignments, eq(guests.id, seatAssignments.guestId))
    .leftJoin(rsvps, eq(guests.id, rsvps.guestId))
    .where(eq(guests.invitationId, id))
    .orderBy(guests.name);

  // Deduplicate guests (in case of multiple event rsvps)
  const guestMap = new Map<string, SeatingGuestItem>();
  for (const g of rawGuests) {
    if (!guestMap.has(g.id)) {
      guestMap.set(g.id, {
        id: g.id,
        name: g.name,
        headsInvited: g.headsInvited,
        side: g.side,
        groupName: g.groupName,
        rsvpStatus: g.rsvpStatus,
        tableId: g.tableId,
      });
    } else if (g.rsvpStatus === "accepted") {
      const existing = guestMap.get(g.id)!;
      existing.rsvpStatus = "accepted";
    }
  }

  const initialGuests: SeatingGuestItem[] = Array.from(guestMap.values());
  const t = await getTranslations("seating");

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-[var(--space-6)]">
        <Link
          href="/app"
          className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] focus:outline-none"
          style={{ minHeight: "36px" }}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          <span>{t("backToDashboard")}</span>
        </Link>
      </div>

      <InvitationNav invitationId={id} slug={inv.slug} />

      <div className="mb-[var(--space-6)] text-left">
        <h1 className="font-display text-[length:var(--text-3xl)] leading-tight text-[var(--ink)]">
          {t("title")}
        </h1>
        <p className="mt-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink-muted)]">
          {t("subtitle", { slug: inv.slug })}
        </p>
      </div>

      <SeatingCanvasManager
        invitationId={id}
        slug={inv.slug}
        initialTables={initialTables}
        initialGuests={initialGuests}
        locale={locale}
      />
    </div>
  );
}
