-- Organizer hubs: Linktree-style /u/[handle] pages.
--
-- Create stays anonymous. A handle is only claimable after optional login, so
-- the hub has a stable owner. /c/[slug] remains the frame tool; the hub is the
-- campaign directory (bio, Support CTA → /c, plus other links).

ALTER TABLE "organizers"
    ADD COLUMN IF NOT EXISTS "handle" text,
    ADD COLUMN IF NOT EXISTS "display_name" text,
    ADD COLUMN IF NOT EXISTS "bio" text,
    ADD COLUMN IF NOT EXISTS "avatar_url" text,
    ADD COLUMN IF NOT EXISTS "featured_campaign_id" uuid,
    ADD COLUMN IF NOT EXISTS "hub_updated_at" timestamp with time zone;
--> statement-breakpoint

-- Partial unique: many organizers will never claim a hub.
CREATE UNIQUE INDEX IF NOT EXISTS "idx_organizers_handle"
    ON "organizers" USING btree ("handle")
    WHERE "handle" IS NOT NULL;
--> statement-breakpoint

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'organizers_featured_campaign_id_fkey'
    ) THEN
        ALTER TABLE "organizers"
            ADD CONSTRAINT "organizers_featured_campaign_id_fkey"
            FOREIGN KEY ("featured_campaign_id")
            REFERENCES "campaigns"("id")
            ON DELETE SET NULL;
    END IF;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "organizer_hub_links" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "organizer_id" uuid NOT NULL,
    "title" text NOT NULL,
    "url" text NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "organizer_hub_links_organizer_id_fkey"
        FOREIGN KEY ("organizer_id") REFERENCES "organizers"("id") ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_hub_links_organizer"
    ON "organizer_hub_links" USING btree ("organizer_id", "sort_order");
