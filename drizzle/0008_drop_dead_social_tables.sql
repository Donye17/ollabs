-- Drop the leftovers from the torn-down social model and the unused auth stack.
--
-- DESTRUCTIVE. Take a Neon branch/snapshot before running this.
--
-- Why each of these is safe to remove, verified against the codebase:
--
--   * The only tables any query touches are campaigns, campaign_uses,
--     campaign_reports, and campaign_recovery_tokens. Every table below has
--     zero references outside lib/db/schema.ts and lib/db/relations.ts.
--   * The social model (frames, likes, comments, collections, follows,
--     notifications) was torn out of the UI in commit 85a6b73 but its tables
--     were left behind.
--   * likes, frame_likes and user_favorites are three overlapping tables that
--     all did the same job.
--   * The auth tables existed to serve better-auth, which had zero imports
--     anywhere and has been removed from package.json.
--
-- Order matters: children before parents. CASCADE is belt-and-braces for any
-- constraint that drifted from the checked-in schema.

-- --- social layer ------------------------------------------------------
DROP TABLE IF EXISTS "collection_items" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "collections" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "frame_comments" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "frame_likes" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "user_favorites" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "likes" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "notifications" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "user_profiles" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "frames" CASCADE;
--> statement-breakpoint

-- --- unused auth stack (better-auth removed) ---------------------------
DROP TABLE IF EXISTS "session" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "account" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "verification" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "user" CASCADE;
--> statement-breakpoint

-- campaigns.creator_id is left in place: it is nullable, always null today,
-- and keeping it means organizer accounts can be added later without a
-- second migration.
