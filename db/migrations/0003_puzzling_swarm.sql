ALTER TYPE "public"."vendor_category" ADD VALUE 'dj';--> statement-breakpoint
ALTER TYPE "public"."vendor_category" ADD VALUE 'astrologer';--> statement-breakpoint
ALTER TYPE "public"."vendor_category" ADD VALUE 'ashtaka';--> statement-breakpoint
ALTER TYPE "public"."vendor_category" ADD VALUE 'fragrance';--> statement-breakpoint
CREATE TABLE "vendor_blocked_dates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"date" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "published" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "vendor_blocked_dates" ADD CONSTRAINT "vendor_blocked_dates_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "vendor_blocked_dates_uq" ON "vendor_blocked_dates" USING btree ("vendor_id","date");