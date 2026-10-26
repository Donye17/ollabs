-- Free hub numbers and branding. Nothing here locks a feature.

ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "share_count" integer DEFAULT 0;
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "referrer_counts" jsonb DEFAULT '{}'::jsonb;
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "accent_color" text;
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "logo_url" text;
