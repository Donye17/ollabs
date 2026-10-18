-- Optional sentence the organizer wants supporters to paste under the photo.
-- Empty means the standard first-person line. The campaign URL is always
-- added in front, so a caption cannot drop the link.
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "share_caption" text;
