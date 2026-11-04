import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export function Closing() {
  const t = useTranslations("closing");

  return (
    <section
      className="px-[var(--space-6)] py-[var(--space-18)] md:px-[var(--space-12)] md:py-[var(--space-28)]"
      style={{ maxWidth: "var(--measure)" }}
    >
      <h2
        className="font-display text-[length:var(--text-xl)] md:text-[length:var(--text-2xl)] leading-[var(--leading-heading)]"
        style={{ color: "var(--ink)" }}
      >
        {t("headline")}
      </h2>

      <p
        className="mt-[var(--space-4)] text-[length:var(--text-base)] leading-[var(--leading-body)]"
        style={{ color: "var(--ink-muted)", maxWidth: "48ch" }}
      >
        {t("sub")}
      </p>

      <Link
        href="/login"
        className="mt-[var(--space-8)] inline-flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)] px-[var(--space-6)] py-[var(--space-4)] text-[length:var(--text-base)] font-medium transition-opacity duration-[var(--dur-base)] hover:opacity-90"
        style={{
          backgroundColor: "var(--accent)",
          color: "var(--accent-ink)",
          minHeight: "var(--target)",
        }}
      >
        {t("cta")}
        <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
      </Link>
    </section>
  );
}
