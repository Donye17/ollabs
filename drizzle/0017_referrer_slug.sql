-- Keep the campaign-to-campaign creation path measurable without coupling it
-- to analytics cookies. The value is optional because most campaigns begin
-- from the home page, a locale landing, or a calendar page.
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "referrer_slug" text;

CREATE INDEX IF NOT EXISTS "idx_campaigns_referrer_slug"
ON "campaigns" USING btree ("referrer_slug");
