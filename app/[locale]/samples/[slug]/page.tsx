import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CULTURAL_TEMPLATES } from "@/lib/templates";
import { SamplePreviewView } from "@/components/marketplace/sample-preview-view";

interface SamplePreviewPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const locales = ["si", "ta", "en"];
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    for (const tpl of CULTURAL_TEMPLATES) {
      params.push({ locale, slug: tpl.id });
    }
  }

  return params;
}

export default async function SamplePreviewPage({ params }: SamplePreviewPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const template = CULTURAL_TEMPLATES.find((t) => t.id === slug);
  if (!template) {
    notFound();
  }

  return <SamplePreviewView template={template} locale={locale} />;
}
