import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { TabBar } from "@/components/hub/tab-bar";
import { DesignsCarousel } from "@/components/marketing/designs-carousel";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeaturesShowcase } from "@/components/marketing/features-showcase";
import { CostComparison } from "@/components/marketing/cost-comparison";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { SiteFooter } from "@/components/marketing/site-footer";

export const instant = false;

interface InvitationsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function InvitationsPage({ params }: InvitationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)] text-[var(--ink)]">
      <SiteHeader />
      <main>
        <Hero />
        <DesignsCarousel />
        <HowItWorks />
        <FeaturesShowcase />
        <CostComparison />
        <PricingSection />
        <FaqSection />
      </main>
      <SiteFooter />
      <TabBar active="invites" />
    </div>
  );
}
