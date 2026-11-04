import {
  pgTable, pgEnum, uuid, text, integer, timestamp, jsonb, boolean, uniqueIndex, index,
} from "drizzle-orm/pg-core";

export const invitationStatus = pgEnum("invitation_status", ["draft", "published", "archived"]);
export const rsvpStatus = pgEnum("rsvp_status", ["pending", "accepted", "declined"]);
export const orderStatus = pgEnum("order_status", ["pending", "paid", "failed", "refunded"]);
export const moderationStatus = pgEnum("moderation_status", ["pending", "approved", "rejected"]);
export const planTier = pgEnum("plan_tier", ["essential", "complete", "signature"]);

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () => timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();

// Better Auth user table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  locale: text("locale").notNull().default("si"),
  isTeam: boolean("is_team").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// Better Auth session table
export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

// Better Auth account table (passwords & future OAuth providers)
export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("accounts_user_id_idx").on(table.userId)],
);

// Better Auth verification table (email verification, password reset)
export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    templateSlug: text("template_slug").notNull(),
    status: invitationStatus("status").notNull().default("draft"),
    defaultLocale: text("default_locale").notNull().default("si"),
    eventDate: timestamp("event_date", { withTimezone: true }),
    // Versioned JSON validated by Zod: sections, copy, theme overrides.
    content: jsonb("content").notNull().default({}),
    theme: jsonb("theme").notNull().default({}),
    schemaVersion: integer("schema_version").notNull().default(1),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("invitations_slug_uq").on(t.slug), index("invitations_owner_idx").on(t.ownerId)],
);

export const invitationEvents = pgTable(
  "invitation_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invitationId: uuid("invitation_id").notNull().references(() => invitations.id, { onDelete: "cascade" }),
    title: text("title").notNull(), // Poruwa, Church, Reception, Homecoming
    startsAt: timestamp("starts_at", { withTimezone: true }),
    venue: text("venue"),
    mapUrl: text("map_url"),
    notes: text("notes"),
    sort: integer("sort").notNull().default(0),
  },
  (t) => [index("events_invitation_idx").on(t.invitationId)],
);

export const guests = pgTable(
  "guests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invitationId: uuid("invitation_id").notNull().references(() => invitations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phoneE164: text("phone_e164"), // nullable: some guests have no WhatsApp
    headsInvited: integer("heads_invited").notNull().default(1),
    groupName: text("group_name"),
    side: text("side"), // bride | groom | both
    addressAs: text("address_as"), // "you", "your family", ...
    // 128-bit random, base64url. Never derived from the name. Never log it.
    token: text("token").notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("guests_token_uq").on(t.token), index("guests_invitation_idx").on(t.invitationId)],
);

export const guestEvents = pgTable(
  "guest_events",
  {
    guestId: uuid("guest_id").notNull().references(() => guests.id, { onDelete: "cascade" }),
    eventId: uuid("event_id").notNull().references(() => invitationEvents.id, { onDelete: "cascade" }),
  },
  (t) => [uniqueIndex("guest_events_uq").on(t.guestId, t.eventId)],
);

export const rsvps = pgTable(
  "rsvps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    guestId: uuid("guest_id").notNull().references(() => guests.id, { onDelete: "cascade" }),
    eventId: uuid("event_id").notNull().references(() => invitationEvents.id, { onDelete: "cascade" }),
    status: rsvpStatus("status").notNull().default("pending"),
    headsAttending: integer("heads_attending"),
    message: text("message"),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("rsvps_guest_event_uq").on(t.guestId, t.eventId)],
);

export const deliveries = pgTable("deliveries", {
  id: uuid("id").defaultRandom().primaryKey(),
  guestId: uuid("guest_id").notNull().references(() => guests.id, { onDelete: "cascade" }),
  channel: text("channel").notNull().default("whatsapp"),
  sentAt: timestamp("sent_at", { withTimezone: true }), // set when the couple taps Send
  firstOpenedAt: timestamp("first_opened_at", { withTimezone: true }), // set on first token load
  reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true }),
  reminderCount: integer("reminder_count").notNull().default(0),
});

export const seatingTables = pgTable("seating_tables", {
  id: uuid("id").defaultRandom().primaryKey(),
  invitationId: uuid("invitation_id").notNull().references(() => invitations.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  capacity: integer("capacity").notNull().default(10),
  x: integer("x").notNull().default(0),
  y: integer("y").notNull().default(0),
  published: boolean("published").notNull().default(false),
});

export const seatAssignments = pgTable(
  "seat_assignments",
  {
    guestId: uuid("guest_id").notNull().references(() => guests.id, { onDelete: "cascade" }),
    tableId: uuid("table_id").notNull().references(() => seatingTables.id, { onDelete: "cascade" }),
  },
  (t) => [uniqueIndex("seat_guest_uq").on(t.guestId)],
);

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  invitationId: uuid("invitation_id").notNull().references(() => invitations.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(), // couple | guest
  storageKey: text("storage_key").notNull(),
  moderation: moderationStatus("moderation").notNull().default("pending"),
  createdAt: createdAt(),
});

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    invitationId: uuid("invitation_id").references(() => invitations.id),
    plan: planTier("plan").notNull(),
    amountLkr: integer("amount_lkr").notNull(),
    gatewayRef: text("gateway_ref"), // used for webhook idempotency
    status: orderStatus("status").notNull().default("pending"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("orders_gateway_ref_uq").on(t.gatewayRef)],
);

export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: text("actor_id").references(() => users.id),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
});

export const customDesignRequests = pgTable(
  "custom_design_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invitationId: uuid("invitation_id").notNull().references(() => invitations.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    requestType: text("request_type").notNull(), // nakath_calligraphy | poruwa_motif | family_crest | music_audio | full_bespoke
    title: text("title").notNull(),
    description: text("description").notNull(),
    contactWhatsapp: text("contact_whatsapp").notNull(),
    attachmentUrl: text("attachment_url"),
    status: text("status").notNull().default("pending"), // pending | in_review | completed | declined
    adminNotes: text("admin_notes"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("custom_design_invitation_idx").on(t.invitationId),
    index("custom_design_user_idx").on(t.userId),
  ],
);

