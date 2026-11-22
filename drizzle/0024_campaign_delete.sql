-- Organizer-initiated delete. Soft: the row stays for counts and reports,
-- is_hidden keeps it out of every public query, and deleted_at tells
-- moderation apart from an owner deleting their own campaign.
-- Applied to production on 2026-11-22.

ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;
