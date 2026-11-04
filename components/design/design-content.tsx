"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const colorTokens = [
  { name: "--surface", label: "Surface (Canvas)", value: "oklch(0.985 0.006 85)" },
  { name: "--surface-raised", label: "Surface Raised (Cards)", value: "oklch(0.995 0.004 85)" },
  { name: "--ink", label: "Ink (Primary text)", value: "oklch(0.22 0.015 60)" },
  { name: "--ink-muted", label: "Ink Muted (Secondary text)", value: "oklch(0.48 0.012 60)" },
  { name: "--line", label: "Line (Borders & dividers)", value: "oklch(0.90 0.01 80)" },
  { name: "--accent", label: "Accent (Terracotta / Clay)", value: "oklch(0.42 0.12 25)" },
  { name: "--accent-ink", label: "Accent Ink (Text on accent)", value: "oklch(0.985 0.006 85)" },
  { name: "--danger", label: "Danger (Destructive / Error)", value: "oklch(0.52 0.19 27)" },
  { name: "--success", label: "Success (Positive / Confirmed)", value: "oklch(0.52 0.12 155)" },
];

const spacingTokens = [
  { name: "--space-1", value: "0.25rem (4px)" },
  { name: "--space-2", value: "0.5rem (8px)" },
  { name: "--space-3", value: "0.75rem (12px)" },
  { name: "--space-4", value: "1rem (16px)" },
  { name: "--space-6", value: "1.5rem (24px)" },
  { name: "--space-8", value: "2rem (32px)" },
  { name: "--space-12", value: "3rem (48px)" },
  { name: "--space-18", value: "4.5rem (72px)" },
  { name: "--space-28", value: "7rem (112px)" },
];

const radiusTokens = [
  { name: "--radius-sm", value: "6px", label: "Small" },
  { name: "--radius-md", value: "10px", label: "Medium (Base)" },
  { name: "--radius-lg", value: "16px", label: "Large" },
];

const typeScaleTokens = [
  { name: "--text-xs", label: "XS (0.78rem - 0.84rem)" },
  { name: "--text-sm", label: "SM (0.875rem - 0.94rem)" },
  { name: "--text-base", label: "Base (1.0rem - 1.125rem)" },
  { name: "--text-lg", label: "LG (1.25rem - 1.5rem)" },
  { name: "--text-xl", label: "XL (1.56rem - 2.1rem)" },
  { name: "--text-2xl", label: "2XL (1.95rem - 3.0rem)" },
  { name: "--text-3xl", label: "3XL (2.4rem - 4.2rem)" },
];

const motionTokens = [
  { name: "--ease-out", value: "cubic-bezier(0.25, 1, 0.5, 1)" },
  { name: "--dur-fast", value: "150ms" },
  { name: "--dur-base", value: "220ms" },
  { name: "--dur-reveal", value: "560ms" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-[var(--space-18)]">
      <h2
        className="mb-[var(--space-6)] text-[length:var(--text-xl)] font-semibold leading-[var(--leading-heading)]"
        style={{ color: "var(--ink)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DesignContent() {
  const t = useTranslations("design");

  return (
    <div
      className="px-[var(--space-6)] py-[var(--space-12)] md:px-[var(--space-12)]"
      style={{ maxWidth: "var(--measure)" }}
    >
      <div className="mb-[var(--space-12)]">
        <h1
          className="text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-heading)]"
          style={{ color: "var(--ink)" }}
        >
          {t("title")}
        </h1>
        <p
          className="mt-[var(--space-2)] text-[length:var(--text-base)] leading-[var(--leading-body)]"
          style={{ color: "var(--ink-muted)" }}
        >
          Token inventory, component state matrix, and typography testing in all three languages.
        </p>
      </div>

      {/* 1. Colours */}
      <Section title={t("colors")}>
        <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-[var(--space-4)] rounded-[var(--radius-md)] border p-[var(--space-3)]"
              style={{
                borderColor: "var(--line)",
                backgroundColor: "var(--surface-raised)",
              }}
            >
              <div
                className="h-12 w-12 shrink-0 rounded-[var(--radius-sm)] border"
                style={{
                  backgroundColor: `var(${c.name})`,
                  borderColor: "var(--line)",
                }}
              />
              <div className="min-w-0">
                <p className="text-[length:var(--text-sm)] font-medium" style={{ color: "var(--ink)" }}>
                  {c.label}
                </p>
                <code className="text-[length:var(--text-xs)]" style={{ color: "var(--ink-muted)" }}>
                  {c.name}
                </code>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 2. Spacing */}
      <Section title={t("spacing")}>
        <div className="flex flex-col gap-[var(--space-4)]">
          {spacingTokens.map((s) => (
            <div key={s.name} className="flex items-center gap-[var(--space-4)]">
              <div
                className="shrink-0 rounded-[var(--radius-sm)]"
                style={{
                  width: `var(${s.name})`,
                  height: "1.5rem",
                  backgroundColor: "var(--accent)",
                  opacity: 0.35,
                }}
              />
              <code className="text-[length:var(--text-sm)] font-medium" style={{ color: "var(--ink)" }}>
                {s.name}
              </code>
              <span className="text-[length:var(--text-xs)]" style={{ color: "var(--ink-muted)" }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* 3. Radii */}
      <Section title={t("radii")}>
        <div className="flex flex-wrap gap-[var(--space-8)]">
          {radiusTokens.map((r) => (
            <div key={r.name} className="flex flex-col items-start gap-[var(--space-2)]">
              <div
                className="h-20 w-28 border-2"
                style={{
                  borderRadius: `var(${r.name})`,
                  borderColor: "var(--accent)",
                  backgroundColor: "var(--surface-raised)",
                }}
              />
              <code className="text-[length:var(--text-sm)] font-medium" style={{ color: "var(--ink)" }}>
                {r.name}
              </code>
              <span className="text-[length:var(--text-xs)]" style={{ color: "var(--ink-muted)" }}>
                {r.label} ({r.value})
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Motion & Touch Target */}
      <Section title="Motion & Accessibility Tokens">
        <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
          {motionTokens.map((m) => (
            <div
              key={m.name}
              className="rounded-[var(--radius-md)] border p-[var(--space-4)]"
              style={{
                borderColor: "var(--line)",
                backgroundColor: "var(--surface-raised)",
              }}
            >
              <code className="text-[length:var(--text-sm)] font-semibold" style={{ color: "var(--ink)" }}>
                {m.name}
              </code>
              <p className="mt-[var(--space-1)] text-[length:var(--text-xs)]" style={{ color: "var(--ink-muted)" }}>
                {m.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[var(--space-6)] flex items-center gap-[var(--space-4)]">
          <div
            className="flex items-center justify-center border-2 border-dashed rounded-[var(--radius-sm)]"
            style={{
              width: "var(--target)",
              height: "var(--target)",
              borderColor: "var(--accent)",
              color: "var(--ink)",
            }}
          >
            <span className="text-[length:var(--text-xs)] font-bold">44px</span>
          </div>
          <div>
            <p className="text-[length:var(--text-sm)] font-semibold" style={{ color: "var(--ink)" }}>
              --target (2.75rem / 44px)
            </p>
            <p className="text-[length:var(--text-xs)]" style={{ color: "var(--ink-muted)" }}>
              Minimum touch target size for interactive controls.
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Typography */}
      <Section title={t("typography")}>
        <div className="flex flex-col gap-[var(--space-6)]">
          {typeScaleTokens.map((ts) => (
            <div key={ts.name} className="border-b pb-[var(--space-4)]" style={{ borderColor: "var(--line)" }}>
              <code className="text-[length:var(--text-xs)]" style={{ color: "var(--ink-muted)" }}>
                {ts.name}: {ts.label}
              </code>
              <p
                className="mt-[var(--space-1)] leading-[var(--leading-body)]"
                style={{ fontSize: `var(${ts.name})`, color: "var(--ink)" }}
              >
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          ))}
        </div>

        {/* Script tests */}
        <div className="mt-[var(--space-12)] space-y-[var(--space-8)]">
          <div>
            <span className="text-[length:var(--text-xs)] font-semibold tracking-wide uppercase" style={{ color: "var(--accent)" }}>
              Sinhala (si): Body Line-height 1.7, no faux italic
            </span>
            <p
              lang="si"
              className="mt-[var(--space-2)] text-[length:var(--text-base)]"
              style={{ color: "var(--ink)", lineHeight: 1.7 }}
            >
              ශ්‍රී ලංකාවේ විවාහ උත්සව රටේ සංස්කෘතික උරුමයේ වැදගත් කොටසකි. අමුත්තන්ට පුද්ගලික WhatsApp සබැඳි යැවීමෙන් පහසුවෙන් RSVP ලබා ගත හැක.
            </p>
          </div>

          <div>
            <span className="text-[length:var(--text-xs)] font-semibold tracking-wide uppercase" style={{ color: "var(--accent)" }}>
              Tamil (ta): Body Line-height 1.7, no faux italic
            </span>
            <p
              lang="ta"
              className="mt-[var(--space-2)] text-[length:var(--text-base)]"
              style={{ color: "var(--ink)", lineHeight: 1.7 }}
            >
              இலங்கையில் திருமண விழாக்கள் நாட்டின் கலாச்சார பாரம்பரியத்தின் முக்கிய பகுதியாகும். விருந்தினர்களுக்கு தனிப்பட்ட WhatsApp இணைப்புகளை அனுப்பி எளிதாக RSVP பெறலாம்.
            </p>
          </div>

          <div>
            <span className="text-[length:var(--text-xs)] font-semibold tracking-wide uppercase" style={{ color: "var(--accent)" }}>
              English (en): Body Line-height 1.55
            </span>
            <p
              lang="en"
              className="mt-[var(--space-2)] text-[length:var(--text-base)] leading-[var(--leading-body)]"
              style={{ color: "var(--ink)" }}
            >
              Digital wedding invitations made for Sri Lankan weddings. Send individual WhatsApp links to every guest and track your RSVPs in real time.
            </p>
          </div>

          <div>
            <span className="text-[length:var(--text-xs)] font-semibold tracking-wide uppercase" style={{ color: "var(--accent)" }}>
              Display Headings (--font-display)
            </span>
            <p
              className="font-display mt-[var(--space-2)] text-[length:var(--text-2xl)] leading-[var(--leading-heading)]"
              style={{ color: "var(--ink)" }}
            >
              An unforgettable ceremony
            </p>
            <p
              lang="si"
              className="font-display mt-[var(--space-3)] text-[length:var(--text-2xl)] leading-[1.3]"
              style={{ color: "var(--ink)" }}
            >
              ඔබේ විවාහ ආරාධනය, සෑම අමුත්තෙකුටම පුද්ගලිකව
            </p>
          </div>
        </div>
      </Section>

      {/* 6. Component States (All required states) */}
      <Section title={t("states")}>
        <div className="flex flex-col gap-[var(--space-12)]">
          {/* A. Buttons */}
          <div>
            <h3 className="mb-[var(--space-4)] text-[length:var(--text-base)] font-semibold" style={{ color: "var(--ink)" }}>
              Button States (Default, Hover, Focus, Disabled, Loading)
            </h3>
            <div className="flex flex-wrap items-center gap-[var(--space-4)]">
              {/* Default */}
              <Button style={{ minHeight: "var(--target)" }}>
                {t("default")}
              </Button>

              {/* Hover state representation (using solid tint, no opacity wash) */}
              <Button style={{ minHeight: "var(--target)", backgroundColor: "color-mix(in oklch, var(--accent), black 12%)" }}>
                {t("hover")}
              </Button>

              {/* Focus state representation */}
              <Button className="ring-2 ring-[var(--accent)] ring-offset-2" style={{ minHeight: "var(--target)" }}>
                {t("focus")}
              </Button>

              {/* Disabled state */}
              <Button disabled style={{ minHeight: "var(--target)" }}>
                {t("disabled")}
              </Button>

              {/* Loading state */}
              <Button disabled style={{ minHeight: "var(--target)" }}>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                {t("loading")}
              </Button>

              {/* Destructive */}
              <Button variant="destructive" style={{ minHeight: "var(--target)" }}>
                Destructive
              </Button>

              {/* Outline */}
              <Button variant="outline" style={{ minHeight: "var(--target)" }}>
                Outline
              </Button>

              {/* Secondary */}
              <Button variant="secondary" style={{ minHeight: "var(--target)" }}>
                Secondary
              </Button>
            </div>
          </div>

          {/* B. Inputs & Labels */}
          <div>
            <h3 className="mb-[var(--space-4)] text-[length:var(--text-base)] font-semibold" style={{ color: "var(--ink)" }}>
              Input States (Default, Focus, Disabled, Error)
            </h3>
            <div className="grid grid-cols-1 gap-[var(--space-6)] sm:grid-cols-2" style={{ maxWidth: "600px" }}>
              <div>
                <Label htmlFor="inp-default" className="text-[length:var(--text-xs)] font-medium">
                  Default Input
                </Label>
                <Input
                  id="inp-default"
                  placeholder="e.g. Kasun Perera"
                  className="mt-[var(--space-1)]"
                  style={{ minHeight: "var(--target)" }}
                />
              </div>

              <div>
                <Label htmlFor="inp-focus" className="text-[length:var(--text-xs)] font-medium">
                  Focused Input
                </Label>
                <Input
                  id="inp-focus"
                  placeholder="Focus state"
                  className="mt-[var(--space-1)] ring-2 ring-[var(--accent)]"
                  style={{ minHeight: "var(--target)" }}
                />
              </div>

              <div>
                <Label htmlFor="inp-disabled" className="text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)]">
                  Disabled Input
                </Label>
                <Input
                  id="inp-disabled"
                  disabled
                  placeholder="Cannot edit"
                  className="mt-[var(--space-1)]"
                  style={{ minHeight: "var(--target)" }}
                />
              </div>

              <div>
                <Label htmlFor="inp-error" className="text-[length:var(--text-xs)] font-medium text-[var(--danger)]">
                  Error Input
                </Label>
                <Input
                  id="inp-error"
                  defaultValue="Invalid phone number"
                  aria-invalid="true"
                  className="mt-[var(--space-1)] border-[var(--danger)] text-[var(--danger)]"
                  style={{ minHeight: "var(--target)" }}
                />
                <p className="mt-[var(--space-1)] text-[length:var(--text-xs)] text-[var(--danger)]">
                  {t("error")}: Must be a valid Sri Lankan number (e.g. 0771234567).
                </p>
              </div>
            </div>
          </div>

          {/* C. Checkbox & Switch */}
          <div>
            <h3 className="mb-[var(--space-4)] text-[length:var(--text-base)] font-semibold" style={{ color: "var(--ink)" }}>
              Checkbox & Switch Controls
            </h3>
            <div className="flex flex-wrap items-center gap-[var(--space-8)]">
              <div className="flex items-center gap-[var(--space-2)]">
                <Checkbox id="chk-1" defaultChecked />
                <Label htmlFor="chk-1" className="text-[length:var(--text-sm)]">
                  Checked Checkbox
                </Label>
              </div>

              <div className="flex items-center gap-[var(--space-2)]">
                <Checkbox id="chk-2" />
                <Label htmlFor="chk-2" className="text-[length:var(--text-sm)]">
                  Unchecked Checkbox
                </Label>
              </div>

              <div className="flex items-center gap-[var(--space-2)]">
                <Checkbox id="chk-3" disabled />
                <Label htmlFor="chk-3" className="text-[length:var(--text-sm)] text-[var(--ink-muted)]">
                  Disabled Checkbox
                </Label>
              </div>

              <div className="flex items-center gap-[var(--space-2)]">
                <Switch id="sw-1" defaultChecked />
                <Label htmlFor="sw-1" className="text-[length:var(--text-sm)]">
                  Switch Active
                </Label>
              </div>

              <div className="flex items-center gap-[var(--space-2)]">
                <Switch id="sw-2" disabled />
                <Label htmlFor="sw-2" className="text-[length:var(--text-sm)] text-[var(--ink-muted)]">
                  Switch Disabled
                </Label>
              </div>
            </div>
          </div>

          {/* D. Tabs */}
          <div>
            <h3 className="mb-[var(--space-4)] text-[length:var(--text-base)] font-semibold" style={{ color: "var(--ink)" }}>
              Tabs Component
            </h3>
            <Tabs defaultValue="overview" className="w-full" style={{ maxWidth: "500px" }}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="guests">Guest List</TabsTrigger>
                <TabsTrigger value="rsvp">RSVPs</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-[var(--space-4)] text-[length:var(--text-sm)]" style={{ color: "var(--ink-muted)" }}>
                Overview of the invitation performance and guest engagements.
              </TabsContent>
              <TabsContent value="guests" className="p-[var(--space-4)] text-[length:var(--text-sm)]" style={{ color: "var(--ink-muted)" }}>
                Add and manage individual WhatsApp guest links.
              </TabsContent>
              <TabsContent value="rsvp" className="p-[var(--space-4)] text-[length:var(--text-sm)]" style={{ color: "var(--ink-muted)" }}>
                Live response breakdown per event.
              </TabsContent>
            </Tabs>
          </div>

          {/* E. Table */}
          <div>
            <h3 className="mb-[var(--space-4)] text-[length:var(--text-base)] font-semibold" style={{ color: "var(--ink)" }}>
              Table Component
            </h3>
            <div className="rounded-[var(--radius-md)] border" style={{ borderColor: "var(--line)" }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>WhatsApp Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Seats</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Kasun & Family</TableCell>
                    <TableCell>+94 77 123 4567</TableCell>
                    <TableCell>
                      <span className="text-[var(--success)] font-medium">Accepted</span>
                    </TableCell>
                    <TableCell className="text-right">3</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Niroshan Perera</TableCell>
                    <TableCell>+94 71 987 6543</TableCell>
                    <TableCell>
                      <span className="text-[var(--ink-muted)]">Pending</span>
                    </TableCell>
                    <TableCell className="text-right">1</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* F. Loading (Skeleton) */}
          <div>
            <h3 className="mb-[var(--space-4)] text-[length:var(--text-base)] font-semibold" style={{ color: "var(--ink)" }}>
              Loading State (Skeletons)
            </h3>
            <div className="flex flex-col gap-[var(--space-3)]" style={{ maxWidth: "400px" }}>
              <Skeleton className="h-6 w-3/4 rounded-[var(--radius-sm)]" />
              <Skeleton className="h-4 w-full rounded-[var(--radius-sm)]" />
              <Skeleton className="h-4 w-5/6 rounded-[var(--radius-sm)]" />
            </div>
          </div>

          {/* G. Empty State */}
          <div>
            <h3 className="mb-[var(--space-4)] text-[length:var(--text-base)] font-semibold" style={{ color: "var(--ink)" }}>
              Empty State
            </h3>
            <div
              className="flex flex-col items-start rounded-[var(--radius-md)] border-2 border-dashed p-[var(--space-8)]"
              style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
            >
              <p className="text-[length:var(--text-base)] font-medium" style={{ color: "var(--ink)" }}>
                {t("empty")}
              </p>
              <p className="mt-[var(--space-1)] text-[length:var(--text-sm)]" style={{ color: "var(--ink-muted)" }}>
                No wedding guests have been added to this list yet.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
