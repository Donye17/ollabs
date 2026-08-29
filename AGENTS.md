# Ollabs — working notes for AI assistants

Next.js 16 / React 19 / Tailwind / Neon Postgres / Vercel Blob. Deploys through Vercel's
GitHub integration: a push to `main` is a production deploy. There is no CI workflow and no
`.vercel` directory — the link lives in the Vercel dashboard.

Ollabs lets an organizer build a profile-picture frame, publish it as a campaign, and share one
link. Supporters open that link, drop in a photo, and download the framed result.

---

## Where things stand (2026-08-22)

**On `main` (pending push of path-to-million work):** Phases 1–8 plus Path A–E thesis-safe
slice (P0 conversion, hub H1–H10, P1 growth, P2 polish, owner-token hash + manage sessions,
9:16 story export, hub upgrade interest waitlist). Skipped by thesis: social feed, full frame
designer, Stripe billing.

Mobile shell, custom-frame create (Frame → Name → Send), organizer save + slug 301s, quiet ads, PT-BR,
organizer hubs (themes, reorder, social icons, click counts, hide campaigns, one-tap claim), Bahasa /
Tagalog / Spanish product UI (no `/es` `/id` `/tl` marketing landings; those 301 to `/`), Hindi stub
`/hi`, localized `/pt/for` and `/pt/vs/twibbonize`, top-market `/day` pages
(NG, MX, MY, PH, TH) with WhatsApp share + frame OG, geo-biased Explore, starter frame packs,
geo tracking, first-supporter + zero-supporter organizer email (cron), country breakdown on manage,
Messenger+WhatsApp parity on publish for ID/TL, funnel `track()` events, report auto-hide.

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
**Paid upgrade:** interest waitlist on `/hub` only; billing still deferred until demand is clear.

AdSense: ownership meta in root layout; `adsbygoogle.js` loads via `DeferredAdSense`
(after interaction or ~5s) so home LCP is not fighting unused ad JS. Units still only
via `AdSlot` (never on `/create` or the photo). Set
`NEXT_PUBLIC_ADSENSE_SLOT_CAMPAIGN` and `NEXT_PUBLIC_ADSENSE_SLOT_SEO` on Vercel;
keep Auto ads / anchors / vignettes OFF. See `docs/ADSENSE_SLOTS.md`.

Email (Resend): `RESEND_API_KEY` + verified `ollabs.studio`. Outbound uses
`EMAIL_FROM` (default `Ollabs <hello@ollabs.studio>`) and `EMAIL_REPLY_TO`
(default `hello@ollabs.studio`). Webhook at `/api/webhooks/resend` needs
`RESEND_WEBHOOK_SECRET`. Optional `CONTACT_NOTIFY_EMAIL` forwards inbound mail.
Zero-supporter cron: set `CRON_SECRET` for `/api/cron/zero-supporter` (`vercel.json`).

Organizer mobile tab bar (**Mine · Create · Hub**): show on organizer surfaces;
**hide** on `/c` public, `/u` hubs, `/for`, `/day`, locale landings, `/vs` —
see `lib/mobileNav.ts`. Language banner never covers a save/publish bar.

Execution brief: `docs/PATH_TO_MILLION_HANDOFF.md`.
Future backlog (not scheduled): `docs/FUTURE_IDEAS.md`.

---

## Mobile constraints — learned the hard way, do not regress

Most traffic is phones, and a large share arrives inside iOS in-app browsers (WhatsApp,
Instagram). Three consequences:

**Downloads.** Use `downloadBlob` from `lib/download.ts`. Never hand-roll the anchor. The
anchor must be appended to the document — some mobile browsers ignore a click on a detached
element — and the object URL must outlive the click by a wide margin, because revoking right
after `click()` races the browser's read of the blob and the file silently never arrives.

Pair every download with a `navigator.share({ files })` button gated on `canShareFiles()` from
`lib/share.ts`. iOS in-app browsers ignore `<a download>` entirely, so the share sheet is the
only path that reliably saves the picture there. Where the sheet exists it should lead; on
desktop, Download leads. Prefer a fixed thumb-zone bar with `env(safe-area-inset-bottom)`.

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

**Create focuses on custom frames.** Premade colour rings are a collapsed fallback. Keep the
live canvas visible while the organizer adjusts the photo window.

---

## Sharing behaviour

`lib/share.ts` holds the reasoning, and it is worth reading before changing any share copy. The
short version: campaigns either get shared in the minutes right after publishing or never — the
median first supporter arrives 4.5 minutes after publish, 84% within the hour, none after 24
hours. So the publish screen opens WhatsApp directly rather than offering a link to copy. Share
text switches to Portuguese via `prefersPortuguese()`, because the people pasting these links
into group chats are overwhelmingly Brazilian even though the interface is English.

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
