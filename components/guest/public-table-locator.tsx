"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Search, X, Users, LayoutGrid, Heart, ArrowLeft } from "lucide-react";

export interface PublicSeatedGuest {
  guestId: string;
  guestName: string;
  headsInvited: number;
  tableId: string;
  tableLabel: string;
  tableCapacity: number;
}

export interface PublicTableItem {
  id: string;
  label: string;
  capacity: number;
}

interface PublicTableLocatorProps {
  slug: string;
  coupleNames: string;
  isPublished: boolean;
  tables: PublicTableItem[];
  guests: PublicSeatedGuest[];
  locale: string;
}

export function PublicTableLocator({
  slug,
  coupleNames,
  isPublished,
  tables,
  guests,
  locale,
}: PublicTableLocatorProps) {
  const t = useTranslations("tableLocator");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "tables">("search");

  // Search matches
  const filteredGuests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return guests.filter((g) => g.guestName.toLowerCase().includes(q));
  }, [searchQuery, guests]);

  // Group seated guests by table
  const guestsByTable = useMemo(() => {
    const map = new Map<string, PublicSeatedGuest[]>();
    tables.forEach((tbl) => map.set(tbl.id, []));
    guests.forEach((g) => {
      const list = map.get(g.tableId) || [];
      list.push(g);
      map.set(g.tableId, list);
    });
    return map;
  }, [tables, guests]);

  return (
    <div
      lang={locale}
      className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col items-center selection:bg-[var(--accent)] selection:text-[var(--accent-ink)]"
    >
      {/* Top Header */}
      <header className="w-full max-w-2xl px-[var(--space-4)] py-[var(--space-3)] flex items-center justify-between text-[length:var(--text-xs)]">
        <Link
          href={`/i/${slug}`}
          className="inline-flex items-center gap-[var(--space-1)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>{t("backToInvite")}</span>
        </Link>

        {/* Language switch */}
        <nav
          aria-label="Language selection"
          className="flex items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] p-[2px]"
        >
          <Link
            href={`/si/i/${slug}/tables`}
            className={`rounded-[var(--radius-sm)] px-[var(--space-2)] py-[2px] transition-colors ${
              locale === "si"
                ? "bg-[var(--accent)] text-[var(--accent-ink)] font-medium"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            සිංහල
          </Link>
          <Link
            href={`/ta/i/${slug}/tables`}
            className={`rounded-[var(--radius-sm)] px-[var(--space-2)] py-[2px] transition-colors ${
              locale === "ta"
                ? "bg-[var(--accent)] text-[var(--accent-ink)] font-medium"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            தமிழ்
          </Link>
          <Link
            href={`/en/i/${slug}/tables`}
            className={`rounded-[var(--radius-sm)] px-[var(--space-2)] py-[2px] transition-colors ${
              locale === "en"
                ? "bg-[var(--accent)] text-[var(--accent-ink)] font-medium"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            EN
          </Link>
        </nav>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-xl px-[var(--space-4)] py-[var(--space-6)] flex flex-col space-y-[var(--space-6)] text-left">
        {/* Title */}
        <div className="text-center space-y-[var(--space-2)]">
          <div className="inline-flex items-center gap-1.5 text-[length:var(--text-xs)] text-[var(--accent)] font-medium uppercase tracking-wider">
            <Heart className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.5} />
            <span>{coupleNames}</span>
          </div>
          <h1 className="font-display text-[length:var(--text-3xl)] font-semibold text-[var(--ink)]">
            {t("title")}
          </h1>
          <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)] max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Private Notice Guard */}
        {!isPublished ? (
          <div
            data-testid="seating-private-guard"
            className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-8)] text-center space-y-[var(--space-3)]"
          >
            <LayoutGrid className="mx-auto h-8 w-8 text-[var(--ink-muted)]" strokeWidth={1.5} />
            <h2 className="font-display text-[length:var(--text-lg)] font-medium text-[var(--ink)]">
              {t("privateNotice")}
            </h2>
            <Link
              href={`/i/${slug}`}
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--accent-ink)]"
              style={{
                backgroundColor: "var(--accent)",
                minHeight: "var(--target)",
              }}
            >
              {t("backToInvite")}
            </Link>
          </div>
        ) : (
          <div className="space-y-[var(--space-6)]">
            {/* View Tabs */}
            <div className="flex border-b border-[var(--line)]">
              <button
                type="button"
                onClick={() => setActiveTab("search")}
                className={`flex-1 py-[var(--space-2)] text-center text-[length:var(--text-sm)] font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "search"
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
                style={{ minHeight: "44px" }}
              >
                {t("searchTab")}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tables")}
                className={`flex-1 py-[var(--space-2)] text-center text-[length:var(--text-sm)] font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "tables"
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
                style={{ minHeight: "44px" }}
              >
                {t("allTablesTab")} ({tables.length})
              </button>
            </div>

            {/* TAB 1: SEARCH GUEST */}
            {activeTab === "search" && (
              <div className="space-y-[var(--space-4)]">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-muted)]" strokeWidth={1.5} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    aria-label={t("searchPlaceholder")}
                    autoFocus
                    className="w-full rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] pl-10 pr-10 py-[var(--space-3)] text-[length:var(--text-sm)] font-medium text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[var(--accent)] focus:outline-none"
                    style={{ minHeight: "var(--target)" }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] hover:text-[var(--ink)] p-1"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  )}
                </div>

                {/* Search Results */}
                {searchQuery.trim().length === 0 ? (
                  <p className="text-center text-[length:var(--text-xs)] text-[var(--ink-muted)] py-[var(--space-6)]">
                    {t("searchHint")}
                  </p>
                ) : filteredGuests.length === 0 ? (
                  <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-8)] text-center">
                    <Users className="mx-auto h-6 w-6 text-[var(--ink-muted)] mb-2" strokeWidth={1.5} />
                    <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                      {t("noResults")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-[var(--space-3)]" data-testid="table-search-results">
                    {filteredGuests.map((g) => {
                      const coSeated = (guestsByTable.get(g.tableId) || []).filter(
                        (other) => other.guestId !== g.guestId,
                      );

                      return (
                        <div
                          key={g.guestId}
                          data-testid="guest-table-result"
                          className="rounded-[var(--radius-lg)] border p-[var(--space-4)] space-y-[var(--space-3)] text-left shadow-xs"
                          style={{
                            borderColor: "color-mix(in oklch, var(--accent) 30%, transparent)",
                            backgroundColor: "color-mix(in oklch, var(--accent) 5%, var(--surface))",
                          }}
                        >
                          <div className="flex items-start justify-between gap-[var(--space-2)]">
                            <div>
                              <span className="text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)] block">
                                {t("head")}
                              </span>
                              <h3 className="font-display text-[length:var(--text-lg)] font-semibold text-[var(--ink)]">
                                {g.guestName}
                              </h3>
                              <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                                {g.headsInvited} {g.headsInvited === 1 ? t("head") : t("heads")}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)] block">
                                {t("assignedTo")}
                              </span>
                              <span
                                className="inline-block rounded-[var(--radius-md)] border px-[var(--space-3)] py-1 text-[length:var(--text-sm)] font-semibold"
                                style={{
                                  borderColor: "color-mix(in oklch, var(--accent) 35%, transparent)",
                                  backgroundColor: "var(--surface)",
                                  color: "var(--accent)",
                                }}
                              >
                                {g.tableLabel}
                              </span>
                            </div>
                          </div>

                          {/* Co-seated guests */}
                          {coSeated.length > 0 && (
                            <div className="border-t pt-[var(--space-2)]" style={{ borderColor: "color-mix(in oklch, var(--accent) 15%, transparent)" }}>
                              <span className="text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)] block mb-1">
                                {t("seatedWith")}:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {coSeated.map((c) => (
                                  <span
                                    key={c.guestId}
                                    className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] px-2 py-0.5 text-[length:var(--text-xs)] text-[var(--ink)]"
                                  >
                                    {c.guestName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ALL TABLES DIRECTORY */}
            {activeTab === "tables" && (
              <div className="space-y-[var(--space-4)]" data-testid="all-tables-directory">
                {tables.map((table) => {
                  const tableGuests = guestsByTable.get(table.id) || [];
                  const totalHeads = tableGuests.reduce((acc, g) => acc + g.headsInvited, 0);

                  return (
                    <div
                      key={table.id}
                      className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)] space-y-[var(--space-3)]"
                    >
                      <div className="flex items-center justify-between border-b border-[var(--line)] pb-[var(--space-2)]">
                        <div className="flex items-center gap-2">
                          <LayoutGrid className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
                          <h3 className="font-display text-[length:var(--text-base)] font-semibold text-[var(--ink)]">
                            {table.label}
                          </h3>
                        </div>
                        <span className="text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)]">
                          {totalHeads} / {table.capacity} {t("seats")}
                        </span>
                      </div>

                      {tableGuests.length === 0 ? (
                        <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)] italic">
                          No guests assigned to this table.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {tableGuests.map((g) => (
                            <div
                              key={g.guestId}
                              className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg)] p-2 flex items-center justify-between"
                            >
                              <span className="text-[length:var(--text-xs)] font-medium text-[var(--ink)] truncate">
                                {g.guestName}
                              </span>
                              <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)] shrink-0 ml-1">
                                ({g.headsInvited})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
