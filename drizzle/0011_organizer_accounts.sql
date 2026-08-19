-- Optional organizer accounts.
--
-- Creating a campaign still requires nothing, and supporters still never see a
-- login. This exists for one failure that was costing real campaigns: the only
-- routes back into a dashboard were localStorage in the creating browser and a
-- link in an email. Most organizers arrive inside the WhatsApp in-app browser,
-- which has its own sandboxed storage, so opening Chrome later loses the
-- campaign and they rebuild it from scratch. Over Aug 15 to 16 that produced 50
-- campaigns from 26 creators.
--
-- Login is by six digit code, never a magic link. A link mailed to someone
-- inside an in-app browser opens in their default browser instead, which is a
-- different session, so it authenticates a tab they are not sitting in. A code
-- they type back into the tab they already have open works everywhere.
--
-- owner_token keeps working exactly as before. This is additive.

CREATE TABLE IF NOT EXISTS "organizers" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "email" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "last_login_at" timestamp with time zone
);
--> statement-breakpoint
-- Emails are normalized to lowercase before they ever reach this table.
CREATE UNIQUE INDEX IF NOT EXISTS "idx_organizers_email" ON "organizers" USING btree ("email");
--> statement-breakpoint

-- Codes are stored hashed. A leaked database read should not hand anyone a
-- working login code in the ten minutes before it expires.
CREATE TABLE IF NOT EXISTS "organizer_login_codes" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "email" text NOT NULL,
    "code_hash" text NOT NULL,
    "attempts" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "expires_at" timestamp with time zone NOT NULL,
    "used_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_login_codes_email" ON "organizer_login_codes" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_login_codes_expires" ON "organizer_login_codes" USING btree ("expires_at");
--> statement-breakpoint

-- Session tokens are stored hashed for the same reason as the codes.
CREATE TABLE IF NOT EXISTS "organizer_sessions" (
    "token_hash" text PRIMARY KEY NOT NULL,
    "organizer_id" uuid NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "expires_at" timestamp with time zone NOT NULL,
    CONSTRAINT "organizer_sessions_organizer_id_fkey"
        FOREIGN KEY ("organizer_id") REFERENCES "organizers"("id") ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_organizer_sessions_organizer" ON "organizer_sessions" USING btree ("organizer_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_organizer_sessions_expires" ON "organizer_sessions" USING btree ("expires_at");
--> statement-breakpoint

-- creator_id has existed and stayed null since the campaign-only rewrite. It is
-- text rather than uuid because it predates this table, so organizer ids are
-- written into it as text and this index backs the dashboard listing.
CREATE INDEX IF NOT EXISTS "idx_campaigns_creator_id" ON "campaigns" USING btree ("creator_id");
