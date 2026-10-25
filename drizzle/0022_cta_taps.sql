-- Count of "Make your own frame" taps on the post-save screen.
-- Free for every campaign. Nothing reads this to lock a feature.

ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "cta_taps" integer DEFAULT 0;
