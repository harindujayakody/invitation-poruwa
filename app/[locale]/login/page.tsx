import { setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { AuthForm } from "@/components/auth/auth-form";

export const instant = false;

interface LoginPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  const { mode } = await searchParams;
  setRequestLocale(locale);

  // If already logged in, redirect straight to dashboard
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(`/${locale}/app`);
  }

  const initialMode = mode === "signup" ? "signUp" : "signIn";

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--ink)]">
      <header
        className="flex items-center justify-between px-[var(--space-6)] py-[var(--space-4)] md:px-[var(--space-12)]"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <Link
          href="/"
          className="text-[length:var(--text-base)] font-semibold text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)]"
          style={{ minHeight: "var(--target)", display: "inline-flex", alignItems: "center" }}
        >
          Wedding
        </Link>
        <LocaleSwitcher />
      </header>

      <main className="flex flex-1 items-center justify-center px-[var(--space-6)] py-[var(--space-12)]">
        <AuthForm initialMode={initialMode} locale={locale} />
      </main>

      <footer
        className="px-[var(--space-6)] py-[var(--space-4)] text-center text-[length:var(--text-xs)] text-[var(--ink-muted)] md:px-[var(--space-12)]"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        © 2026 [PLACEHOLDER_COMPANY]. All rights reserved.
      </footer>
    </div>
  );
}
