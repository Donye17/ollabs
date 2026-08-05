-- Organizer email + campaign recovery.
--
-- Campaigns stay anonymous to create. Email is entirely optional and exists for
-- one reason: before this, the only route back to a campaign was a URL holding
-- the owner_token. Clear your browser or switch devices and the campaign was
-- unreachable forever, which matters because organizer retention is the whole
-- business model.

ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "organizer_email" text;
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "email_sent_at" timestamp with time zone;
--> statement-breakpoint
-- Highest supporter milestone already emailed about, so we never send twice.
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "milestone_notified" integer DEFAULT 0;
--> statement-breakpoint
-- Stored lowercased; this index backs the recovery lookup.
CREATE INDEX IF NOT EXISTS "idx_campaigns_organizer_email" ON "campaigns" USING btree ("organizer_email");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "campaign_recovery_tokens" (
    "token" text PRIMARY KEY NOT NULL,
    "email" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "expires_at" timestamp with time zone NOT NULL,
    "used_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_recovery_tokens_email" ON "campaign_recovery_tokens" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_recovery_tokens_expires" ON "campaign_recovery_tokens" USING btree ("expires_at");
