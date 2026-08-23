-- Track the one-shot "still zero supporters" email so the cron cannot spam.
-- First-supporter and milestone mails already have their own guard columns.

ALTER TABLE "campaigns"
    ADD COLUMN IF NOT EXISTS "zero_supporter_emailed_at" timestamp with time zone;
