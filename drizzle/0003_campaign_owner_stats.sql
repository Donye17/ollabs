-- Owner controls + real analytics for campaigns.
-- owner_token: a private key returned to the creator so they can manage the campaign without an account.
-- view_count: real count of supporter-page views (incremented by a client beacon, deduped per browser session).

ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "owner_token" text;
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "view_count" integer DEFAULT 0;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_campaigns_owner_token" ON "campaigns" USING btree ("owner_token");
