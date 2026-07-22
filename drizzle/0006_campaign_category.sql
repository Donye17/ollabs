-- Optional category for a campaign, used to filter the Explore page.
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "category" text;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_campaigns_category" ON "campaigns" USING btree ("category");
