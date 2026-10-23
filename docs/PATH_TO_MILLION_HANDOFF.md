# Path to 1M — agent handoff brief

**Audience:** a coding agent picking this up cold.  
**Date:** 2026-08-22 (status checked 2026-08-31)  
**Repo:** Ollabs (`c:\Users\josh\Desktop\Ollab`)  
**Owner intent:** Execute the audit backlog. Ship P0 first, then hubs (Linktree wedge), then P1. Do not wander into P3 or rebuild the product.

**Status 2026-08-31:** Phases A–E in this brief are shipped on `main` (including owner-token hash, story export, and hub upgrade interest). Hub public CTA is **Join**, not Support. Ads and Search indexing are off `/c` and `/u`. Homepage is the tool. Remaining owner work is real-phone QA (`docs/REAL_PHONE_QA.md`) and AdSense review. How the code works now: `docs/ENGINEERING.md`. Do not re-implement the tables below as if they were still open.

**Related artifacts (read these):**
- `AGENTS.md` — hard mobile / ads / copy rules (do not regress)
- `docs/ENGINEERING.md` — current auth, env, APIs, indexing, migrations
- Cursor canvas: `path-to-million.canvas.tsx` (full audit tables)
- Skills under `.agents/skills/`: `platform-docs`, `mobile-share-download`, `adsense-quiet`, `seo-locales`, `drizzle-neon`, `campaign-canvas`, `organizer-email`, `ollab-analytics`
- Docs mirrors: `docs/reference/` (optional deep API; prefer skills + code)

---

## 1. Product thesis (do not lose this)

Ollabs is **two products fused into one**:

| Lane | Competitor | Job |
|------|------------|-----|
| Campaigns `/c/[slug]` | Twibbonize | Ephemeral viral frame: publish → WhatsApp → supporters save photo |
| Hubs `/u/[handle]` | Linktree | Permanent bio URL: Support featured campaign → `/c` |

**Canonical funnel:**  
Instagram/TikTok bio → `ollabs.studio/u/{handle}` → **Support** (featured frame) → `/c` save → WhatsApp share again.

- Campaigns = growth virus (first supporter median ~4.5 min; most success is in the first hour).
- Hubs = identity / retention (what organizers paste in the bio).
- **Never** charge supporters. **Never** watermark the photo. **Never** build a social feed.
- Paid organizer upgrades and custom domains are **deferred** until hubs show demand.
- Do **not** clone Linktree commerce (shops, tips, email capture, scheduling). Do **not** build a full Twibbonize design studio. Prefer starter frame packs + fusion UX.

---

## 2. Non‑negotiable constraints (regressions = failed PR)

From `AGENTS.md` and production reality:

1. **Downloads:** only via `downloadBlob` in `lib/download.ts` (append anchor; delayed revoke). Prefer `saveFramedPhoto` in `lib/savePhoto.ts` for framed PNGs.
2. **Share files:** gate with `canShareFiles` in `lib/share.ts`. On iPhone / in-app browsers, Share leads; desktop Download leads.
3. **Drag canvases:** `touchAction: 'none'` (or Tailwind `touch-none`) on the element that receives drag handlers — see `components/editor/CanvasArea.tsx`, `components/campaign/CampaignClient.tsx`.
4. **Modals:** `dvh`, never `vh`. Body scroll lock + restore. Copy patterns from `components/PublishTemplateModal.tsx`.
5. **No `alert()`.** Inline errors: `role="alert"` + `text-coral bg-coral/10 border-coral/25`.
6. **Ads:** `components/AdSlot.tsx` only. Never on the photo. Never on `/create`. `/c` lean (1 before save, 2 after). Auto ads / anchors / vignettes stay OFF.
7. **Copy:** no em dashes in hub / create / mine user-facing strings. Hub Support CTA is **two lines** (`Support` / campaign title), not `Support — title`.
8. **Colors:** Tailwind theme tokens (`brand`, `ink`, `paper`, `cream`, `coral`, `muted`). Platform brand colors (WhatsApp green, Messenger blue) only in existing glyph helpers if needed.
9. **Organizer mobile tab bar** (`Mine · Create · Hub`): show on organizer surfaces; **hide** on `/c` public, `/u` hubs, `/for`, `/day`, locale landings, `/vs` — see `lib/mobileNav.ts` (`shouldShowMobileOrganizerNav`).
10. **Comments:** explain *why*; keep history. Commit messages: sentence case, plain English, no conventional-commit prefixes. Do not commit unless the user asks; do not push unless asked.

---

## 3. Execution order (strict)

Work **top to bottom**. Finish a slice with working UI + no obvious regressions before starting the next. Prefer small PRs / commits over one megadiff.

### Phase A — P0 conversion (this week)

| ID | Task | Primary files | Acceptance |
|----|------|---------------|------------|
| **P0.1** | Document / checklist for real-phone QA (WA Save Image, create drag, custom frame preview). Fix any bugs found if you have a device path; otherwise leave a clear QA checklist in the PR description. | `lib/savePhoto.ts`, create canvas, `CampaignClient.tsx` | Checklist exists; known breaks fixed or filed as blockers |
| **P0.2** | Hide global / organizer chrome that steals thumb zone on public `/c` during active save (nav already partially handled — verify `/c` and tighten if top nav or language banner interferes with save bar). | `lib/mobileNav.ts`, `components/NavBar.tsx` or layout, language banner, `CampaignClient.tsx` | Save/Share bar unobstructed on phone viewport; banner never covers it |
| **P0.3** | Post-save viral CTA: after successful save, one primary **Share WhatsApp** (or share sheet) with framed result leading; secondary download. Preview of framed face visible. | `components/campaign/CampaignClient.tsx`, `lib/share.ts`, `lib/savePhoto.ts` | After save, share is the obvious next action on mobile |
| **P0.4** | Rate-limit `POST` campaign use (and view bump if unbounded). Use / extend `lib/rateLimit.ts`; document serverless limits. | `app/api/campaigns/[slug]/use/route.ts`, view route if any, `lib/rateLimit.ts` | Burst abuse returns 429; normal supporters unaffected |
| **P0.5** | Sync Drizzle schema with live SQL migrations (day slug, slug redirects, day frame overrides, referrer, geo columns as present in `drizzle/*.sql`). Fix stale comments (e.g. `creator_id` “always null”). | `lib/db/schema.ts`, `drizzle/*.sql` | Schema matches DB; `tsc` / app queries still typecheck |
| **P0.6** | AdSense dual slots: confirm `AdSlot` reads `NEXT_PUBLIC_ADSENSE_SLOT_CAMPAIGN` + `NEXT_PUBLIC_ADSENSE_SLOT_SEO` (or current env names in `AdSlot.tsx`). If code is ready, note exact Vercel env names in PR for human to set. Do not enable Auto ads. | `components/AdSlot.tsx`, `AGENTS.md` | Code paths distinct; fallback documented |
| **P0.7** | Zero-supporter nudge: if campaign still has 0 supporters ~15–30 min after publish, email and/or in-app banner on manage/mine with WhatsApp share CTA. Prefer email if cron/queue exists; else manage banner + optional delayed client check is OK for v1. | `lib/email.ts`, manage/mine clients, maybe API | Organizer with 0 supporters sees/gets a clear “share now” prompt |
| **P0.8** | Frame transparency warning on create: if uploaded PNG has no meaningful alpha hole, warn inline with how to fix. Do not hard-block v1 unless detection is solid. | create / custom frame panel, canvas helpers | Bad opaque frames get a clear warning before publish |

### Phase B — Hub / Linktree wedge (immediately after or overlapping P0.3)

Hubs already exist: editor `/hub`, public `/u/[handle]`. Make them the bio link, fused to campaigns.

| ID | Task | Primary files | Acceptance |
|----|------|---------------|------------|
| **H1** | **One-tap claim after publish:** signed-in (or after light login) organizers get suggested handle applied, `featuredCampaignId` = just-published campaign, land on shareable `/u/...` — not only `/hub?suggest=`. | `components/PublishTemplateModal.tsx`, `app/api/organizer/hub/route.ts`, `lib/hub.ts`, `components/hub/HubEditorClient.tsx` | After publish, organizer has a live hub URL featuring this campaign with minimal steps |
| **H2** | WhatsApp-first **share hub URL** from editor + post-claim (reuse `whatsappUrl` / share helpers; copy about bio link, not frame paste). | `components/hub/HubEditorClient.tsx`, `lib/share.ts` | One tap opens WhatsApp with `/u/handle` message |
| **H3** | Public hub: featured **Support as campaign card** (preview image + supporter count + two-line Support / title). | `components/hub/HubPublicView.tsx`, `lib/getPublicHub.ts` | Featured block looks like a campaign, not a generic link button |
| **H4** | Locale-aware Support label (e.g. Apoiar / Dukung / Support) while keeping title on second line. | `HubPublicView.tsx`, i18n messages | PT/ID (and ES if easy) get native verb |
| **H5** | Real **drag-reorder** (or up/down) for hub links; `sort_order` already exists — wire the decorative grip. | `HubEditorClient.tsx`, hub API PATCH | Order changes persist after save |
| **H6** | Smart **social icons** when URL is IG/TikTok/YouTube/WhatsApp/X. | `HubPublicView.tsx` (+ maybe small util) | Known socials show icons; other links stay text rows |
| **H7** | **Click analytics:** beacon/API for Support taps vs link id; show simple counts on `/hub`. | new `app/api/...` route, `HubPublicView.tsx`, `HubEditorClient.tsx`, `lib/analytics.ts` as needed | Organizer sees Support taps / link taps |
| **H8** | Hub **OG image** prefers featured campaign preview when set. | `app/u/[handle]/page.tsx` metadata | WhatsApp unfurl shows frame art when featured exists |
| **H9** | Pin / hide campaigns on hub list (multi-campaign orgs). | schema if needed, hub API, editor + public view | Organizer can keep Support + 1–2 frames dominant |
| **H10** | 3–5 **campaign-tinted themes** (bg/button from featured art or fixed presets). Not a theme marketplace. | `HubPublicView.tsx`, editor theme picker | Public hub can switch preset; default remains current look |

**Linktree: match vs skip**

- **Match:** memorable URL, link stack, reorder, icons, click counts, share hub URL, strong OG.
- **Skip:** shops, tips, email capture, link scheduling, custom domain, removing Made with (keep for acquisition until paid).

### Phase C — P1 growth surface (2–4 weeks)

| ID | Task | Notes |
|----|------|-------|
| **P1.9** | Country-aware Explore | Recency × supporters; bias visitor country; real face/frame previews |
| **P1.11** | Starter frame packs | 8–12 PNGs per priority locale (BR/ID/PH/MX/NG intents) — collapsed rings stay fallback |
| **P1.12** | Day pages convert | Above-fold tool + live campaigns + share day link |
| **P1.13** | TL/ES product UI depth | Beyond marketing landings if touch points are still EN-only |
| **P1.14** | Organizer analytics lite | Manage: views, saves, countries sparkline |
| **P1.15** | Funnel events | login, recover, claim, day→create, language banner, supporter_joined — via `track()` in `lib/analytics.ts` |
| **P1.16** | SEO ads policy | Ads on locale landings / `/vs` or document lean exception |
| **P1.17** | OG quality on `/c` and `/day` | Face-in-frame style unfurls |
| **P1.18** | Messenger + WhatsApp parity on publish for ID/TL | Already partial — make both first-class |

### Phase D — P2 polish (compound)

Use-case parity across locales, a11y (focus trap / Escape), remove `@ts-ignore` in editor logic, defer heavy `@imgly` harder, moderation speed for viral spikes, empty states that teach WhatsApp share, Search Console ritual (human).

### Phase E — P3 do not start unless asked

Paid organizer upgrades, owner-token hashing / short-lived manage sessions, in-product frame designer, social follow feed, story 9:16 export (only after PF loop is strong).

---

## 4. Key code map

| Area | Paths |
|------|--------|
| Supporter campaign | `app/c/[slug]/`, `components/campaign/CampaignClient.tsx` |
| Create / canvas | `app/create/`, `components/editor/`, `components/EditorPage.tsx`, `components/PublishTemplateModal.tsx` |
| Save / share / download | `lib/savePhoto.ts`, `lib/share.ts`, `lib/download.ts` |
| Hub public / editor | `app/u/[handle]/`, `app/hub/`, `components/hub/*`, `lib/hub.ts`, `lib/getPublicHub.ts`, `app/api/organizer/hub/route.ts` |
| Mine / manage | `app/mine/`, `components/MyCampaignsClient.tsx` (or equiv), manage under `app/c/.../manage` |
| Ads | `components/AdSlot.tsx` |
| Email | `lib/email.ts`, `app/api/webhooks/resend/` |
| Schema / migrations | `lib/db/schema.ts`, `drizzle/*.sql` |
| Rate limit | `lib/rateLimit.ts` |
| Mobile nav visibility | `lib/mobileNav.ts` |
| Analytics | `lib/analytics.ts` (`track`, `withUtm`) |
| Day tool | `app/day/`, `components/day/` |

---

## 5. How to work (process)

1. Read this file + `AGENTS.md` + relevant skill (`mobile-share-download` for save work, etc.).
2. For each ID: inspect current code → implement → smoke the happy path mentally/on device → note follow-ups.
3. Prefer extending existing helpers over new parallel systems (`saveFramedPhoto`, `whatsappUrl`, `AdSlot`, hub PATCH).
4. User-facing copy: short, no em dashes, locale-aware where share/create already is.
5. If a task needs dashboard/human action (AdSense units, Search Console, real iPhone), do the code + leave exact checklist for Josh.
6. When user-visible behavior ships, add a bullet to `lib/announcements.ts` (newest first) per `AGENTS.md`.
7. Do **not** commit or push unless the user explicitly asks.

---

## 6. Definition of done

### Phase A + B
- [x] P0.1–P0.8 addressed or explicitly blocked with owner action listed  
- [x] H1–H10 shipped (claim + hub share + Support card + locale verb + reorder + icons + clicks + OG + hide + themes)  
- [x] No intentional regressions to WhatsApp save path or create `touchAction`  
- [x] Ads still never on photo / create  
- [x] Hub still clearly drives into `/c`, not a generic link dump  
- [x] **Owner:** commit + push path-to-million when ready  
- [ ] **Owner:** real iPhone + WhatsApp Save Image QA (`docs/REAL_PHONE_QA.md`)  

Parked next ideas (grid banners, supporter collage, etc.): `docs/FUTURE_IDEAS.md`.

### Phase C + D
- [x] P1.9–P1.18 growth surfaces (explore geo, packs, day share, locale depth, manage geo, funnel events, SEO ads, OG, Messenger parity)  
- [x] Phase D polish: focus trap / Escape on publish, touch typing without `any`, report auto-hide, empty Mine teaches WhatsApp  

### Phase E (thesis-safe only)
- [x] Owner-token hash + 72h manage session cookie (dual-read plaintext; no social feed; no Stripe billing)  
- [x] 9:16 story export on `/c` and `/day`  
- [x] Paid upgrade **interest** waitlist on hub editor (no billing, no custom domain yet)  
- [x] **Skipped by thesis:** social follow feed, full in-product frame designer, Stripe paid upgrades  

### Still human
Search Console ritual; AdSense unit creation in dashboard; physical-phone QA.
---

## 7. Suggested first message for the implementing agent

> Implement Phase A (P0.1–P0.8) then Phase B (H1–H3) from `docs/PATH_TO_MILLION_HANDOFF.md`. Follow `AGENTS.md` mobile/ads rules. Load skills `mobile-share-download`, `adsense-quiet`, `campaign-canvas`, and hub-related code under `components/hub/`. Do not start P3. Do not commit unless I ask.

---

## 8. Success metrics to optimize for (in priority order)

1. **% of campaigns with ≥1 supporter within 1 hour** (kill the ~58% zero-supporter rate)  
2. **Post-save WhatsApp / share rate** on `/c`  
3. **% of publishes that result in a claimed hub + bio URL shared**  
4. **Support taps from `/u` → `/c` opens** (after H7)  
5. Organic `/day` and `/for` sessions (later)

If a change does not move (1)–(3), question whether it belongs in Phase A/B.
