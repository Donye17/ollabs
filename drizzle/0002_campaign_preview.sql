-- Add a stored preview image URL to campaigns (used as the Open Graph share image).
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "preview_url" text;
