-- Where supporters save from (Vercel geo). first_supporter_country is set once
-- when supporter_count goes from 0 to 1 so we can measure time-to-first by market.

ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "first_supporter_country" text;
--> statement-breakpoint
ALTER TABLE "campaign_uses" ADD COLUMN IF NOT EXISTS "supporter_country" text;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_campaigns_first_supporter_country" ON "campaigns" USING btree ("first_supporter_country");
