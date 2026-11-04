import { setRequestLocale } from "next-intl/server";
import DesignContent from "@/components/design/design-content";

export const instant = false;

export default async function DesignPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DesignContent />;
}
