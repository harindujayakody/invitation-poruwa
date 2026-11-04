import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { MarketplaceView } from "@/components/marketplace/marketplace-view";

interface TemplatesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TemplatesPage({ params }: TemplatesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-sunken)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-[var(--space-4)] py-[var(--space-8)] sm:px-[var(--space-6)] md:py-[var(--space-12)]">
        <MarketplaceView locale={locale} />
      </main>
      <SiteFooter />
    </div>
  );
}
