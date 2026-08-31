# Engineering handbook

Developer-facing map of how Ollabs actually works. Prefer this over older
planning docs (`TECH_STACK.md`, `INTEGRATIONS.md`, `PROJECT_REPORT.md`) when
they disagree with the code.

Product rules that must not regress live in `AGENTS.md`. This file covers
architecture, public interfaces, setup, and operational pitfalls.

---

## What the product is

Two fused surfaces:

| Surface | URL | Job |
|---------|-----|-----|
| Campaign | `/c/[slug]` | One frame, one WhatsApp paste. Supporters add a photo and save. |
| Hub | `/u/[handle]` | Stable bio URL. Join opens the featured campaign. |

Create is Frame → Name → Send at `/create`. Supporters never sign in. Organizer
login is optional and only exists so a dashboard survives a phone switch.

The homepage (`/`) is the tool, not a brochure. First viewport is a live slug
preview, one name field, and **Criar campanha**. Copy on that hero is
Portuguese on purpose (almost all real use is Brazil). Colour rings live on
`/create`, not home.

---

## Stack (verified against `package.json`)

| Layer | What we use |
|-------|-------------|
| App | Next.js 16 App Router, React 19, TypeScript |
| Style | Tailwind CSS 3.4 (not v4), tokens `brand` `ink` `paper` `cream` `coral` `muted` |
| Data | Neon serverless Postgres via `@neondatabase/serverless` `Pool` in `lib/neon.ts` |
| Queries | Raw SQL. `lib/db/schema.ts` is a readable table map. It is excluded from `tsc` because `drizzle-orm` is not a dependency. |
| Migrations | Numbered files in `drizzle/*.sql` (currently through `0020_`). Those files are the schema authority. |
| Files | Vercel Blob, client upload token from `POST /api/upload` (JPEG/PNG/GIF/WebP, 8 MB) |
| Auth | Custom 6-digit email codes (`lib/auth.ts`). **Not** better-auth. Social OAuth was removed in migration 0008. |
| Email | Resend REST from `lib/email.ts` (no SDK). Organizers only. |
| Errors | Sentry server + edge only (`docs/SENTRY.md`). No browser SDK. |
| Ads | Manual `AdSlot` on SEO pages. `DeferredAdSense` in root layout. |

There is no CI. A push to `main` deploys on Vercel.

---

## Local setup

```bash
# .env.local needs at least DATABASE_URL
npm install
npm run dev
```

`next build` works on a normal checkout. On some mounted filesystems it dies
with a bare `Bus error`. That is the mount, not the app.

`_to_delete/` and `_parked/` are gitignored leftovers. Do not typecheck them.

---

## Environment variables

Set on Vercel Production (and Preview if you want the same behaviour). Never
commit values.

### Required for the app to boot

| Name | Used by |
|------|---------|
| `DATABASE_URL` | `lib/neon.ts`. App throws at import if missing. |

### Storage

| Name | Used by |
|------|---------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob uploads from `/create` and campaign photos. |

### Organizer email (optional locally; needed in production)

| Name | Used by |
|------|---------|
| `RESEND_API_KEY` | Outbound mail. If unset, `sendEmail` no-ops and logs. |
| `EMAIL_FROM` | Default `Ollabs <hello@ollabs.studio>` |
| `EMAIL_REPLY_TO` | Default `hello@ollabs.studio` |
| `RESEND_WEBHOOK_SECRET` | `POST /api/webhooks/resend` (Svix). 503-quality failure if unset on that route. |
| `CONTACT_NOTIFY_EMAIL` | Optional forward of inbound Resend Receiving mail. |
| `NEXT_PUBLIC_SITE_URL` | Links inside emails. Default `https://ollabs.studio`. |

### Cron, admin, monitoring

| Name | Used by |
|------|---------|
| `CRON_SECRET` | `GET /api/cron/zero-supporter`. Vercel Cron sends `Authorization: Bearer`. Manual runs may send `x-cron-secret`. 503 if unset. |
| `ADMIN_KEY` | `/admin?key=...` and `/api/admin/*`. Empty key never authenticates. |
| `SENTRY_DSN` | Server/edge only. Do **not** set `NEXT_PUBLIC_SENTRY_DSN`. See `docs/SENTRY.md`. |

### Public client ids

| Name | Used by |
|------|---------|
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Ownership meta + loader |
| `NEXT_PUBLIC_ADSENSE_SLOT_SEO` | Units on `/for`, `/day`, `/pt`, `/vs`, `/guides` |
| `NEXT_PUBLIC_ADSENSE_SLOT_CAMPAIGN` | Unused after 2026-08-28 (no units on `/c` or `/u`) |
| `NEXT_PUBLIC_ADSENSE_SLOT_INLINE` | Fallback if a dedicated slot env is missing |
| `NEXT_PUBLIC_GA_ID` | Deferred GA |

Keep AdSense Auto ads, anchors, and vignettes **off**.

---

## Public routes

| Path | Index? | Ads? | Organizer tab bar? |
|------|--------|------|--------------------|
| `/` | yes | no units (script still deferred) | **no** |
| `/create` | yes | never | yes |
| `/c/[slug]` | **noindex, follow**, still crawlable | never | no |
| `/c/[slug]/manage` | noindex, nofollow | never | yes |
| `/u/[handle]` | **noindex, follow**, still crawlable | never | no |
| `/hub` `/mine` `/login` `/recover` `/admin` | noindex; robots `disallow` | never | hub/mine/login yes; admin no |
| `/explore` | yes | no | no |
| `/guides`, `/for`, `/day`, `/vs`, `/pt` | yes | labelled SEO units | no |
| `/hi` | noindex stub | | no |
| `/es` `/id` `/tl` | 301 to `/` | | |

**Do not** add `/c` or `/u` to `disallow` in `app/robots.ts`. A blocked URL
never has its `noindex` tag read, so old URLs would sit in the index. Crawlable
plus `robots: { index: false, follow: true }` is deliberate. See
`docs/ADSENSE_REMEDIATION.md`.

`app/sitemap.ts` lists editorial URLs only (home, `/pt`, `/for`, `/day`, `/vs`,
`/guides`, `/create`, `/explore`, legal). It does not list campaigns or hubs.

---

## Core workflows

### Publish a campaign

1. `/create` (or home **Criar campanha**, which is `/create?name=...`).
2. `PublishTemplateModal` reads `?name=`, `?day=`, `?from=` from the query
   string once on mount.
3. `POST /api/campaigns` inserts the row, hashes the manage key
   (`owner_token_hash`), optionally attaches a signed-in organizer.
4. Rate limit: 12 creates per IP per 10 minutes (`lib/rateLimit.ts`).
5. Publish UI opens WhatsApp. Bookmark `/c/[slug]/manage?k=...`. Do not paste
   `k=` into the group.

Anonymous create is the default. Email on publish is optional recovery.

### Supporter save

1. Open `/c/[slug]`. Locale comes from `resolveSupporterLocale` in
   `lib/i18n/locale.ts`: BR/PT country → Portuguese; **untagged country also
   defaults to Portuguese** (97% of frame uses are Brazil); other tagged
   countries use cookie / Accept-Language.
2. Fit photo. Canvas needs `touchAction: 'none'`.
3. Save via `saveFramedPhoto` / `downloadBlob` + `canShareFiles` share sheet.
   Never a hand-rolled `<a download>`.
4. `POST /api/campaigns/[slug]/use` increments supporters (40/IP/10 min and
   20/IP+slug/10 min). First save can mail the organizer.

Slug changes write `campaign_slug_redirects`. Old `/c/` URLs 301 to the current
slug.

### Organizer login (not OAuth)

Six-digit codes, never magic links. In-app browsers open mailed links in a
different browser, which signs in a tab the organizer is not looking at.

| Step | Route |
|------|--------|
| Request code | `POST /api/auth/code` `{ email }` (always the same success shape) |
| Verify | `POST /api/auth/verify` |
| Session | httpOnly cookie `ollabs_org`, 90 days, token stored hashed |
| Who am I | `GET /api/auth/me` |
| Logout | `POST /api/auth/logout` |
| Recover dashboard | `/recover` + `POST /api/recover` (24h one-time link, only if an email was saved) |

Codes expire in 10 minutes, 5 attempts. Codes and session tokens are hashed.
Plaintext lives in the email and the cookie.

### Hub

Editor `/hub` (login required). Public `/u/[handle]`. Featured campaign Join
goes to `/c/[slug]` and records a click via `POST /api/hub/click`.

Handles: 3–30 chars, `a-z`, digits, hyphens. Reserved names in `lib/hub.ts`.

### Explore

`app/explore/page.tsx` lists public, not-hidden campaigns with a visible frame
and **at least 5 supporters** (inlined `MIN_SUPPORTERS`). Direct `/c` links and
hubs are unaffected. Soft geo boost by `publisher_country`. Revalidate 300s.

Home top campaigns (`HomeExamplesSection`) uses the same floor via
`MIN_SUPPORTERS_TO_DISPLAY` in `lib/frameValidity.ts`. If you change the
threshold, update both. Growth for a brand-new campaign is still WhatsApp in
the first hour, not the grid.

---

## API map

Write paths that change product behaviour. All of these are in `app/api/`.

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/campaigns` | Create. Returns slug + manage key. |
| GET | `/api/campaigns` | Public list helper. |
| GET/PATCH | `/api/campaigns/[slug]` | Public read / owner update. |
| GET | `/api/campaigns/[slug]/manage` | Dashboard payload. `k=` or manage session. |
| POST | `/api/campaigns/[slug]/use` | Save counted. |
| POST | `/api/campaigns/[slug]/view` | View bump, 120/IP/10 min. |
| POST | `/api/campaigns/[slug]/report` | 5 distinct IPs auto-hide (`is_hidden`). |
| POST | `/api/campaigns/[slug]/claim` | Attach to signed-in organizer via owner token. |
| POST | `/api/upload` | Blob client token. |
| GET/PATCH | `/api/organizer/hub` | Hub editor. |
| GET | `/api/organizer/campaigns` | Signed-in Mine list. |
| GET | `/api/cron/zero-supporter` | Every 15 min (`vercel.json`). Claims 20–90 min old zero-supporter campaigns that have an organizer email. |

Rate limiter is an in-memory `Map` per serverless isolate. It blunts a burst on
one instance. It is not a global quota. Do not add Redis until abuse needs it.

---

## Guides (editorial)

Source of truth: `lib/guides.ts` (`GUIDES` array, newest first).

Routed by `app/guides/page.tsx` and `app/guides/[slug]/page.tsx`. Sitemap and
footer pick the array up automatically. Ads on guide pages use `surface="seo"`.

To add a guide:

1. Prepend a `Guide` object to `GUIDES` (slug, dates,  sections, FAQs, CTA).
2. No em dashes in copy. Named author, real publish date, original screenshots
   when you have them (`screenshot` renders as an HTML comment until a file
   exists).
3. Add a bullet to `lib/announcements.ts` (user-visible).
4. Do not invent a second CMS.

Current slugs: `save-framed-photo-on-iphone`, `custom-png-frame-photo-window`,
`read-campaign-dashboard`, `keep-campaign-when-you-switch-phones`,
`run-a-campaign-people-join`, `hub`, `start-a-campaign`.

---

## Email and cron

Only organizers are mailed. Tags in `lib/email.ts`: `campaign_live`,
`first_supporter`, `zero_supporter`, `milestone`, `login_code`, `recover`,
`contact_forward`.

Zero-supporter cron (`vercel.json` `*/15 * * * *`):

- Needs `CRON_SECRET` and `RESEND_API_KEY`.
- Selects public, not-hidden, zero-supporter campaigns with an organizer email,
  created 20–90 minutes ago, not already nudged (`zero_supporter_emailed_at`).
- Claims rows with `FOR UPDATE SKIP LOCKED` so overlapping ticks do not
  double-send.

Inbound: Resend webhook at `/api/webhooks/resend`. Domain `ollabs.studio`.

---

## Schema and migrations

Readable map: `lib/db/schema.ts` (campaigns, slug redirects, day overrides,
uses, reports, recovery tokens, organizers, hub links, login codes, sessions,
manage sessions).

Apply new SQL as the next numbered file under `drizzle/`. Do not invent columns
only in ad-hoc prod queries.

`scripts/apply-migrations.mjs` only lists 0014–0016. Later files (0017
referrer, 0018 zero-supporter, 0019 hub themes, 0020 owner-token hash) are
**not** in that script. Do not run it expecting a full catch-up. Apply missing
files on Neon (SQL editor) or extend the script to include every file after the
last applied migration.

---

## Locale

Not a full i18n framework. Cookie `ollabs_locale` plus dictionaries for create,
publish, and campaign UI (`lib/i18n/`).

- Product UI: `en`, `pt`, `id`, `es`, `tl`.
- Marketing landing that still exists: `/pt` only.
- `/es`, `/id`, `/tl` (and children) 301 to `/` in `next.config.mjs`. Cookie UI
  in those languages still works.
- `/hi` is a noindexed stub.
- Campaign pages default to Portuguese when country is BR/PT **or unset**.

Share paste uses `prefersPortuguese()` in `lib/share.ts` for WhatsApp text.

---

## Admin and moderation

`/admin?key=ADMIN_KEY` (query param; robots disallow `/admin`).

- Reports list, hide/unhide (`POST /api/admin/moderate`).
- Geo breakdown (`GET /api/admin/geo`).
- Day-frame overrides (`/api/admin/day-frames`).

Public report button: 5 distinct reporter IPs sets `is_hidden`, which drops the
campaign from Explore and public lists. WhatsApp `/c` links still work unless
you add a stronger block later.

---

## Common pitfalls

1. **Ads or index on `/c` or `/u`.** Inventory-value policy. Units belong on
   editorial pages only. Do not "gate" campaign ads back on without a product
   change that adds real publisher text.
2. **`disallow: /c` in robots.** Leaves already-indexed URLs stuck. Keep
   crawlable + noindex.
3. **better-auth / OAuth / framer-motion.** Removed. Old planning docs still
   mention them. `package.json` is the check.
4. **Magic-link login.** Will sign in the wrong browser inside WhatsApp.
   Codes only.
5. **Hand-rolled downloads.** iOS in-app browsers ignore them. Use
   `lib/download.ts` and `lib/savePhoto.ts`.
6. **`vh` on modals, `alert()`, missing `touch-action: none`.** See
   `AGENTS.md`. Copy the scroll lock from `PublishTemplateModal.tsx`.
7. **Organizer tab bar on home, `/c`, `/u`, SEO.** `shouldShowMobileOrganizerNav`
   in `lib/mobileNav.ts` already hides these. Home is marketing; do not put
   Mine · Create · Hub back on `/`.
8. **Em dashes** in UI, emails, OG, announcements, SEO, guides. Hard rule.
9. **Second campaign to "fix" art.** Manage has Change the frame. New slugs
   split the group.
10. **Incomplete migration script.** See schema section above.
11. **Sentry in the browser.** `/create` already fights `@imgly`. Client SDK
    stays off (`docs/SENTRY.md`).
12. **Explore as discovery for a brand-new campaign.** Floor is 5 supporters
    (`app/explore/page.tsx` and `MIN_SUPPORTERS_TO_DISPLAY`). Growth is WhatsApp
    in the first hour, not the grid.

---

## Related docs

| Doc | When to open it |
|-----|-----------------|
| `AGENTS.md` | Mobile, ads, copy, nav, commit style |
| `docs/ADSENSE_SLOTS.md` | Slot env names, ads.txt |
| `docs/ADSENSE_REMEDIATION.md` | Why `/c` and `/u` are noindex and ad-free |
| `docs/SENTRY.md` | DSN, sampling, PII scrub |
| `docs/REAL_PHONE_QA.md` | Physical iPhone + WhatsApp checklist |
| `docs/tester-hub-setup.md` | Hub claim walkthrough |
| `.agents/skills/` | Playbooks (save/share, canvas, email, ads, SEO) |
