-- Hub themes, per-hub campaign visibility, and click counters for Support / links.

ALTER TABLE "organizers"
    ADD COLUMN IF NOT EXISTS "hub_theme" text DEFAULT 'default',
    ADD COLUMN IF NOT EXISTS "hub_hidden_campaign_ids" jsonb DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS "support_click_count" integer DEFAULT 0;

ALTER TABLE "organizer_hub_links"
    ADD COLUMN IF NOT EXISTS "click_count" integer DEFAULT 0;
