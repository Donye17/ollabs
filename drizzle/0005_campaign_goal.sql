-- Optional supporter goal for a campaign. When set, the supporter page shows
-- a progress bar (real supporter_count out of goal).
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "goal" integer;
