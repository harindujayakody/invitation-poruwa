"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

interface AuthFormProps {
  initialMode?: "signIn" | "signUp";
  locale: string;
}

export function AuthForm({ initialMode = "signIn", locale }: AuthFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();

  const [mode, setMode] = useState<"signIn" | "signUp">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSignUp = mode === "signUp";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const emailSchema = z.string().email();
    const passSchema = z.string().min(8);

    if (isSignUp && !name.trim()) {
      setErrorMessage(t("nameRequired"));
      return;
    }

    if (!emailSchema.safeParse(email).success) {
      setErrorMessage(t("emailRequired"));
      return;
    }

    if (!passSchema.safeParse(password).success) {
      setErrorMessage(t("passwordTooShort"));
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          // Store couple's locale
          callbackURL: `/${locale}/app`,
        });

        if (error) {
          if (error.message?.toLowerCase().includes("already") || error.code === "USER_ALREADY_EXISTS") {
            setErrorMessage(t("emailInUse"));
          } else {
            setErrorMessage(error.message || t("invalidCredentials"));
          }
          setLoading(false);
          return;
        }

        toast.success(t("signUpTitle"));
        router.push("/app");
        router.refresh();
      } else {
        const { error } = await authClient.signIn.email({
          email: email.trim().toLowerCase(),
          password,
          callbackURL: `/${locale}/app`,
        });

        if (error) {
          setErrorMessage(t("invalidCredentials"));
          setLoading(false);
          return;
        }

        router.push("/app");
        router.refresh();
      }
    } catch {
      setErrorMessage(t("invalidCredentials"));
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <header className="mb-[var(--space-6)] text-left">
        <h1 className="font-display text-[length:var(--text-2xl)] leading-tight tracking-normal text-[var(--ink)]">
          {isSignUp ? t("signUpTitle") : t("signInTitle")}
        </h1>
        <p className="mt-[var(--space-2)] text-[length:var(--text-sm)] leading-[1.7] text-[var(--ink-muted)]">
          {isSignUp ? t("signUpSub") : t("signInSub")}
        </p>
      </header>

      {errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-[var(--space-4)] rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium"
          style={{
            backgroundColor: "color-mix(in oklch, var(--danger) 12%, transparent)",
            color: "var(--danger)",
            border: "1px solid var(--danger)",
          }}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-[var(--space-4)]">
        {isSignUp && (
          <div>
            <label
              htmlFor="auth-name"
              className="block text-[length:var(--text-sm)] font-medium text-[var(--ink)]"
            >
              {t("nameLabel")}
            </label>
            <input
              id="auth-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              disabled={loading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="mt-[var(--space-1)] block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-base)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[var(--focus)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-50"
              style={{ minHeight: "var(--target)" }}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="auth-email"
            className="block text-[length:var(--text-sm)] font-medium text-[var(--ink)]"
          >
            {t("emailLabel")}
          </label>
          <input
            id="auth-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="mt-[var(--space-1)] block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-base)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[var(--focus)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-50"
            style={{ minHeight: "var(--target)" }}
          />
        </div>

        <div>
          <label
            htmlFor="auth-password"
            className="block text-[length:var(--text-sm)] font-medium text-[var(--ink)]"
          >
            {t("passwordLabel")}
          </label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("passwordPlaceholder")}
            className="mt-[var(--space-1)] block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-base)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[var(--focus)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-50"
            style={{ minHeight: "var(--target)" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-[var(--space-6)] inline-flex w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-base)] font-medium text-[var(--accent-ink)] transition-colors duration-[var(--dur-base)] hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: "var(--accent)",
            minHeight: "var(--target)",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              <span>{t("loadingButton")}</span>
            </>
          ) : (
            <span>{isSignUp ? t("signUpButton") : t("signInButton")}</span>
          )}
        </button>
      </form>

      <div className="mt-[var(--space-6)] text-left">
        <button
          type="button"
          onClick={() => {
            setErrorMessage(null);
            setMode(isSignUp ? "signIn" : "signUp");
          }}
          className="text-[length:var(--text-sm)] font-medium text-[var(--accent)] transition-colors hover:underline focus:outline-none focus:ring-1 focus:ring-[var(--focus)]"
          style={{ minHeight: "var(--target)", display: "inline-flex", alignItems: "center" }}
        >
          {isSignUp ? t("switchToSignIn") : t("switchToSignUp")}
        </button>
      </div>
    </div>
  );
}
