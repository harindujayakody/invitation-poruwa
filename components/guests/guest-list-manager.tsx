"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  addGuestAction,
  deleteGuestAction,
  markGuestSentAction,
  importGuestsAction,
} from "@/app/actions/guests";
import { normalizeLkPhone, buildWhatsAppLink } from "@/lib/phone";
import { toast } from "sonner";
import {
  UserPlus,
  Upload,
  Search,
  Send,
  Copy,
  Trash2,
  CheckCircle,
  Clock,
  Download,
  Loader2,
  Users,
  X,
  Phone,
} from "lucide-react";

export interface GuestItem {
  id: string;
  name: string;
  phoneE164: string | null;
  headsInvited: number;
  groupName: string | null;
  side: string | null;
  token: string;
  createdAt: Date;
  sentAt: Date | null;
  firstOpenedAt: Date | null;
}

interface GuestListManagerProps {
  invitationId: string;
  slug: string;
  initialGuests: GuestItem[];
  locale: string;
}

export function GuestListManager({
  invitationId,
  slug,
  initialGuests,
  locale,
}: GuestListManagerProps) {
  const t = useTranslations("guests");
  const router = useRouter();

  const [guestsList, setGuestsList] = useState<GuestItem[]>(initialGuests);
  const [searchQuery, setSearchQuery] = useState("");
  const [sideFilter, setSideFilter] = useState<string>("all");
  const [deliveryFilter, setDeliveryFilter] = useState<string>("all");

  // Add Guest Modal / Drawer
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addHeads, setAddHeads] = useState(1);
  const [addSide, setAddSide] = useState<"bride" | "groom" | "both">("both");
  const [addGroup, setAddGroup] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // CSV Import Modal
  const [isCsvOpen, setIsCsvOpen] = useState(false);
  const [csvRows, setCsvRows] = useState<
    Array<{ name: string; phone: string; heads: number; side: string; group: string; validPhone: boolean }>
  >([]);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Computed metrics
  const totalGuests = guestsList.length;
  const totalHeads = guestsList.reduce((acc, g) => acc + (g.headsInvited || 1), 0);
  const sentCount = guestsList.filter((g) => g.sentAt !== null).length;

  // Filtered guests
  const filteredGuests = guestsList.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.phoneE164 && g.phoneE164.includes(searchQuery));

    const matchesSide =
      sideFilter === "all" ||
      (sideFilter === "bride" && g.side === "bride") ||
      (sideFilter === "groom" && g.side === "groom") ||
      (sideFilter === "both" && g.side === "both");

    const matchesDelivery =
      deliveryFilter === "all" ||
      (deliveryFilter === "sent" && g.sentAt !== null) ||
      (deliveryFilter === "pending" && g.sentAt === null);

    return matchesSearch && matchesSide && matchesDelivery;
  });

  // Base URL for personal invitation link
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3972";

  // Build personal guest message
  function getWhatsAppMessage(name: string, token: string): string {
    const personalUrl = `${origin}/i/${slug}?g=${token}`;
    if (locale === "si") {
      return `ආයුබෝවන් ${name}, අපගේ විවාහ මංගල්‍යය සඳහා ඔබට ආදරයෙන් ආරාධනා කරමු. ඔබගේ පුද්ගලික ආරාධනා පත්‍රය මෙතැනින් බලන්න: ${personalUrl}`;
    }
    if (locale === "ta") {
      return `வணக்கம் ${name}, எங்கள் திருமண விழாவிற்கு உங்களை அன்போடு அழைக்கின்றோம். உங்கள் தனிப்பட்ட அழைப்பிதழை இங்கே காண்க: ${personalUrl}`;
    }
    return `Dear ${name}, we warmly invite you to celebrate our wedding. View your personal invitation here: ${personalUrl}`;
  }

  // Handle WhatsApp click
  async function handleSendWhatsApp(guest: GuestItem) {
    if (!guest.phoneE164) {
      toast.error(t("noPhoneError"));
      return;
    }

    const norm = normalizeLkPhone(guest.phoneE164);
    if (!norm) {
      toast.error(t("invalidPhoneError"));
      return;
    }

    const message = getWhatsAppMessage(guest.name, guest.token);
    const link = buildWhatsAppLink(norm, message);

    // Open WhatsApp in new tab
    window.open(link, "_blank", "noopener,noreferrer");

    // Mark as sent
    try {
      const res = await markGuestSentAction(guest.id);
      if (res.success && res.sentAt) {
        setGuestsList((prev) =>
          prev.map((g) => (g.id === guest.id ? { ...g, sentAt: new Date(res.sentAt) } : g)),
        );
        toast.success(t("markedSent"));
      }
    } catch {
      // Still opened WhatsApp, ignore background timestamp failure
    }
  }

  // Copy personal link
  function handleCopyLink(token: string) {
    const personalUrl = `${origin}/i/${slug}?g=${token}`;
    navigator.clipboard.writeText(personalUrl);
    toast.success(t("linkCopied"));
  }

  // Add Single Guest
  async function handleAddGuest(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);

    if (!addName.trim()) {
      setAddError(t("nameRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addGuestAction({
        invitationId,
        name: addName.trim(),
        phone: addPhone.trim() || undefined,
        headsInvited: addHeads,
        side: addSide,
        groupName: addGroup.trim() || undefined,
      });

      if (res.error) {
        if (res.error === "invalid_phone") {
          setAddError(t("invalidPhoneError"));
        } else {
          setAddError(res.error);
        }
        setIsSubmitting(false);
        return;
      }

      if (res.success && res.guestId) {
        const newGuest: GuestItem = {
          id: res.guestId,
          name: addName.trim(),
          phoneE164: addPhone ? `+${normalizeLkPhone(addPhone)}` : null,
          headsInvited: addHeads,
          groupName: addGroup.trim() || null,
          side: addSide,
          token: res.token || "new-token",
          createdAt: new Date(),
          sentAt: null,
          firstOpenedAt: null,
        };

        setGuestsList((prev) => [newGuest, ...prev]);
        toast.success(t("guestAdded"));
        setIsAddOpen(false);
        setAddName("");
        setAddPhone("");
        setAddHeads(1);
        setAddGroup("");
        router.refresh();
      }
    } catch {
      setAddError(t("genericError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Delete Guest
  async function handleDeleteGuest(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    try {
      const res = await deleteGuestAction(id);
      if (res.success) {
        setGuestsList((prev) => prev.filter((g) => g.id !== id));
        toast.success(t("guestDeleted"));
      } else {
        toast.error(t("deleteError"));
      }
    } catch {
      toast.error(t("deleteError"));
    }
  }

  // Parse CSV File
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
      if (lines.length < 2) return;

      // Expecting columns: Name, Phone, Heads, Side, Group
      const parsedRows = lines.slice(1).map((line) => {
        const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
        const name = parts[0] || "";
        const rawPhone = parts[1] || "";
        const heads = parseInt(parts[2] || "1", 10) || 1;
        const side = (parts[3]?.toLowerCase() === "bride" || parts[3]?.toLowerCase() === "groom")
          ? parts[3].toLowerCase()
          : "both";
        const group = parts[4] || "";

        const validPhone = rawPhone.length === 0 || normalizeLkPhone(rawPhone) !== null;

        return {
          name,
          phone: rawPhone,
          heads,
          side,
          group,
          validPhone,
        };
      }).filter((r) => r.name.length > 0);

      setCsvRows(parsedRows);
    };

    reader.readAsText(file);
  }

  // Submit CSV Import
  async function handleImportSubmit() {
    if (csvRows.length === 0) return;
    setIsImporting(true);

    try {
      const res = await importGuestsAction({
        invitationId,
        rows: csvRows.map((r) => ({
          name: r.name,
          phone: r.phone,
          headsInvited: r.heads,
          side: r.side as "bride" | "groom" | "both",
          groupName: r.group,
        })),
      });

      if (res.success && res.count) {
        toast.success(t("importSuccess", { count: res.count }));
        setIsCsvOpen(false);
        setCsvRows([]);
        setCsvFileName(null);
        if (res.guests) {
          const newItems: GuestItem[] = res.guests.map((g) => ({
            id: g.id,
            name: g.name,
            phoneE164: g.phoneE164,
            headsInvited: g.headsInvited,
            groupName: g.groupName,
            side: g.side,
            token: g.token,
            createdAt: g.createdAt,
            sentAt: null,
            firstOpenedAt: null,
          }));
          setGuestsList((prev) => [...newItems, ...prev]);
        }
        router.refresh();
      } else {
        toast.error(t("importError"));
      }
    } catch {
      toast.error(t("importError"));
    } finally {
      setIsImporting(false);
    }
  }

  // Download Sample CSV
  function downloadSampleCsv() {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Phone,Heads,Side,Group\n" +
      "Kasun Perera,0771234567,2,groom,Family\n" +
      "Dilani Fernando,0719876543,1,bride,Friends\n" +
      "Anura Bandara,0765551234,3,both,Work";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "guests-sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="w-full space-y-[var(--space-6)] text-left">
      {/* Metrics overview bar */}
      <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-3">
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricTotalGuests")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--ink)]">
            {totalGuests}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricTotalHeads")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--accent)]">
            {totalHeads}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricSentStatus")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--ink)]">
            {sentCount} / {totalGuests}
          </p>
        </div>
      </div>

      {/* Action button row */}
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)]">
        <div className="flex flex-wrap items-center gap-[var(--space-3)]">
          <button
            type="button"
            onClick={() => {
              setAddError(null);
              setIsAddOpen(true);
            }}
            className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] cursor-pointer"
            style={{
              backgroundColor: "var(--accent)",
              minHeight: "var(--target)",
            }}
          >
            <UserPlus className="h-4 w-4" strokeWidth={1.5} />
            <span>{t("addGuestButton")}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCsvOpen(true)}
            className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-[var(--ink)] transition-colors hover:bg-[var(--surface-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)] cursor-pointer"
            style={{ minHeight: "var(--target)" }}
          >
            <Upload className="h-4 w-4" strokeWidth={1.5} />
            <span>{t("importCsvButton")}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={downloadSampleCsv}
          className="inline-flex items-center gap-[var(--space-1)] text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)]"
          style={{ minHeight: "36px" }}
        >
          <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>{t("downloadSample")}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center gap-[var(--space-3)] rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-3)]">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-[var(--space-3)] top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-muted)]" strokeWidth={1.5} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg)] pl-9 pr-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)]"
            style={{ minHeight: "38px" }}
          />
        </div>

        <select
          value={sideFilter}
          onChange={(e) => setSideFilter(e.target.value)}
          className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] focus:outline-none"
          style={{ minHeight: "38px" }}
          aria-label={t("filterSideLabel")}
        >
          <option value="all">{t("sideAll")}</option>
          <option value="bride">{t("sideBride")}</option>
          <option value="groom">{t("sideGroom")}</option>
          <option value="both">{t("sideBoth")}</option>
        </select>

        <select
          value={deliveryFilter}
          onChange={(e) => setDeliveryFilter(e.target.value)}
          className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] focus:outline-none"
          style={{ minHeight: "38px" }}
          aria-label={t("filterDeliveryLabel")}
        >
          <option value="all">{t("deliveryAll")}</option>
          <option value="sent">{t("deliverySent")}</option>
          <option value="pending">{t("deliveryPending")}</option>
        </select>
      </div>

      {/* Guest List Content */}
      {filteredGuests.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-10)] text-center">
          <Users className="mx-auto h-8 w-8 text-[var(--ink-muted)]" strokeWidth={1.5} />
          <h3 className="mt-[var(--space-3)] font-display text-[length:var(--text-lg)] text-[var(--ink)]">
            {totalGuests === 0 ? t("noGuestsTitle") : t("noMatchingGuestsTitle")}
          </h3>
          <p className="mt-1 text-[length:var(--text-sm)] text-[var(--ink-muted)] max-w-md mx-auto">
            {totalGuests === 0 ? t("noGuestsSub") : t("noMatchingGuestsSub")}
          </p>
        </div>
      ) : (
        <div className="space-y-[var(--space-3)]">
          {filteredGuests.map((guest) => {
            const isSent = guest.sentAt !== null;

            return (
              <div
                key={guest.id}
                className="flex flex-col justify-between gap-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)] sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-[var(--space-2)]">
                    <h4 className="font-display text-[length:var(--text-base)] font-medium text-[var(--ink)]">
                      {guest.name}
                    </h4>
                    <span
                      className="rounded-[var(--radius-sm)] px-[var(--space-2)] py-[1px] text-[length:var(--text-xs)] font-medium"
                      style={{
                        backgroundColor: "var(--surface-muted)",
                        color: "var(--ink-muted)",
                        border: "1px solid var(--line)",
                      }}
                    >
                      {guest.headsInvited} {guest.headsInvited === 1 ? t("head") : t("heads")}
                    </span>
                    {guest.side && guest.side !== "both" && (
                      <span
                        className="rounded-[var(--radius-sm)] px-[var(--space-2)] py-[1px] text-[length:var(--text-xs)]"
                        style={{
                          backgroundColor: "color-mix(in oklch, var(--accent) 10%, transparent)",
                          color: "var(--accent)",
                        }}
                      >
                        {guest.side === "bride" ? t("sideBride") : t("sideGroom")}
                      </span>
                    )}
                    {guest.groupName && (
                      <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                        • {guest.groupName}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-[var(--space-3)] text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                    {guest.phoneE164 ? (
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Phone className="h-3 w-3" strokeWidth={1.5} />
                        {guest.phoneE164}
                      </span>
                    ) : (
                      <span className="italic">{t("noPhoneProvided")}</span>
                    )}

                    <span className="inline-flex items-center gap-1">
                      {isSent ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-[var(--success)]" strokeWidth={1.5} />
                          <span className="text-[var(--success)] font-medium">{t("statusSent")}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" strokeWidth={1.5} />
                          <span>{t("statusNotSent")}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-[var(--space-2)]">
                  {/* WhatsApp click-to-send */}
                  {guest.phoneE164 && (
                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(guest)}
                      className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)] cursor-pointer"
                      style={{
                        backgroundColor: "var(--accent)",
                        minHeight: "38px",
                      }}
                    >
                      <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
                      <span>{isSent ? t("sendAgain") : t("sendWhatsApp")}</span>
                    </button>
                  )}

                  {/* Copy Link */}
                  <button
                    type="button"
                    onClick={() => handleCopyLink(guest.token)}
                    title={t("copyPersonalLink")}
                    aria-label={t("copyPersonalLink")}
                    className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)] focus:outline-none"
                    style={{ minHeight: "38px" }}
                  >
                    <Copy className="h-3.5 w-3.5 text-[var(--ink-muted)]" strokeWidth={1.5} />
                    <span className="hidden sm:inline">{t("copyLink")}</span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeleteGuest(guest.id)}
                    title={t("deleteGuest")}
                    aria-label={t("deleteGuest")}
                    className="rounded-[var(--radius-md)] p-[var(--space-2)] text-[var(--danger)] hover:bg-[var(--surface-muted)] focus:outline-none"
                    style={{ minHeight: "38px", minWidth: "38px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD GUEST MODAL / OVERLAY */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[var(--space-4)]">
          <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-6)] shadow-xl text-left">
            <div className="flex items-center justify-between mb-[var(--space-4)]">
              <h3 className="font-display text-[length:var(--text-xl)] text-[var(--ink)]">
                {t("addModalTitle")}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-[var(--ink-muted)] hover:text-[var(--ink)]"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {addError && (
              <div
                role="alert"
                className="mb-[var(--space-4)] rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-[var(--danger)]"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--danger) 12%, transparent)",
                  border: "1px solid var(--danger)",
                }}
              >
                {addError}
              </div>
            )}

            <form onSubmit={handleAddGuest} className="space-y-[var(--space-4)]">
              <div>
                <label
                  htmlFor="add-name"
                  className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                >
                  {t("formNameLabel")} *
                </label>
                <input
                  id="add-name"
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Mr. & Mrs. Silva"
                  className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                  style={{ minHeight: "var(--target)" }}
                />
              </div>

              <div>
                <label
                  htmlFor="add-phone"
                  className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                >
                  {t("formPhoneLabel")}
                </label>
                <input
                  id="add-phone"
                  type="tel"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  placeholder="077 123 4567"
                  className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                  style={{ minHeight: "var(--target)" }}
                />
                <p className="mt-1 text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                  {t("phoneHint")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-[var(--space-3)]">
                <div>
                  <label
                    htmlFor="add-heads"
                    className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                  >
                    {t("formHeadsLabel")}
                  </label>
                  <input
                    id="add-heads"
                    type="number"
                    min={1}
                    max={20}
                    value={addHeads}
                    onChange={(e) => setAddHeads(parseInt(e.target.value, 10) || 1)}
                    className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                    style={{ minHeight: "var(--target)" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="add-side"
                    className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                  >
                    {t("formSideLabel")}
                  </label>
                  <select
                    id="add-side"
                    value={addSide}
                    onChange={(e) => setAddSide(e.target.value as "bride" | "groom" | "both")}
                    className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                    style={{ minHeight: "var(--target)" }}
                  >
                    <option value="both">{t("sideBoth")}</option>
                    <option value="bride">{t("sideBride")}</option>
                    <option value="groom">{t("sideGroom")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="add-group"
                  className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                >
                  {t("formGroupLabel")}
                </label>
                <input
                  id="add-group"
                  type="text"
                  value={addGroup}
                  onChange={(e) => setAddGroup(e.target.value)}
                  placeholder="e.g. Relatives, Office Friends"
                  className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                  style={{ minHeight: "var(--target)" }}
                />
              </div>

              <div className="flex justify-end gap-[var(--space-2)] pt-[var(--space-4)]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-[var(--radius-md)] border border-[var(--line)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)] cursor-pointer"
                  style={{ minHeight: "var(--target)" }}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--accent)",
                    minHeight: "var(--target)",
                  }}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                  ) : (
                    <span>{t("saveGuest")}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL */}
      {isCsvOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[var(--space-4)]">
          <div className="w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-6)] shadow-xl text-left max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-[var(--space-4)]">
              <h3 className="font-display text-[length:var(--text-xl)] text-[var(--ink)]">
                {t("importModalTitle")}
              </h3>
              <button
                type="button"
                onClick={() => setIsCsvOpen(false)}
                className="text-[var(--ink-muted)] hover:text-[var(--ink)]"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)] mb-[var(--space-4)]">
              {t("importModalSub")}
            </p>

            <div className="mb-[var(--space-4)]">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-[length:var(--text-xs)] text-[var(--ink)] file:mr-4 file:py-2 file:px-4 file:rounded-[var(--radius-md)] file:border-0 file:text-[length:var(--text-xs)] file:font-medium file:bg-[var(--surface-muted)] file:text-[var(--ink)] hover:file:bg-[var(--line)] cursor-pointer"
              />
              {csvFileName && (
                <p className="mt-1 text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                  {csvFileName}
                </p>
              )}
            </div>

            {csvRows.length > 0 && (
              <div className="flex-1 overflow-y-auto border border-[var(--line)] rounded-[var(--radius-md)] p-[var(--space-3)] mb-[var(--space-4)]">
                <p className="text-[length:var(--text-xs)] font-medium text-[var(--ink)] mb-2">
                  {t("previewRowsCount", { count: csvRows.length })}
                </p>
                <div className="space-y-1">
                  {csvRows.slice(0, 5).map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[length:var(--text-xs)] border-b border-[var(--line)] py-1"
                    >
                      <span className="font-medium text-[var(--ink)]">{row.name}</span>
                      <span className="text-[var(--ink-muted)]">
                        {row.phone || t("noPhoneShort")} • {row.heads} {t("headsShort")}
                      </span>
                    </div>
                  ))}
                  {csvRows.length > 5 && (
                    <p className="text-[length:var(--text-xs)] italic text-[var(--ink-muted)] pt-1">
                      {t("moreRowsIndicator", { count: csvRows.length - 5 })}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-[var(--space-2)] pt-[var(--space-2)]">
              <button
                type="button"
                onClick={() => setIsCsvOpen(false)}
                className="rounded-[var(--radius-md)] border border-[var(--line)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)] cursor-pointer"
                style={{ minHeight: "var(--target)" }}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                disabled={csvRows.length === 0 || isImporting}
                onClick={handleImportSubmit}
                className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor: "var(--accent)",
                  minHeight: "var(--target)",
                }}
              >
                {isImporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                ) : (
                  <span>{t("confirmImport", { count: csvRows.length })}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
