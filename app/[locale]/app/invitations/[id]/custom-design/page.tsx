import { setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations, customDesignRequests } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { InvitationNav } from "@/components/app/invitation-nav";
import {
  CustomDesignView,
  CustomDesignRequestItem,
} from "@/components/custom-design/custom-design-view";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export const instant = false;

interface CustomDesignPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function CustomDesignPage({ params }: CustomDesignPageProps) {
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

  // Fetch submitted requests
  const rawRequests = await db
    .select({
      id: customDesignRequests.id,
      requestType: customDesignRequests.requestType,
      title: customDesignRequests.title,
      description: customDesignRequests.description,
      contactWhatsapp: customDesignRequests.contactWhatsapp,
      attachmentUrl: customDesignRequests.attachmentUrl,
      status: customDesignRequests.status,
      adminNotes: customDesignRequests.adminNotes,
      createdAt: customDesignRequests.createdAt,
    })
    .from(customDesignRequests)
    .where(eq(customDesignRequests.invitationId, id))
    .orderBy(desc(customDesignRequests.createdAt));

  const initialRequests: CustomDesignRequestItem[] = rawRequests.map((r) => ({
    id: r.id,
    requestType: r.requestType,
    title: r.title,
    description: r.description,
    contactWhatsapp: r.contactWhatsapp,
    attachmentUrl: r.attachmentUrl,
    status: r.status,
    adminNotes: r.adminNotes,
    createdAt: r.createdAt,
  }));

  return (
    <div className="mx-auto max-w-5xl px-[var(--space-4)] py-[var(--space-6)] sm:px-[var(--space-6)]">
      {/* Back button */}
      <div className="mb-[var(--space-4)]">
        <Link
          href="/app"
          className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink-muted)] hover:text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)] min-h-[var(--target)]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Invitation sub-navigation */}
      <InvitationNav invitationId={id} slug={inv.slug} />

      {/* Main custom design concierge view */}
      <main>
        <CustomDesignView
          invitationId={id}
          slug={inv.slug}
          initialRequests={initialRequests}
          locale={locale}
        />
      </main>
    </div>
  );
}
