"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  createTableAction,
  deleteTableAction,
  assignGuestToTableAction,
  unassignGuestAction,
  togglePublishSeatingAction,
} from "@/app/actions/seating";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Users,
  Eye,
  EyeOff,
  Download,
  Loader2,
  X,
  UserCheck,
  UserMinus,
  CheckCircle2,
  QrCode,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface SeatingTableItem {
  id: string;
  label: string;
  capacity: number;
  x: number;
  y: number;
  published: boolean;
}

export interface SeatingGuestItem {
  id: string;
  name: string;
  headsInvited: number;
  side: string | null;
  groupName: string | null;
  rsvpStatus: string | null;
  tableId: string | null;
}

interface SeatingCanvasManagerProps {
  invitationId: string;
  slug: string;
  initialTables: SeatingTableItem[];
  initialGuests: SeatingGuestItem[];
  locale: string;
}

export function SeatingCanvasManager({
  invitationId,
  slug,
  initialTables,
  initialGuests,
}: SeatingCanvasManagerProps) {
  const t = useTranslations("seating");
  const router = useRouter();

  const [tables, setTables] = useState<SeatingTableItem[]>(initialTables);
  const [guestsList, setGuestsList] = useState<SeatingGuestItem[]>(initialGuests);

  const [isPublished, setIsPublished] = useState<boolean>(
    initialTables.length > 0 ? initialTables.some((tbl) => tbl.published) : false,
  );

  // Add Table Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [tableName, setTableName] = useState("");
  const [tableCapacity, setTableCapacity] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);

  // Metrics
  const totalTables = tables.length;
  const totalCapacity = tables.reduce((acc, tbl) => acc + tbl.capacity, 0);

  const seatedGuests = guestsList.filter((g) => g.tableId !== null);
  const unseatedGuests = guestsList.filter((g) => g.tableId === null);

  const assignedHeads = seatedGuests.reduce((acc, g) => acc + (g.headsInvited || 1), 0);
  const unassignedHeads = unseatedGuests.reduce((acc, g) => acc + (g.headsInvited || 1), 0);

  // Add Table Submit
  async function handleAddTable(e: React.FormEvent) {
    e.preventDefault();
    if (!tableName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await createTableAction({
        invitationId,
        label: tableName.trim(),
        capacity: tableCapacity,
      });

      if (res.error) {
        toast.error(res.error);
        return;
      }

      if (res.success && res.table) {
        setTables((prev) => [...prev, res.table as SeatingTableItem]);
        toast.success(t("tableAdded"));
        setIsAddOpen(false);
        setTableName("");
        setTableCapacity(10);
        router.refresh();
      }
    } catch {
      toast.error(t("genericError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Delete Table
  async function handleDeleteTable(tableId: string) {
    if (!confirm(t("confirmDeleteTable"))) return;

    try {
      const res = await deleteTableAction(tableId);
      if (res.success) {
        setTables((prev) => prev.filter((tbl) => tbl.id !== tableId));
        setGuestsList((prev) =>
          prev.map((g) => (g.tableId === tableId ? { ...g, tableId: null } : g)),
        );
        toast.success(t("tableDeleted"));
        router.refresh();
      }
    } catch {
      toast.error(t("genericError"));
    }
  }

  // Assign Guest to Table
  async function handleAssignGuest(guestId: string, tableId: string) {
    if (!tableId) return;

    try {
      const res = await assignGuestToTableAction(guestId, tableId);
      if (res.success) {
        setGuestsList((prev) =>
          prev.map((g) => (g.id === guestId ? { ...g, tableId } : g)),
        );
        toast.success(t("guestAssigned"));
        router.refresh();
      }
    } catch {
      toast.error(t("genericError"));
    }
  }

  // Remove Guest from Table
  async function handleUnassignGuest(guestId: string) {
    try {
      const res = await unassignGuestAction(guestId);
      if (res.success) {
        setGuestsList((prev) =>
          prev.map((g) => (g.id === guestId ? { ...g, tableId: null } : g)),
        );
        toast.success(t("guestUnassigned"));
        router.refresh();
      }
    } catch {
      toast.error(t("genericError"));
    }
  }

  // Toggle Publish Seating Plan
  async function handleTogglePublish() {
    setIsTogglingPublish(true);
    const newPublished = !isPublished;
    try {
      const res = await togglePublishSeatingAction(invitationId, newPublished);
      if (res.success) {
        setIsPublished(newPublished);
        setTables((prev) => prev.map((tbl) => ({ ...tbl, published: newPublished })));
        toast.success(t("seatingPublishUpdated"));
        router.refresh();
      }
    } catch {
      toast.error(t("genericError"));
    } finally {
      setIsTogglingPublish(false);
    }
  }

  // Export Seating Chart CSV
  function handleExportCsv() {
    const headers = [
      "Table",
      "Table Capacity",
      "Guest Name",
      "Side",
      "Group",
      "Heads",
      "RSVP Status",
    ];

    const rows: string[][] = [];

    tables.forEach((tbl) => {
      const tableGuests = guestsList.filter((g) => g.tableId === tbl.id);
      if (tableGuests.length === 0) {
        rows.push([`"${tbl.label}"`, String(tbl.capacity), "(Empty)", "", "", "0", ""]);
      } else {
        tableGuests.forEach((g) => {
          rows.push([
            `"${tbl.label}"`,
            String(tbl.capacity),
            `"${g.name.replace(/"/g, '""')}"`,
            g.side || "both",
            g.groupName || "",
            String(g.headsInvited),
            g.rsvpStatus || "pending",
          ]);
        });
      }
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `seating-chart-${slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="w-full space-y-[var(--space-6)] text-left">
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-[var(--space-3)] sm:grid-cols-4">
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricTotalTables")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--ink)]">
            {totalTables}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricAssignedHeads")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--accent)]">
            {assignedHeads}
            <span className="text-[length:var(--text-xs)] font-normal text-[var(--ink-muted)] ml-1">
              / {totalCapacity} seats
            </span>
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricUnassignedHeads")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--ink)]">
            {unassignedHeads}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricTotalCapacity")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--ink)]">
            {totalCapacity}
          </p>
        </div>
      </div>

      {/* Visibility Status Notice */}
      <div
        className="rounded-[var(--radius-md)] border p-[var(--space-3)] flex items-center justify-between gap-[var(--space-2)] text-[length:var(--text-xs)]"
        style={{
          borderColor: isPublished
            ? "color-mix(in oklch, var(--success) 30%, transparent)"
            : "var(--line)",
          backgroundColor: isPublished
            ? "color-mix(in oklch, var(--success) 6%, var(--surface))"
            : "var(--surface-muted)",
        }}
      >
        <div className="flex items-center gap-2">
          {isPublished ? (
            <Eye className="h-4 w-4 text-[var(--success)]" strokeWidth={1.5} />
          ) : (
            <EyeOff className="h-4 w-4 text-[var(--ink-muted)]" strokeWidth={1.5} />
          )}
          <span className={isPublished ? "text-[var(--ink)] font-medium" : "text-[var(--ink-muted)]"}>
            {isPublished ? t("seatingPublishedNotice") : t("seatingPrivateNotice")}
          </span>
        </div>

        <button
          type="button"
          disabled={isTogglingPublish}
          onClick={handleTogglePublish}
          className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border px-[var(--space-3)] py-1 font-medium transition-colors cursor-pointer"
          style={{
            borderColor: "var(--line)",
            backgroundColor: "var(--surface)",
            color: isPublished ? "var(--accent)" : "var(--ink)",
            minHeight: "32px",
          }}
        >
          {isTogglingPublish ? (
            <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1.5} />
          ) : isPublished ? (
            <span>{t("unpublishSeatingButton")}</span>
          ) : (
            <span>{t("publishSeatingButton")}</span>
          )}
        </button>
      </div>

      {/* Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)]">
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none cursor-pointer"
          style={{
            backgroundColor: "var(--accent)",
            minHeight: "var(--target)",
          }}
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          <span>{t("addTableButton")}</span>
        </button>

        <div className="flex flex-wrap items-center gap-[var(--space-2)]">
          <Link
            href={`/app/invitations/${invitationId}/entrance`}
            className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)] focus:outline-none"
            style={{ minHeight: "38px" }}
          >
            <QrCode className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.5} />
            <span>{t("entranceSignButton")}</span>
          </Link>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={tables.length === 0}
            className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)] cursor-pointer disabled:opacity-50"
            style={{ minHeight: "38px" }}
          >
            <Download className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.5} />
            <span>{t("exportSeatingCsv")}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Unseated Pool + Banquet Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-6)] items-start">
        {/* Unseated Guests Panel (1 Column) */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)] text-left space-y-[var(--space-3)]">
          <div className="border-b border-[var(--line)] pb-[var(--space-3)]">
            <h3 className="font-display text-[length:var(--text-base)] font-semibold text-[var(--ink)]">
              {t("unassignedGuestsTitle", { count: unseatedGuests.length })}
            </h3>
            <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)] mt-0.5">
              {t("unassignedGuestsSub")}
            </p>
          </div>

          {unseatedGuests.length === 0 ? (
            <div className="p-[var(--space-6)] text-center text-[length:var(--text-xs)] text-[var(--ink-muted)]">
              <CheckCircle2 className="mx-auto h-6 w-6 text-[var(--success)] mb-1" strokeWidth={1.5} />
              <p>All guests have been seated at banquet tables!</p>
            </div>
          ) : (
            <div className="space-y-[var(--space-2)] max-h-[500px] overflow-y-auto pr-1">
              {unseatedGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg)] p-[var(--space-3)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display text-[length:var(--text-sm)] font-medium text-[var(--ink)]">
                        {guest.name}
                      </p>
                      <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                        {guest.headsInvited} {guest.headsInvited === 1 ? "seat" : "seats"}
                        {guest.side && guest.side !== "both" ? ` • ${guest.side}` : ""}
                      </p>
                    </div>
                  </div>

                  {tables.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 border-t border-[var(--line)]">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignGuest(guest.id, e.target.value);
                          }
                        }}
                        className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-2)] py-1 text-[length:var(--text-xs)] font-medium text-[var(--ink)] focus:outline-none"
                        style={{ minHeight: "34px" }}
                        aria-label={t("dragOrSelectPrompt")}
                      >
                        <option value="" disabled>
                          {t("dragOrSelectPrompt")}…
                        </option>
                        {tables.map((tbl) => {
                          const currentHeads = guestsList
                            .filter((g) => g.tableId === tbl.id)
                            .reduce((acc, g) => acc + g.headsInvited, 0);
                          const isFull = currentHeads >= tbl.capacity;

                          return (
                            <option
                              key={tbl.id}
                              value={tbl.id}
                              disabled={isFull}
                            >
                              {tbl.label} ({currentHeads}/{tbl.capacity})
                              {isFull ? " - Full" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Banquet Tables Grid (2 Columns) */}
        <div className="lg:col-span-2 space-y-[var(--space-4)]">
          {tables.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-10)] text-center">
              <Users className="mx-auto h-8 w-8 text-[var(--ink-muted)]" strokeWidth={1.5} />
              <h3 className="mt-[var(--space-3)] font-display text-[length:var(--text-lg)] text-[var(--ink)]">
                No banquet tables created yet
              </h3>
              <p className="mt-1 text-[length:var(--text-sm)] text-[var(--ink-muted)] max-w-md mx-auto">
                Add tables (e.g. Table 1, Table 2, VIP Table) to begin seating your wedding guests.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-4)]">
              {tables.map((table) => {
                const tableGuests = guestsList.filter((g) => g.tableId === table.id);
                const tableHeads = tableGuests.reduce(
                  (acc, g) => acc + (g.headsInvited || 1),
                  0,
                );
                const isFull = tableHeads >= table.capacity;
                const fillPercent = Math.min(100, Math.round((tableHeads / table.capacity) * 100));

                return (
                  <div
                    key={table.id}
                    className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)] flex flex-col justify-between space-y-[var(--space-4)] text-left shadow-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-[var(--space-2)]">
                        <div>
                          <h4 className="font-display text-[length:var(--text-base)] font-semibold text-[var(--ink)]">
                            {table.label}
                          </h4>
                          <span
                            className="text-[length:var(--text-xs)] font-medium inline-block mt-0.5"
                            style={{
                              color: isFull ? "var(--accent)" : "var(--ink-muted)",
                            }}
                          >
                            {tableHeads} / {table.capacity} seats ({fillPercent}%)
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteTable(table.id)}
                          className="text-[var(--danger)] hover:bg-[var(--surface-muted)] p-1 rounded-[var(--radius-sm)] focus:outline-none"
                          title={t("deleteTable")}
                          aria-label={t("deleteTable")}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Occupancy bar */}
                      <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--line)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${fillPercent}%`,
                            backgroundColor: isFull ? "var(--success)" : "var(--accent)",
                          }}
                        />
                      </div>

                      {/* Seated Guests List */}
                      <div className="mt-[var(--space-4)] space-y-[var(--space-2)]">
                        {tableGuests.length === 0 ? (
                          <p className="text-[length:var(--text-xs)] italic text-[var(--ink-muted)] py-2">
                            {t("tableEmpty")}
                          </p>
                        ) : (
                          tableGuests.map((guest) => (
                            <div
                              key={guest.id}
                              className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg)] px-[var(--space-3)] py-1.5 text-[length:var(--text-xs)]"
                            >
                              <div className="flex items-center gap-1.5">
                                <UserCheck className="h-3 w-3 text-[var(--accent)]" strokeWidth={1.5} />
                                <span className="font-medium text-[var(--ink)]">
                                  {guest.name}
                                </span>
                                <span className="text-[var(--ink-muted)]">
                                  ({guest.headsInvited})
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleUnassignGuest(guest.id)}
                                className="text-[var(--ink-muted)] hover:text-[var(--danger)] p-0.5 focus:outline-none"
                                title={t("unassignButton")}
                                aria-label={t("unassignButton")}
                              >
                                <UserMinus className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ADD TABLE MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[var(--space-4)]">
          <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-6)] shadow-xl text-left">
            <div className="flex items-center justify-between mb-[var(--space-4)]">
              <h3 className="font-display text-[length:var(--text-xl)] text-[var(--ink)]">
                {t("tableModalTitle")}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-[var(--ink-muted)] hover:text-[var(--ink)]"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleAddTable} className="space-y-[var(--space-4)]">
              <div>
                <label
                  htmlFor="table-label"
                  className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                >
                  {t("tableNameLabel")} *
                </label>
                <input
                  id="table-label"
                  type="text"
                  required
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  placeholder={t("tableNamePlaceholder")}
                  className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                  style={{ minHeight: "var(--target)" }}
                />
              </div>

              <div>
                <label
                  htmlFor="table-cap"
                  className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                >
                  {t("tableCapacityInput")}
                </label>
                <input
                  id="table-cap"
                  type="number"
                  min={1}
                  max={30}
                  value={tableCapacity}
                  onChange={(e) => setTableCapacity(parseInt(e.target.value, 10) || 10)}
                  className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                  style={{ minHeight: "var(--target)" }}
                />
              </div>

              <div className="flex justify-end gap-[var(--space-2)] pt-[var(--space-2)]">
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
                    <span>{t("saveTableButton")}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
