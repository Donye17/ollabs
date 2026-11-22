# Ollabs — Road to MVP Launch

> **⚠️ SUPERSEDED as of August 1, 2026.** Phases 1 through 4 all shipped between July 14 and July 29. The product is live at ollabs.studio with real organic supporters. **See [LAUNCH_PLAN.md](./LAUNCH_PLAN.md) for current state and next steps.** This document is kept for history. Checkboxes below have been updated to reflect what actually shipped.

*Originally written July 14, 2026. The MVP is the campaign-first, circle-only, ad-free Twibbon alternative.*

## Definition of done (what "MVP" means)

A supporter opens a campaign link on their phone, drops in their photo, sees it inside the frame, and downloads or shares it — no signup, no ads, in seconds. An organizer can create that campaign and get the link. A live supporter count ticks up. Everything else is either already working or deliberately post-MVP.

Critical path to launch: **Phase 2 (campaign primitive) → Phase 3 (supporter page)**. The rest supports those two.

---

## ✅ Already done (Phase 0 — stabilize & scale back)

- [x] Reconnected the database (rotated `DATABASE_URL`)
- [x] Fixed the gallery 500 + empty-trending bug (recency-weighted ranking)
- [x] Fixed the latent remix-notification bug
- [x] Circle-only frames (customizer + gallery data cleaned)
- [x] Removed Stickers and GIF-Motion from the builder
- [x] Normalized line endings to LF (`.gitattributes`) — clean git history

---

## Phase 1 — Cleanup & hygiene (small, do alongside Phase 2)

- [x] Remove or auth-gate the public `/api/debug/*` and `/api/seed` endpoints (both gone; `debug-db` is now an empty dir)
- [x] Move the hardcoded seed key out of code/docs into an env var (no references remain)
- [x] Add `tsconfig.tsbuildinfo` to `.gitignore` and untrack it
- [x] Remove the dead `text` tab/panel left in the editor
- [x] Replace the fake homepage activity ticker (now a real live-campaign carousel)

Low effort, high polish. None of it blocks launch, but it should be clean before real traffic.

---

## ✅ Phase 2 — The campaign primitive (shipped)

This is the heart of the MVP — the piece that turns a tool into a growth engine.

- [x] **Data model.** Add a `campaigns` table: `id`, `slug`, `title`, `description`, `frame_config` (jsonb), `creator_id` (nullable), `supporter_count`, `is_public`, `created_at`. Add a `campaign_uses` table: `campaign_id`, `created_at`, optional `user_id`, optional opt-in `image_url` (powers the count + supporter wall). One clean Drizzle migration.
- [x] **Builder → campaign.** Rename "Publish template" to "Create campaign." On create, generate a unique `slug` and save the frame config as a campaign. Return the shareable link.
- [x] **API.** `POST /api/campaigns` (create), `GET /api/campaigns/[slug]` (fetch), `POST /api/campaigns/[slug]/use` (increment supporter count).
- [x] **Decision to make:** anonymous-create for MVP (anyone makes a campaign, no login) vs. require an organizer login. Recommend anonymous-first with an optional "claim this campaign" link.

---

## ✅ Phase 3 — The supporter page (shipped)

The public campaign experience at `/c/[slug]`. This is what has to beat Twibbon on feel.

- [x] **New route `/c/[slug]`** — completely separate from the builder. Supporters never see tabs or style pickers.
- [x] **The flow:** upload photo → auto-fit into the frame → drag/pinch to adjust → Download / Share. One primary action at each step.
- [x] **Mobile-first.** Thumb-friendly, fast, zero ad interstitials. This is where most supporters will be.
- [x] **Live supporter counter** — increments on download/use.
- [x] **Share** — copy link + native share sheet; "Make your own" link back to the builder.
- [ ] *(Optional for MVP, not built)* opt-in supporter wall of recent photos.

---

## ✅ Phase 4 — Launch hardening & polish (shipped, two manual items open)

- [x] **SEO for campaigns** — repoint the existing OG-image generator at campaigns so shared links preview nicely; per-campaign meta tags.
- [x] **Graceful degradation** — the builder/editor should still work if the DB is down (it's client-side), and the supporter page should fail softly.
- [ ] **Sentry alerting** — SDK is wired and collecting, but no alert *rule* is configured. This is a Sentry dashboard setting, not code. An outage is still invisible until someone looks. **Still open.**
- [x] **Analytics** — GA4 tracks `campaign_created`, `frame_download`, `frame_share`, `copy_link`, `frame_copy_image`, plus `photo_uploaded` (added Aug 1) so the upload drop-off step is visible.
- [x] **Auth simplification** — anonymous-first; organizers can create without an account.
- [ ] **QA pass** — full run-through on mobile + desktop. Checklist lives in LAUNCH_PLAN.md. **Still open.**

---

## 🎯 Phase 5 — MVP launch (current focus — see LAUNCH_PLAN.md)

- [ ] **Pick a launch wedge** — one real community, event, or cause to seed the first genuine campaigns (a Discord server, a sports team, a fundraiser). Distribution beats features here.
- [ ] **Seed 2–3 flagship campaigns** yourself so the format is obvious.
- [ ] **Soft launch** to that wedge, watch supporter conversion, fix the campaign page based on what you see.
- [ ] **Ship it.**

---

## Post-MVP (Season 2 — explicitly not now)

- Community gallery / remix / follows / collections (the social layer)
- Avatar builder (the from-scratch character maker)
- Monetization — organizer freemium: custom slug/domain, analytics, no watermark, higher supporter caps. This is the anti-ads business model; design for it, build it once campaigns prove out.

---

## The one thing to keep protecting

Better UX isn't a moat by itself. Your durable edge is **iteration speed + a clean brand + the ad-free promise** — and the fact that changing a PFP is rare means MVP success comes from **organizers coming back to run new campaigns**, not individual users returning. Build for the organizer; delight the supporter.
