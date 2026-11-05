CREATE TYPE "public"."quote_status" AS ENUM('new', 'replied', 'closed');--> statement-breakpoint
CREATE TYPE "public"."vendor_category" AS ENUM('venue', 'photographer', 'decor', 'salon', 'car');--> statement-breakpoint
CREATE TABLE "custom_design_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"request_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"contact_whatsapp" text NOT NULL,
	"attachment_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quote_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"event_date" text,
	"guest_count" integer,
	"budget_lkr" integer,
	"message" text DEFAULT '' NOT NULL,
	"status" "quote_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"name" text NOT NULL,
	"price_lkr" integer NOT NULL,
	"includes" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" "vendor_category" NOT NULL,
	"city" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"whatsapp" text,
	"price_from_lkr" integer,
	"verified" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "reminder_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "reminder_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_design_requests" ADD CONSTRAINT "custom_design_requests_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_design_requests" ADD CONSTRAINT "custom_design_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_packages" ADD CONSTRAINT "vendor_packages_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "custom_design_invitation_idx" ON "custom_design_requests" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "custom_design_user_idx" ON "custom_design_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quote_requests_vendor_idx" ON "quote_requests" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "vendor_packages_vendor_idx" ON "vendor_packages" USING btree ("vendor_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vendors_slug_uq" ON "vendors" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "vendors_category_city_idx" ON "vendors" USING btree ("category","city");