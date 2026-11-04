import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Link } from "@/i18n/navigation";
import { Plus, Calendar, Users, Edit3, Heart, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InvitationContent } from "@/lib/schema/invitation";

export const instant = false;

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("dashboard");

  // Scope strictly by logged-in owner
  const userInvitations = await db
    .select()
    .from(invitations)
    .where(eq(invitations.ownerId, session.user.id))
    .orderBy(desc(invitations.createdAt));

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Top Banner with Title, Greeting, and Primary CTA */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-600 leading-relaxed">
            {t("greeting", { name: session.user.name || session.user.email })}
          </p>
        </div>

        <Link href="/app/new">
          <Button size="lg" className="gap-2.5 rounded-2xl px-6 py-3 shadow-md hover:shadow-lg">
            <Plus className="h-5 w-5" strokeWidth={2} />
            <span>{t("createCta")}</span>
          </Button>
        </Link>
      </div>

      {userInvitations.length === 0 ? (
        <Card className="p-10 sm:p-14 text-center bg-gradient-to-br from-white to-stone-50 border-stone-200 shadow-sm rounded-3xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-xs mb-6">
            <Heart className="h-8 w-8 fill-rose-100" />
          </div>
          <h2 className="font-display text-2xl font-bold text-stone-900">
            {t("emptyHeading")}
          </h2>
          <p className="mt-3 max-w-md mx-auto text-sm text-stone-600 leading-relaxed">
            {t("emptyState")}
          </p>
          <div className="mt-8">
            <Link href="/app/new">
              <Button size="lg" className="gap-2 rounded-2xl px-7 shadow-md">
                <Plus className="h-5 w-5" />
                <span>{t("createCta")}</span>
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
          {userInvitations.map((inv) => {
            const isPublished = inv.status === "published";
            const content = inv.content as InvitationContent | null;
            const coupleTitle = content?.couple?.partnerOne && content?.couple?.partnerTwo
              ? `${content.couple.partnerOne} & ${content.couple.partnerTwo}`
              : inv.slug;

            return (
              <Card
                key={inv.id}
                className="p-6 sm:p-7 rounded-3xl border border-stone-200 bg-white shadow-xs hover:border-stone-400 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  {/* Monogram Box */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-xs">
                    <Heart className="h-6 w-6 fill-rose-100" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-xl font-bold text-stone-900">
                        {coupleTitle}
                      </h2>
                      {isPublished ? (
                        <Badge variant="success" className="gap-1 px-3 py-0.5">
                          <Sparkles className="h-3 w-3" />
                          <span>{t("statusPublished")}</span>
                        </Badge>
                      ) : (
                        <Badge variant="amber" className="px-3 py-0.5">
                          <span>{t("statusDraft")}</span>
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-500 font-medium">
                      <span className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md">
                        suba.lk/i/{inv.slug}
                      </span>

                      {inv.eventDate && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-stone-400" />
                          {new Date(inv.eventDate).toLocaleDateString(locale, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-stone-400" />
                        {t("guestsCount", { count: 0 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {isPublished && (
                    <a
                      href={`/i/${inv.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button variant="outline" size="sm" className="gap-1.5 border-stone-300 text-stone-700">
                        <ExternalLink className="h-3.5 w-3.5 text-stone-500" />
                        <span>{t("viewCta")}</span>
                      </Button>
                    </a>
                  )}

                  <Link href={`/app/invitations/${inv.id}/guests`}>
                    <Button variant="outline" size="sm" className="gap-1.5 border-stone-300 text-stone-700">
                      <Users className="h-3.5 w-3.5 text-stone-500" />
                      <span>Guests</span>
                    </Button>
                  </Link>

                  <Link href={`/app/invitations/${inv.id}/edit`}>
                    <Button variant="default" size="sm" className="gap-1.5 px-4">
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>{t("editCta")}</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
