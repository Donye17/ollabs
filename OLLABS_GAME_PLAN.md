# Ollabs — Game Plan

*A campaign-first path to out-executing Twibbonize. Drafted July 14, 2026.*

## The thesis in one line

Twibbonize proved the market (287M+ users, 193 countries) and left the door open by being slow, cluttered, and ad-choked. Ollabs wins by being the **fast, clean, ad-free way to run a profile-picture support campaign** — not by being a better social network for frame-makers.

## The one idea that changes everything

Twibbon's growth engine was never the editor. It was the **campaign link**: one organizer makes a frame, shares one link, and thousands of supporters add their photo and repost. Every campaign is its own distribution engine.

So the core unit of Ollabs should be the **campaign**, not the frame-in-a-gallery. Reorient the whole product around this primitive:

> An organizer creates a campaign → gets a branded page + a short link + a live supporter counter → shares one link → supporters add their photo in seconds and post everywhere.

Virality lives inside the primitive. You stop *hoping* a gallery generates spread and start *building* spread into every campaign.

## Keep / Strip / Defer

**Keep (the genuinely good parts you already built):**
- The client-side canvas rendering engine (`components/renderer/`) — this is your crown jewel. Zero server cost, scales infinitely, privacy-friendly.
- The editor and create flow (`app/create/`, editor components).
- Infra: Next.js on Vercel, Neon, Vercel Blob, Sentry, per-frame OG image generation (`app/api/og/`), SEO scaffolding.

**Strip or hide for now (wrong primitive / premature surface area):**
- The social gallery layer: likes, comments, remixes, follows, collections, notifications, verified badges. This is a social network for frame-makers — the weakest bet, and most of the fragile backend.
- Extra auth: three OAuth providers + email/password. Ship anonymous-first, add one login when saving requires identity.
- The avatar builder (already removed once — that instinct was right).

**Defer to "season two":** gallery/community, remix, avatar creator, multiple login methods. These are expansions you launch *to an audience you already have* — not launch requirements.

## Phase 0 — Stabilize (do this first, ~days)

The current app is dark on a rotated DB password. Before anything new:
1. Refresh `DATABASE_URL` in Vercel + local from Neon, redeploy, confirm the editor + any DB call works.
2. Remove or auth-gate `/api/debug/*` and `/api/seed`. Untrack `.env` from git and rotate anything exposed in history.
3. Confirm the client-side editor works fully standalone (it should, since rendering is browser-side) — that's your floor even when the backend hiccups.

Goal: the thing you have is reliable and not embarrassing, before you rebuild direction.

## Phase 1 — The campaign MVP (this is "the base")

The minimum lovable version has exactly three things, done better than Twibbon:

1. **A fast, no-signup editor.** Upload photo → live preview → pick/adjust frame → one-tap export. Mobile-first, instant, zero ad interstitials.
2. **Campaign creation.** An organizer uploads/designs a frame overlay, adds a title + description, and gets a short link (`ollabs.studio/c/their-slug`) and a branded campaign page.
3. **The campaign page.** Beautiful, ad-free, loads fast. Live supporter counter, big "Add your photo" CTA, one-tap download + direct share to each platform, and (optional, opt-in) a wall of recent supporter images.

Minimal data model:
- `campaigns` — id, slug, title, description, frame_config, creator_id (nullable), supporter_count, created_at, is_public.
- `campaign_uses` — campaign_id, created_at, optional user_id, optional opt-in image (powers the counter + supporter wall).
- `users` (organizers) — keep better-auth, one login method.

Reliability baked in: one Drizzle schema as source of truth → generated migrations → applied in CI (never hand-edit prod again). Sentry alerting actually wired so an outage pings you in minutes. Editor degrades gracefully if the DB is down.

## Phase 2 — Growth

- SEO campaign pages + per-campaign OG images (you already have the OG generator — repoint it at campaigns).
- One-tap share mechanics and a supporter wall that makes campaigns feel alive.
- A small library of beautiful default templates (events, causes, sports, fandoms, holidays).
- Seed 3–5 flagship campaigns yourself to show the format and prime SEO.

## Phase 3 — Monetize + expand

Organizer freemium (this is your anti-ads business model):
- **Free:** launch a campaign, use the editor, basic page.
- **Pro:** remove watermark, custom slug/domain, analytics (views, downloads, geo), higher supporter cap, scheduling, multiple frames per campaign.

The people who pay are organizers running real campaigns — not casual users. Clean, ad-free, sustainable. *Then* layer season-two features (community gallery, remix, avatar builder) onto the audience you've built.

## What to measure

Not vanity metrics. Track: campaigns created, **supporter conversion per campaign** (uses ÷ page views — this is the core health metric), shares per campaign, repeat organizers, and eventually Pro conversion. If supporter-conversion is healthy, you have a Twibbon-killer. If it's not, fix the campaign page before building anything else.

## The uncomfortable truths to respect

- Better UX alone isn't a moat — incumbents copy. Your durable edge is *speed of iteration + a cleaner brand + the ad-free promise*, so protect all three.
- "No ads" is a promise that needs the freemium engine behind it, or it stays a hobby.
- Changing a PFP is a rare act — so retention comes from **organizers coming back to run new campaigns**, not from individual users returning. Design for the organizer.

## Immediate next actions

1. Fix the DB credential + redeploy (Phase 0, item 1).
2. Decide: commit to the campaign primitive. If yes, everything below the editor gets refactored from "frames + gallery" to "campaigns."
3. Map the three MVP screens (editor, create-campaign, campaign page) and cut the rest from the critical path.
