-- Hash campaign owner tokens at rest; short-lived manage sessions after k= verify.
-- Dual-read: existing plaintext owner_token rows keep working until backfilled.
-- Hash backfill is done lazily on successful manage access (see lib/ownerToken.ts)
-- so we do not depend on pgcrypto being enabled.

ALTER TABLE "campaigns"
    ADD COLUMN IF NOT EXISTS "owner_token_hash" text;

CREATE INDEX IF NOT EXISTS "idx_campaigns_owner_token_hash"
    ON "campaigns" USING btree ("owner_token_hash");

CREATE TABLE IF NOT EXISTS "campaign_manage_sessions" (
    "token_hash" text PRIMARY KEY NOT NULL,
    "campaign_id" uuid NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "expires_at" timestamp with time zone NOT NULL,
    CONSTRAINT "campaign_manage_sessions_campaign_id_fkey"
        FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_manage_sessions_campaign"
    ON "campaign_manage_sessions" USING btree ("campaign_id");

CREATE INDEX IF NOT EXISTS "idx_manage_sessions_expires"
    ON "campaign_manage_sessions" USING btree ("expires_at");

-- Organizers can register interest in paid hub upgrades without billing yet.
ALTER TABLE "organizers"
    ADD COLUMN IF NOT EXISTS "upgrade_interested_at" timestamp with time zone;
