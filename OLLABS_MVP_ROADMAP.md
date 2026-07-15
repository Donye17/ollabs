# Ollabs — Road to MVP Launch

*Updated July 14, 2026. The MVP is the campaign-first, circle-only, ad-free Twibbon alternative.*

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

- [ ] Remove or auth-gate the public `/api/debug/*` and `/api/seed` endpoints
- [ ] Move the hardcoded seed key (`ollabs-2026-master-key`) out of code/docs into an env var
- [ ] Add `tsconfig.tsbuildinfo` to `.gitignore` and untrack it (build artifact)
- [ ] Remove the dead `text` tab/panel left in the editor
- [ ] Replace or remove the fake homepage activity ticker (Leo/Sarah/… demo data reads as fake social proof)

Low effort, high polish. None of it blocks launch, but it should be clean before real traffic.

---

## Phase 2 — The campaign primitive (core build) 🎯

This is the heart of the MVP — the piece that turns a tool into a growth engine.

- [ ] **Data model.** Add a `campaigns` table: `id`, `slug`, `title`, `description`, `frame_config` (jsonb), `creator_id` (nullable), `supporter_count`, `is_public`, `created_at`. Add a `campaign_uses` table: `campaign_id`, `created_at`, optional `user_id`, optional opt-in `image_url` (powers the count + supporter wall). One clean Drizzle migration.
- [ ] **Builder → campaign.** Rename "Publish template" to "Create campaign." On create, generate a unique `slug` and save the frame config as a campaign. Return the shareable link.
- [ ] **API.** `POST /api/campaigns` (create), `GET /api/campaigns/[slug]` (fetch), `POST /api/campaigns/[slug]/use` (increment supporter count).
- [ ] **Decision to make:** anonymous-create for MVP (anyone makes a campaign, no login) vs. require an organizer login. Recommend anonymous-first with an optional "claim this campaign" link.

---

## Phase 3 — The supporter page (the differentiator) 🎯

The public campaign experience at `/c/[slug]`. This is what has to beat Twibbon on feel.

- [ ] **New route `/c/[slug]`** — completely separate from the builder. Supporters never see tabs or style pickers.
- [ ] **The flow:** upload photo → auto-fit into the frame → drag/pinch to adjust → Download / Share. One primary action at each step.
- [ ] **Mobile-first.** Thumb-friendly, fast, zero ad interstitials. This is where most supporters will be.
- [ ] **Live supporter counter** — increments on download/use.
- [ ] **Share** — copy link + native share sheet; "Make your own" link back to the builder.
- [ ] *(Optional for MVP)* opt-in supporter wall of recent photos.

---

## Phase 4 — Launch hardening & polish

- [ ] **SEO for campaigns** — repoint the existing OG-image generator at campaigns so shared links preview nicely; per-campaign meta tags.
- [ ] **Graceful degradation** — the builder/editor should still work if the DB is down (it's client-side), and the supporter page should fail softly.
- [ ] **Sentry alerting** — actually wire alerts so an outage pings you in minutes (the last one was invisible until someone looked).
- [ ] **Analytics** — track campaigns created and **supporter conversion (uses ÷ page views)** — the single metric that tells you it's working.
- [ ] **Auth simplification** — anonymous-first; keep at most one social login for organizers who want to manage campaigns. (Trim the three-provider setup.)
- [ ] **QA pass** — full run-through on mobile + desktop: create a campaign, open its link as a supporter, upload, adjust, download, share, watch the count move.

---

## Phase 5 — MVP launch

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
