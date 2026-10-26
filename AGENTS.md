# Ollabs — working notes for AI assistants

Next.js 16 / React 19 / Tailwind / Neon Postgres / Vercel Blob. Deploys through Vercel's
GitHub integration: a push to `main` is a production deploy. There is no CI workflow and no
`.vercel` directory — the link lives in the Vercel dashboard.

Ollabs lets an organizer build a profile-picture frame, publish it as a campaign, and share one
link. Supporters open that link, drop in a photo, and download the framed result.

---

## Where things stand (2026-10-26)

**On `main` (`c9e9d9b`):** Phases 1–8 plus Path A–E thesis-safe slice (P0 conversion, hub H1–H10,
P1 growth, P2 polish, owner-token hash + manage sessions, 9:16 story export). Skipped by
thesis: social feed, full frame designer, Stripe billing. Hub upgrade waitlist UI is gone;
growth numbers, accent, logo, and CSV are free. The column still exists.

**Shipped after the 2026-08-22 handoff:** homepage is the tool (English-default live slug +
Create a campaign; EN | PT switch; no organizer tab bar on `/`); campaign pages stay
Portuguese-first when `publisher_country` is BR/PT or unset (on current `main`,
`first_supporter_country` can override that); `/guides` (eight articles in
`lib/guides.ts`, with Portuguese siblings); ads off `/c` and `/u`; `/c` stays
crawlable + noindex; `/u` indexes when the bio is ≥ 40 characters; `/es`
`/id` `/tl` 301 to `/`; Explore hides campaigns with fewer than five supporters; Contact page;
quieter campaign last-mile (profile vs story, Open in Safari).

**Shipped 2026-10-17 / 2026-10-18:** organizer chrome follows the visitor cookie; Portuguese
homepage headline is Reúna sua galera; supporter paste is link-first (`share_caption`);
colour rings open on the first visit to `/create`; starter packs follow the UI locale;
organizer lifecycle mail uses `campaignMailLang(publisher_country)`; `npm run lint` is
`eslint .`.

**Shipped 2026-10-19 / 2026-10-25:** homepage is one hero (live campaign overlays in
`HeroFrameFan`, photos `/hero/photo-01.jpg`…`07.jpg`) plus a short proof podium;
square saves embed the campaign URL as PNG tEXt and copy the paste caption;
post-save offers Make your own with Ollabs (`cta_taps`); hub editor shows free
counts, brand, and CSV (`0022`/`0023`); `useTapGuard` on Save/Share; skeletons and
a reduced-motion route bar; `/pt/guides` and `/pt/day`; `public/llms.txt`.

**Do not regress while editing manage / reports / thumbs / recover / hub / slugs / locale /
share:**
public `/c` slug redirects do not apply to `/manage`; Change the frame needs `k=` today
(cookie-only manage opens Create as a new campaign); admin hide keys off current
slug, not `campaign_id`; only day-frame admin pins Vercel Blob hosts;
`GET /recover/[token]` redeems on first fetch and renders `k=` in HTML; taking a
custom URL that is only a redirect hijacks the old WhatsApp link; signed-in
publish can overwrite a claimed `/u` handle if hub GET has not returned;
`POST /use` `/view` `/share` `/cta` `/report` and `GET /api/campaigns/[slug]` key the live slug
only, so a custom-link rename can 404 first-hour saves from the original WhatsApp
paste (ISR 60s + `countedRef` latches on 404); `/use` waits on the Explore thumb
upload, so leaving for WhatsApp during that upload drops the count; hub PATCH
deletes and reinserts links on every save, wiping tap counts; first hub Save
without a bio can stick the Save button (`useTapGuard` not released); do not feed the
marketing locale cookie into campaign copy (`resolveSupporterLocale`, not
`resolveLocale`); `/c` currently ORs `first_supporter_country` into that
resolver, so one non-BR first save on an untagged campaign flips later
WhatsApp visitors to English; custom-frame publish can store a blank
cream-circle `preview_url` because the 500 ms canvas snapshot misses overlay
decode (`textureVersion`), and campaign OG prefers that column over the
overlay URL; supporter paste must stay `${url}\n${line}` and keep `(via Ollabs)`
unless the organizer already wrote it; iOS file share still sends `title`, which
can hide Save Image (page then shows Download + sentence). Details: `docs/ENGINEERING.md`.

Mobile shell, custom-frame create (Frame → Name → Send), organizer save + slug redirects, quiet ads,
organizer hubs (themes, reorder, social icons, click counts, hide campaigns, one-tap claim),
Bahasa / Tagalog / Spanish product UI via cookie overlays (no marketing landings except `/pt`),
Hindi stub `/hi`, localized `/pt/for` and `/pt/vs/twibbonize`, top-market `/day` pages
(NG, MX, MY, PH, TH), geo-biased Explore, starter frame packs, geo tracking, first-supporter +
zero-supporter organizer email (cron), country breakdown on manage, Messenger+WhatsApp parity
on publish for ID/TL, funnel `track()` events, report auto-hide.

Developer map (auth, env, APIs, indexing, locale, share, migrations): `docs/ENGINEERING.md`.

**Still needs a real phone (Phase 0):** see `docs/REAL_PHONE_QA.md`.

**Copy:** no em dashes (`—`) anywhere on the platform. Hard rule. UI, emails,
metadata, share text, OG, announcements, SEO pages, day taglines, mocks that
mirror product copy. Use a period, comma, colon, or rewrite the sentence. Hub
Join CTA is two lines (`Join` / campaign title), never `Join` + em dash + title.

**Ads:** quiet labelled in-flow units. Never on the photo; never on `/create`;
never on `/c` or `/u` (those pages are user-generated and almost empty of
publisher text, which AdSense treats as low-value inventory). SEO pages
(`/for`, `/day`, locale landings, `/vs`, guides) carry labelled inventory
between content blocks.
**Paid upgrade:** deferred. `/hub` shows free counts, accent, logo, and CSV.
PATCH still accepts `upgradeInterest`; no waitlist UI ships today.

AdSense: ownership meta in root layout; `adsbygoogle.js` loads via `DeferredAdSense`
(after interaction or ~5s) so home LCP is not fighting unused ad JS. Units still only
via `AdSlot` (never on `/create`, `/c`, `/u`, or the photo). Set
`NEXT_PUBLIC_ADSENSE_SLOT_SEO` on Vercel (campaign slot env is unused);
keep Auto ads / anchors / vignettes OFF. See `docs/ADSENSE_SLOTS.md`.

Email (Resend): `RESEND_API_KEY` + verified `ollabs.studio`. Outbound uses
`EMAIL_FROM` (default `Ollabs <hello@ollabs.studio>`) and `EMAIL_REPLY_TO`
(default `hello@ollabs.studio`). Webhook at `/api/webhooks/resend` needs
`RESEND_WEBHOOK_SECRET`. Optional `CONTACT_NOTIFY_EMAIL` forwards inbound mail.
Zero-supporter cron: set `CRON_SECRET` for `/api/cron/zero-supporter` (`vercel.json`).
Lifecycle templates are `en` or `pt` via `campaignMailLang(publisher_country)`
(untagged defaults to Portuguese). Login codes follow the locale cookie.

Organizer mobile tab bar (**Mine · Create · Hub**): show on organizer surfaces;
**hide** on `/` (home is the tool), `/c` public, `/u` hubs, `/for`, `/day`,
`/guides`, locale landings, `/vs`, `/explore`, legal/about/contact/updates —
see `lib/mobileNav.ts`. Language banner never covers a save/publish bar.

Execution brief (historical tables, shipped): `docs/PATH_TO_MILLION_HANDOFF.md`.
Developer map: `docs/ENGINEERING.md`.
Future backlog (not scheduled): `docs/FUTURE_IDEAS.md`.

---

## Mobile constraints — learned the hard way, do not regress

Most traffic is phones, and a large share arrives inside iOS in-app browsers (WhatsApp,
Instagram). Three consequences:

**Downloads.** Use `downloadBlob` from `lib/download.ts`. Never hand-roll the anchor. The
anchor must be appended to the document — some mobile browsers ignore a click on a detached
element — and the object URL must outlive the click by a wide margin, because revoking right
after `click()` races the browser's read of the blob and the file silently never arrives.

Pair every download with `shareFramedPhoto` / `saveFramedPhoto` from `lib/savePhoto.ts`,
gated on `canShareFiles()` from `lib/share.ts`. iOS in-app browsers ignore `<a download>`
entirely, so the share sheet is the only path that reliably saves the picture there. Do
not mix `text` or `url` with `files` on iOS, and do not send `title` on that payload
until PR #24 lands. Where the sheet exists it should lead; on desktop, Download leads.
Prefer a fixed thumb-zone bar with `env(safe-area-inset-bottom)`. Copy the campaign
sentence in the same turn as `share()`, not before it. Square PF saves may embed tEXt
via `addPngMetadata`; story export does not. Use `useTapGuard` on Save/Share.

**Draggable canvases** need `touchAction: 'none'` in the inline style of the element carrying
the touch handlers. React attaches `touchmove` passively at the root, so `e.preventDefault()`
inside `onTouchMove` is a no-op — only `touch-action` stops the page scrolling under the drag.

**Modals** use `dvh`, never `vh`. On iOS Safari `100vh` is the height with the toolbars hidden,
so a `vh`-capped panel runs under the address bar and the button at its bottom cannot be
reached. Use `max-h-[92dvh] overflow-y-auto overscroll-contain`, plus the position-fixed body
scroll lock with scroll restore — copy the effect in `PublishTemplateModal.tsx` verbatim.

**No `alert()` anywhere.** It covers the page, and in an in-app browser a stray tap dismisses it
before it is read. Errors render inline next to the control that failed, with `role="alert"` and
`text-coral bg-coral/10 border-coral/25`.

**Create focuses on custom frames.** Premade colour rings open on the first visit to `/create`
(`simpleStylesOpen` defaults true; a collapse sticks in `ollabs_simple_styles_open`). Keep the
live canvas visible while the organizer adjusts the photo window.

---

## Sharing behaviour

`lib/share.ts` holds the reasoning, and it is worth reading before changing any share copy. The
short version: campaigns either get shared in the minutes right after publishing or never — the
median first supporter arrives 4.5 minutes after publish, 84% within the hour, none after 24
hours. So the publish screen opens WhatsApp directly rather than offering a link to copy.

Supporter paste is two lines: campaign URL first, then one sentence. `supporterShareText`
always returns `${url}\n${line}`. An organizer caption on Manage replaces only the second
line (`share_caption`, max 180). `(via Ollabs)` stays unless they already wrote it. Language
comes from `shareLocale()` (`en|pt|id|es|tl`), not only `prefersPortuguese()`. The same
sentence is copied to the clipboard during share, shown on the confirmation, and (on
Android) tried next to the PNG. Square saves also write the URL into PNG tEXt. A
successful file share increments `share_count`; the Make your own link increments
`cta_taps`.

---

## Conventions

Comments explain **why**, not what, and they carry the history — why a thing is the way it is,
what broke before, what was tried. Match that register; do not strip those comments when
editing nearby code.

Commit messages are plain sentences describing the effect, sentence case, no conventional-commit
prefixes. Recent examples:

- `Delete the dead weight: framer-motion, the onboarding overlay, and the unreachable editor features`
- `Fix the shared renderer bug that stalled mobile, and cap canvas work`

When something user-visible ships, add a bullet to `lib/announcements.ts` (newest first) and link
from the home footer at `/updates`.

Colors come from the Tailwind theme (`brand`, `ink`, `paper`, `cream`, `coral`, `muted`) — no
hardcoded hex in components.

`_to_delete/` and `_parked/` are dead code kept around deliberately. They are gitignored, are
not part of the app, and produce TypeScript errors if you run `tsc` across the whole tree.
Ignore them; `next build` does.

## Building

`next build` works normally. Note for anyone running it through a mounted/virtualized
filesystem: it can die with a bare `Bus error` there — that is the mount, not the code. Build on
a local checkout.

`npm run lint` is `eslint .` (`eslint.config.mjs`). Next 16 dropped `next lint`.
