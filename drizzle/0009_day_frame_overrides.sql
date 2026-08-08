-- Swap the artwork on a /day page without a deploy.
--
-- Day editorial stays in lib/days.ts: it is real writing and it wants version
-- control and review. Only the frame image becomes runtime-editable, because
-- that is the part that gets iterated on.
--
-- Resolution order is override -> bundled file -> generated colour ring, so a
-- day always renders something even with no row here.

CREATE TABLE IF NOT EXISTS "day_frame_overrides" (
    "slug" text PRIMARY KEY NOT NULL,
    "image_url" text NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
