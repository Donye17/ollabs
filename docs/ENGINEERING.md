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
   Optional body `{ imageUrl }` is stored on `campaign_uses` and can show on
   Explore. Any string is accepted today. Day-frame admin already requires a
   Vercel Blob host (`app/api/admin/day-frames`); keep campaign thumbs equally
   strict if you tighten this.

Slug changes write `campaign_slug_redirects`. Old **public** `/c/` URLs 301 to
the current slug. Manage URLs do **not** follow that table. See Manage access.

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

### Manage access (`k=` vs cookie)

The dashboard is `/c/[slug]/manage`. Proof of ownership is the campaign manage
key, not the organizer login cookie (`ollabs_org`).

| Proof | Where | Lifetime |
|-------|--------|----------|
| Plaintext `k=` / `token` | URL, welcome email, sessionStorage `ollabs_manage_k:${slug}` | Forever (hashed at rest as `owner_token_hash`) |
| Cookie `ollabs_manage` | httpOnly, set after a successful `k=` GET | 72 hours (`lib/ownerToken.ts`) |

`ManageClient` strips `k=` from the address bar after the cookie is minted so
screenshots and refreshes do not keep leaking the key. That is why a later
bookmark is often cookie-only.

Lookups in `findCampaignByOwnerToken` and `findCampaignByManageSession` require
the **live** slug. Public `/c/[old]` follows `campaign_slug_redirects`; manage
does not.

Consequences on current `main`:

1. **Welcome-email dashboard after a custom URL.** `lib/email.ts` bakes
   `/c/[slug]/manage?k=` at send time. The dashboard invites a slug rename.
   After rename, the emailed URL 404s even though WhatsApp `/c/[old]` still
   301s.
2. **Change the frame.** Manage links to
   `/create?edit=SLUG&k=TOKEN`. `EditorPage` bails unless both `edit` and `k`
   are present, so a cookie-only visit (empty `k=`) skips bootstrap and
   **publishes a second campaign**. Use sessionStorage or the manage cookie
   (`credentials: 'include'`) if you fix this. Do not teach organizers to
   create a second slug to "fix the art."
3. **PATCH manage** (`frameConfig`, title, slug, `previewUrl`) accepts the
   cookie. Only the Create bootstrap is the gap.

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
| POST | `/api/campaigns` | Create. Returns slug + manage key. `previewUrl` is stored as given (https not required at insert). |
| GET | `/api/campaigns` | Public list helper. No 5-supporter floor (Explore and home apply that). |
| GET | `/api/campaigns/[slug]` | Public read. Hidden/private → 404. No PATCH on this route. |
| GET/PATCH | `/api/campaigns/[slug]/manage` | Dashboard + owner edits. `token` query/body or `ollabs_manage` cookie. Live slug only. |
| POST | `/api/campaigns/[slug]/use` | Save counted. Optional `imageUrl` stored unvalidated. |
| POST | `/api/campaigns/[slug]/view` | View bump, 120/IP/10 min. |
| POST | `/api/campaigns/[slug]/report` | 5 distinct IPs auto-hide **by `campaign_id`**. |
| POST | `/api/campaigns/[slug]/claim` | Attach to signed-in organizer via owner token. |
| POST | `/api/upload` | Blob client token. JPEG/PNG/GIF/WebP, 8 MB. |
| GET/PATCH | `/api/organizer/hub` | Hub editor. |
| GET | `/api/organizer/campaigns` | Signed-in Mine list (includes plaintext `owner_token`). |
| GET | `/api/cron/zero-supporter` | Every 15 min (`vercel.json`). Claims 20–90 min old zero-supporter campaigns that have an organizer email. |
| POST | `/api/admin/moderate` | Hide/unhide. Body `{ key, slug, hidden }` keys off **current slug**. |

Rate limiter is an in-memory `Map` per serverless isolate. It blunts a burst on
one instance. It is not a global quota. Do not add Redis until abuse needs it.

---

## Guides (editorial)

Source of truth: `lib/guides.ts` (`GUIDES` array, newest first).

Routed by `app/guides/page.tsx` and `app/guides/[slug]/page.tsx`. `app/sitemap.ts`
maps the array. Footer links the `/guides` index, not each article. Ads on
guide pages use `surface="seo"`.

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

- Reports list (`GET /api/admin/reports`), hide/unhide (`POST /api/admin/moderate`).
- Geo breakdown (`GET /api/admin/geo`).
- Day-frame overrides (`/api/admin/day-frames`). Override `imageUrl` must match
  `https://[store].public.blob.vercel-storage.com/...`.

Public report button: 5 distinct reporter IPs sets `is_hidden` **on that
`campaign_id`**, which drops the campaign from Explore and public lists.
WhatsApp `/c` links still work unless you add a stronger block later.

Admin hide is a different path. `campaign_reports.slug` is the URL at report
time. After a custom-link rename that string can be missing, or reused by a
new campaign. `GET /api/admin/reports` groups by `r.slug`.
`POST /api/admin/moderate` updates `WHERE slug = $2`. Hide from a stale report
row can 404, or set `is_hidden` on whoever now owns the old name. Public
auto-hide is already by id; admin hide should be too.

---

## Preview, OG, and Explore image URLs

Uploads go through `POST /api/upload` (Vercel Blob). Stored URLs then reappear
as WhatsApp cards and grid thumbs.

| Path | Check today |
|------|-------------|
| Day-frame admin POST | Vercel Blob host regex |
| PATCH `/manage` `previewUrl` | `https://` prefix only |
| POST `/api/campaigns` `previewUrl` | stored as given |
| POST `/use` `imageUrl` | any string |
| Campaign OG (`app/c/[slug]/page.tsx`) | `preview_url` as stored, else `frame_config.imageUrl` if it starts with `https://` |

An off-site `https` URL in `preview_url` or `campaign_uses.image_url` can become
the WhatsApp unfurl or an Explore face. Do not relax the day-frame check. If
you add a shared allowlist, use it on create, manage preview, `/use`, and OG.

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
   in `lib/mobileNav.ts` already hides these. Home is the tool; do not put
   Mine · Create · Hub back on `/`.
8. **Em dashes** in UI, emails, OG, announcements, SEO, guides. Hard rule.
9. **Second campaign to "fix" art.** Manage has Change the frame. Cookie-only
   manage visits currently omit `k=`, so Create may publish a new slug instead.
   See Manage access.
10. **Custom URL then emailed `/manage?k=`.** Public `/c` 301s. Manage lookup
    still requires the live slug.
11. **Admin hide by report-time slug.** Public auto-hide uses `campaign_id`.
    `/api/admin/moderate` uses current slug. See Admin.
12. **Incomplete migration script.** See schema section above.
13. **Sentry in the browser.** `/create` already fights `@imgly`. Client SDK
    stays off (`docs/SENTRY.md`).
14. **Manage keys in Sentry.** `lib/sentryScrub.ts` redacts emails, `data:image`,
    photo/frame fields, cookies, and `Authorization`. It does **not** strip
    `k`, `token`, or `owner_token` from query strings or JSON bodies. Do not
    log those fields. Do not set `sendDefaultPii`.
15. **Explore as discovery for a brand-new campaign.** Floor is 5 supporters
    (`app/explore/page.tsx` and `MIN_SUPPORTERS_TO_DISPLAY`). Growth is WhatsApp
    in the first hour, not the grid.
16. **Off-site preview / Explore thumbs.** Only day-frame admin pins Blob
    hosts. See Preview URLs.

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
