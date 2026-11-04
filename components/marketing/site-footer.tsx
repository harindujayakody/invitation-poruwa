import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("footer");
  const year = "2026";

  return (
    <footer
      className="mt-auto px-[var(--space-6)] py-[var(--space-12)] md:px-[var(--space-12)]"
      style={{ borderTop: "1px solid var(--line)" }}
    >
      <p
        className="text-[length:var(--text-sm)] leading-[var(--leading-body)]"
        style={{ color: "var(--ink-muted)" }}
      >
        {t("tagline")}
      </p>

      <nav className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-6)]">
        {(["contact", "terms", "privacy"] as const).map((key) => (
          <a
            key={key}
            href="#"
            className="text-[length:var(--text-sm)]"
            style={{ color: "var(--ink-muted)", minHeight: "var(--target)", display: "inline-flex", alignItems: "center" }}
          >
            {t(key)}
          </a>
        ))}
      </nav>

      <p
        className="mt-[var(--space-6)] text-[length:var(--text-xs)]"
        style={{ color: "var(--ink-muted)" }}
      >
        {t("copyright", { year })}
      </p>
    </footer>
  );
}
