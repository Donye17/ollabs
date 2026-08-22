-- Guard so the "first supporter joined" email sends at most once per campaign.
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "first_supporter_emailed_at" timestamptz;
