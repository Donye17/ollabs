-- Attribute a campaign to the awareness day it was started from.
--
-- Until now a day page listed campaigns by category, which is only an
-- approximation: the s'mores page was showing St Patrick's Day frames because
-- both are category 'event'. This records the actual day a campaign came from.
--
-- It also gives the first real referral signal. A campaign with a day_slug came
-- from a day page, so the ratio of those to day page views is the conversion
-- number the growth loop has been missing.

ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "day_slug" text;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_campaigns_day_slug" ON "campaigns" USING btree ("day_slug");
