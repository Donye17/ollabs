-- Reporting + moderation.
-- is_hidden: when true, a campaign is removed from all public surfaces (home, explore, its own page, sitemap).
-- campaign_reports: one row per report submitted from a supporter page.

ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "is_hidden" boolean DEFAULT false;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "campaign_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"reason" text,
	"reporter_ip" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "campaign_reports_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_campaign_reports_campaign_id" ON "campaign_reports" USING btree ("campaign_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_campaign_reports_created_at" ON "campaign_reports" USING btree ("created_at" DESC);
