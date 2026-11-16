import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/marketing/site-header";
import { HubHome } from "@/components/hub/hub-home";
import { TabBar } from "@/components/hub/tab-bar";
import { SiteFooter } from "@/components/marketing/site-footer";

export const instant = false;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)] text-[var(--ink)]">
      <SiteHeader />
      <main className="flex-1">
        <HubHome />
      </main>
      <SiteFooter />
      <TabBar active="home" />
    </div>
  );
}
