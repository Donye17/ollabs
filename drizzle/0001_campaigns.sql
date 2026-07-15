-- Phase 2: campaign primitive.
-- A campaign is a frame an organizer publishes at a shareable /c/<slug> link.
-- campaign_uses records each supporter who applies the frame (powers the counter).

CREATE TABLE IF NOT EXISTS "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"frame_config" jsonb NOT NULL,
	"creator_id" text,
	"creator_name" text DEFAULT 'Anonymous',
	"supporter_count" integer DEFAULT 0,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "campaigns_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_campaigns_slug" ON "campaigns" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_campaigns_created_at" ON "campaigns" USING btree ("created_at" DESC);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "campaign_uses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"user_id" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "campaign_uses_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_campaign_uses_campaign_id" ON "campaign_uses" USING btree ("campaign_id");
