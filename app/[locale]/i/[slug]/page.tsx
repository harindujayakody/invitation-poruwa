import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/db";
import { invitations, guests, invitationEvents, rsvps, deliveries, seatingTables, seatAssignments } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { invitationContentSchema } from "@/lib/schema/invitation";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { RsvpForm, ExistingRsvpData } from "@/components/guest/rsvp-form";
import { CalendarLinks } from "@/components/guest/calendar-links";
import { Heart, Users, LayoutGrid, Camera } from "lucide-react";
import Link from "next/link";

export const instant = false;

interface GuestInvitationPageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ g?: string }>;
}

export async function generateMetadata({
  params,
}: GuestInvitationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [inv] = await db
    .select({ content: invitations.content })
    .from(invitations)
    .where(eq(invitations.slug, slug))
    .limit(1);

  if (!inv) {
    return {
      title: "Wedding Invitation",
      robots: { index: false, follow: false },
    };
  }

  const parsed = invitationContentSchema.safeParse(inv.content);
  const title = parsed.success
    ? `${parsed.data.couple.partnerOne} & ${parsed.data.couple.partnerTwo} - Wedding Invitation`
    : "Wedding Invitation";

  return {
    title,
    description: "You are warmly invited to celebrate our wedding.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function GuestInvitationPage({
  params,
  searchParams,
}: GuestInvitationPageProps) {
  const { locale, slug } = await params;
  const { g: guestToken } = await searchParams;
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
  const content = parsedContent.success
    ? parsedContent.data
    : {
        couple: { partnerOne: "Kasun", partnerTwo: "Sanduni" },
        events: [],
        sections: {
          showCover: true,
          showEvents: true,
          showStory: true,
          showRsvp: true,
          showGifts: false,
        },
      };

  // 2. Fetch invitation events
  let dbEvents = await db
    .select()
    .from(invitationEvents)
    .where(eq(invitationEvents.invitationId, inv.id))
    .orderBy(asc(invitationEvents.sort));

  if (dbEvents.length === 0 && content.events && content.events.length > 0) {
    const toInsert = content.events.map((ev, idx) => ({
      invitationId: inv.id,
      title: ev.title,
      venue: ev.venue,
      mapUrl: ev.mapUrl,
      notes: ev.notes,
      sort: idx,
    }));
    dbEvents = await db.insert(invitationEvents).values(toInsert).returning();
  }

  // 3. Check guest token if provided
  let guestRecord: {
    id: string;
    name: string;
    headsInvited: number;
    side: string | null;
  } | null = null;
  let assignedTable: { label: string } | null = null;
  let existingRsvps: ExistingRsvpData[] = [];

  if (guestToken) {
    const [foundGuest] = await db
      .select({
        id: guests.id,
        name: guests.name,
        headsInvited: guests.headsInvited,
        side: guests.side,
      })
      .from(guests)
      .where(and(eq(guests.token, guestToken), eq(guests.invitationId, inv.id)))
      .limit(1);

    if (foundGuest) {
      guestRecord = foundGuest;

      // Telemetry: record first_opened_at if not set
      const [del] = await db
        .select()
        .from(deliveries)
        .where(eq(deliveries.guestId, foundGuest.id))
        .limit(1);

      if (del && !del.firstOpenedAt) {
        await db
          .update(deliveries)
          .set({ firstOpenedAt: new Date() })
          .where(eq(deliveries.guestId, foundGuest.id));
      }

      // Check for assigned table if published
      const [tableRow] = await db
        .select({
          label: seatingTables.label,
          published: seatingTables.published,
        })
        .from(seatAssignments)
        .innerJoin(seatingTables, eq(seatAssignments.tableId, seatingTables.id))
        .where(eq(seatAssignments.guestId, foundGuest.id))
        .limit(1);

      if (tableRow && tableRow.published) {
        assignedTable = { label: tableRow.label };
      }

      // Fetch existing RSVPs for this guest
      const rsvpRows = await db
        .select({
          eventId: rsvps.eventId,
          status: rsvps.status,
          headsAttending: rsvps.headsAttending,
          message: rsvps.message,
        })
        .from(rsvps)
        .where(eq(rsvps.guestId, foundGuest.id));

      existingRsvps = rsvpRows;
    }
  }

  const t = await getTranslations("guestInvite");
  const tSeating = await getTranslations("seating");

  // Query parameter string for language links
  const tokenQuery = guestToken ? `?g=${encodeURIComponent(guestToken)}` : "";

  return (
    <div
      lang={locale}
      className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col items-center selection:bg-[var(--accent)] selection:text-[var(--accent-ink)]"
    >
      {/* Language Switcher Bar */}
      <header className="w-full max-w-2xl px-[var(--space-4)] py-[var(--space-3)] flex items-center justify-between text-[length:var(--text-xs)]">
        <div className="flex items-center gap-[var(--space-1)] text-[var(--ink-muted)]">
          <Heart className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.5} />
          <span className="font-serif italic">wedding.lk</span>
        </div>

        <nav
          aria-label={t("languageSwitcher")}
          className="flex items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] p-[2px]"
        >
          <Link
            href={`/si/i/${slug}${tokenQuery}`}
            className={`rounded-[var(--radius-sm)] px-[var(--space-2)] py-[2px] transition-colors ${
              locale === "si"
                ? "bg-[var(--accent)] text-[var(--accent-ink)] font-medium"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            සිංහල
          </Link>
          <Link
            href={`/ta/i/${slug}${tokenQuery}`}
            className={`rounded-[var(--radius-sm)] px-[var(--space-2)] py-[2px] transition-colors ${
              locale === "ta"
                ? "bg-[var(--accent)] text-[var(--accent-ink)] font-medium"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            தமிழ்
          </Link>
          <Link
            href={`/en/i/${slug}${tokenQuery}`}
            className={`rounded-[var(--radius-sm)] px-[var(--space-2)] py-[2px] transition-colors ${
              locale === "en"
                ? "bg-[var(--accent)] text-[var(--accent-ink)] font-medium"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            EN
          </Link>
        </nav>
      </header>

      {/* Personalized Greeting Card if guest identified */}
      {guestRecord && (
        <aside
          aria-label={t("speciallyInvited")}
          className="w-full max-w-xl px-[var(--space-4)] my-[var(--space-4)] text-left"
        >
          <div
            className="rounded-[var(--radius-lg)] border p-[var(--space-4)] text-left"
            style={{
              borderColor: "color-mix(in oklch, var(--accent) 30%, transparent)",
              backgroundColor: "color-mix(in oklch, var(--accent) 6%, var(--surface))",
            }}
          >
            <div className="flex items-start justify-between gap-[var(--space-2)]">
              <div>
                <span
                  className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider block"
                  style={{ color: "var(--accent)" }}
                >
                  {t("speciallyInvited")}
                </span>
                <h2 className="font-display text-[length:var(--text-xl)] font-semibold text-[var(--ink)] mt-0.5">
                  {guestRecord.name}
                </h2>
              </div>
              <span
                className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium"
                style={{
                  borderColor: "color-mix(in oklch, var(--accent) 25%, transparent)",
                  backgroundColor: "var(--surface)",
                  color: "var(--accent)",
                }}
              >
                <Users className="h-3 w-3" strokeWidth={1.5} />
                <span>
                  {guestRecord.headsInvited}{" "}
                  {guestRecord.headsInvited === 1 ? "seat" : "seats"}
                </span>
              </span>
            </div>

            <p className="mt-[var(--space-2)] text-[length:var(--text-xs)] text-[var(--ink-muted)]">
              {t("reservedSeats", { count: guestRecord.headsInvited })}
            </p>

            {/* Assigned Banquet Table if published */}
            {assignedTable && (
              <div
                data-testid="guest-assigned-table"
                className="mt-[var(--space-3)] pt-[var(--space-3)] border-t flex items-center justify-between gap-[var(--space-2)]"
                style={{
                  borderColor: "color-mix(in oklch, var(--accent) 20%, transparent)",
                }}
              >
                <div>
                  <span className="text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)] block">
                    {tSeating("guestYourTable")}
                  </span>
                  <span className="font-semibold text-[length:var(--text-sm)] text-[var(--ink)]">
                    {assignedTable.label}
                  </span>
                </div>
                <span
                  className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border px-[var(--space-2)] py-[2px] text-[length:var(--text-xs)] font-medium"
                  style={{
                    borderColor: "color-mix(in oklch, var(--accent) 30%, transparent)",
                    backgroundColor: "var(--surface)",
                    color: "var(--accent)",
                  }}
                >
                  <LayoutGrid className="h-3 w-3" strokeWidth={1.5} />
                  <span>{tSeating("guestYourTable")}</span>
                </span>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Main Cultural Invitation Suite */}
      <main className="w-full max-w-2xl px-[var(--space-4)] flex flex-col items-center">
        <div className="w-full rounded-[var(--radius-lg)] border border-[var(--line)] overflow-hidden shadow-sm bg-[var(--surface)]">
          <TemplateRenderer
            templateId={inv.templateSlug}
            content={content}
            locale={locale}
          />
        </div>

        {/* Add to Calendar links */}
        {inv.eventDate && (
          <CalendarLinks
            title={`${content.couple.partnerOne} & ${content.couple.partnerTwo} Wedding`}
            eventDate={inv.eventDate}
            venue={content.events[0]?.venue}
            notes={content.story?.quote}
            locale={locale}
          />
        )}

        {/* Multi-event RSVP Form */}
        <RsvpForm
          invitationSlug={slug}
          guestToken={guestToken || null}
          guestName={guestRecord?.name || null}
          headsInvited={guestRecord?.headsInvited || 1}
          events={dbEvents.map((e) => ({
            id: e.id,
            title: e.title,
            venue: e.venue,
            mapUrl: e.mapUrl,
            notes: e.notes,
            startsAt: e.startsAt,
          }))}
          initialRsvps={existingRsvps}
          locale={locale}
        />

        {/* Live Photo Stream CTA */}
        <div
          data-testid="live-gallery-cta"
          className="w-full mt-[var(--space-6)] rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)] text-center flex flex-col sm:flex-row items-center justify-between gap-[var(--space-3)]"
        >
          <div className="flex items-center gap-[var(--space-2)] text-left">
            <Camera className="h-5 w-5 text-[var(--accent)] shrink-0" strokeWidth={1.5} />
            <div>
              <h3 className="font-display text-[length:var(--text-sm)] font-semibold text-[var(--ink)]">
                Live Photo Stream
              </h3>
              <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                Share and view candid moments from our wedding reception.
              </p>
            </div>
          </div>
          <Link
            href={`/${locale}/i/${slug}/gallery`}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--accent-ink)]"
            style={{
              backgroundColor: "var(--accent)",
              minHeight: "36px",
            }}
          >
            <span>View Gallery</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-2xl px-[var(--space-4)] py-[var(--space-8)] text-center text-[length:var(--text-xs)] text-[var(--ink-muted)]">
        <p>{t("footerText")}</p>
      </footer>
    </div>
  );
}
