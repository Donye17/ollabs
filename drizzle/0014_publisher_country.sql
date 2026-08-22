-- Country where the organizer was when they published (Vercel geo header).
-- Nullable: local dev and some proxies do not send a country code.

ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "publisher_country" text;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_campaigns_publisher_country" ON "campaigns" USING btree ("publisher_country");
