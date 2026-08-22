-- Old /c/[slug] links must keep working after an organizer renames their
-- custom URL. Without this, every WhatsApp share of the previous slug dies
-- the moment they edit it on the manage page — which is exactly when they
-- are most likely to change it.

CREATE TABLE IF NOT EXISTS "campaign_slug_redirects" (
    "old_slug" text PRIMARY KEY NOT NULL,
    "campaign_id" uuid NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "campaign_slug_redirects_campaign_id_fkey"
        FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_slug_redirects_campaign"
    ON "campaign_slug_redirects" USING btree ("campaign_id");
