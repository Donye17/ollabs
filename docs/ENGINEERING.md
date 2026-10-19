# Engineering handbook

Developer-facing map of how Ollabs actually works. Prefer this over older
planning docs (`TECH_STACK.md`, `INTEGRATIONS.md`, `PROJECT_REPORT.md`) when
they disagree with the code. Verified against `main` at `9e89b92` (2026-10-19).
`main` moved on 2026-10-17 and 2026-10-18 (product i18n, share caption, hero
fan, organizer mail language). `/c` locale still uses
`publisher_country || first_supporter_country`. Custom-frame publish can
still store a blank cream-circle `preview_url`. See Locale and Preview URLs.

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
preview, one name field, and **Create a campaign**. Beside that,
`components/home/HeroFrameFan.tsx` draws three premade frames
(`frame-emerald`, `frame-ollabs-blue`, `frame-sunset-gradient`) through the
same renderer as a campaign. Photos come only from `/hero/photo-01.jpg` …
`photo-10.jpg`. One slot crossfades every 3.5s; the other two hold. Marketing
HTML defaults to English (`DEFAULT_LOCALE`). The Portuguese headline is
**Reúna sua galera.** Colour rings live on `/create`, not home. Campaign
pages stay Portuguese-first. See Locale.

---

## Stack (verified against `package.json`)

| Layer | What we use |
|-------|-------------|
| App | Next.js 16 App Router, React 19, TypeScript |
| Style | Tailwind CSS 3.4 (not v4), tokens `brand` `ink` `paper` `cream` `coral` `muted` |
| Data | Neon serverless Postgres via `@neondatabase/serverless` `Pool` in `lib/neon.ts` |
| Queries | Raw SQL. `lib/db/schema.ts` is a readable table map. It is excluded from `tsc` because `drizzle-orm` is not a dependency. |
| Migrations | Numbered files in `drizzle/*.sql` (currently through `0021_share_caption.sql`). Those files are the schema authority. |
| Files | Vercel Blob, client upload token from `POST /api/upload` (JPEG/PNG/GIF/WebP, 8 MB) |
| Auth | Custom 6-digit email codes (`lib/auth.ts`). **Not** better-auth. Social OAuth was removed in migration 0008. |
| Email | Resend REST from `lib/email.ts` (no SDK). Organizers only. |
| Errors | Sentry server + edge only (`docs/SENTRY.md`). No browser SDK. |
| Ads | Manual `AdSlot` on SEO pages. `DeferredAdSense` in root layout. |
| Lint | `npm run lint` is `eslint .` (`eslint.config.mjs`). Next 16 dropped `next lint`. Ignores `_to_delete`, `_parked`, `.agents`, `lib/db/schema.ts`. Turns off `react-hooks/set-state-in-effect` and `react-hooks/purity`. |

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

`npm run lint` runs ESLint across the app. It is not `next lint`.

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

## Caching (ISR)

| Page | `revalidate` |
|------|----------------|
| `/c/[slug]` `/u/[handle]` | 60s |
| `/explore` | 300s |
| `/` | 600s |
| `/day/[slug]` | 3600s |
| `/for`, `/guides/[slug]` | 86400s |

Campaign HTML is cached **per slug**. A custom-link rename does not purge
`/c/[old]`. For up to 60s that path can still be a 200 with the old slug in
`CampaignClient`, which is how `/use` 404s after the row moved. Day-frame
admin already calls `revalidatePath`; manage slug PATCH does not. Do not drop
ISR on `/c` to "fix" counts (Neon compute). Follow redirects on the write
APIs instead.

---

## Core workflows

### Publish a campaign

1. `/create` (or home **Create a campaign**, which is `/create?name=...`).
   First visit opens the colour-ring accordion (`simpleStylesOpen` defaults
   true). Collapsing writes `localStorage` key `ollabs_simple_styles_open=0`
   so a later visit stays collapsed. Starter packs follow the UI locale
   (`FrameSelector` `defaultPackId`: `pt→br`, `id→id`, `tl→ph`, `es→mx`,
   else rings). Arriving with `?from=` starts a blank frame on purpose.
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
   `lib/i18n/locale.ts`. The resolver is Portuguese-first for BR/PT **or a
   missing country**. On current `main` the page does not pass
   `publisher_country` alone. See Locale and pitfall 24.
2. Fit photo. Canvas needs `touchAction: 'none'`.
3. Save via `saveFramedPhoto` / `downloadBlob` + `canShareFiles` share sheet.
   Never a hand-rolled `<a download>`.
4. `recordSupporterUse` in `CampaignClient` then counts the join. On current
   `main` it **awaits** `uploadExploreThumb` (Vercel Blob) **before**
   `POST /api/campaigns/[slug]/use`. The post-save path opens WhatsApp
   immediately. Leaving during that upload drops the count (photo still saved
   locally). See pitfall 21.
5. After save, the page shows the paste caption and a full-width **make your
   own** link to `/create?from=SLUG`. If `count > 0` and there is no goal, a
   sentence above the photo button uses `alreadyUsedOne` / `alreadyUsedMany`.
6. `POST /api/campaigns/[slug]/use` increments supporters (40/IP/10 min and
   20/IP+slug/10 min). First save can mail the organizer.
   Optional body `{ imageUrl }` is stored on `campaign_uses` and can show on
   Explore. Any string is accepted today. Day-frame admin already requires a
   Vercel Blob host (`app/api/admin/day-frames`); keep campaign thumbs equally
   strict if you tighten this.

### Share paste (link first)

`supporterShareText` in `lib/share.ts` always returns `${url}\n${line}`.
WhatsApp can preview a bare URL, and a file share often drops the caption, so
the sentence has to be pasted as a second message. `whatsappUrl()` will not
append the campaign URL again if the body already contains it.

Default second line is first-person
(`I just joined {title}, add the frame to your photo (via Ollabs)`),
resolved by `shareLocale()` (`en|pt|id|es|tl`). Prefer an explicit UI locale;
otherwise browser heuristics (`prefersPortuguese` and siblings).

Organizers can replace only that second line. Column `campaigns.share_caption`
(migration `0021_share_caption.sql`). Manage GET returns it; PATCH
`shareCaption` trims whitespace, caps at 180 chars, stores `null` if empty.
If the custom line does not already mention Ollabs, the helper appends
` (via Ollabs)`. The URL is never stored in the column and cannot be dropped
by a caption. `lib/guides.ts` still describes the older one-line paste. Do
not copy that wording into new share UI.

Organizer publish paste (`organizerShareText`) is a different string: no URL
in the body. `whatsappUrl` appends the link there. X, Facebook, and QR sit
behind **more ways to share** on the publish screen.

Slug changes write `campaign_slug_redirects`. Old **public** `/c/` URLs then
hit `redirect()` (307 Temporary, despite the "Permanent" comment in the page).
Manage URLs do **not** follow that table. Public write APIs also do not. See
Manage access and Public writes ignore redirects.

Public `/c/[slug]` looks up a **live** campaign first (`getCampaign`), then
the redirect table. Manage PATCH, when taking a new slug, currently:

```
DELETE FROM campaign_slug_redirects WHERE old_slug = $newSlug
INSERT INTO campaign_slug_redirects (old_slug, campaign_id) VALUES ($oldSlug, $id)
```

Live-slug uniqueness is a 409 (`23505`). Redirect occupancy is not. Campaign A
at `save-the-whales` can rename to `whales-2026` (redirect remains). Campaign B
can then rename onto `save-the-whales`; the DELETE drops A's redirect, and
anyone still opening A's previous custom link gets B's frame. Treat another
campaign's redirect as a taken name. Only drop a self-redirect when taking a
name back. Keep the rename and redirect writes in one transaction (today the
slug UPDATE commits even if the redirect write fails).

### Public writes ignore redirects

The HTML page follows redirects. These four routes do **not**. Each keys
`campaigns.slug` only:

| Method | Path | What a miss does |
|--------|------|------------------|
| GET | `/api/campaigns/[slug]` | 404 JSON |
| POST | `/api/campaigns/[slug]/use` | Save not counted. First-supporter and milestone mail skipped. |
| POST | `/api/campaigns/[slug]/view` | View not counted. Also does not check `is_hidden` (unlike `/use`). |
| POST | `/api/campaigns/[slug]/report` | Report 404s. Auto-hide never sees that tap. |

`CampaignClient` posts with the `slug` prop, which is `campaign.slug` from the
page query (`app/c/[slug]/page.tsx`). After a custom-link rename that value is
the old name in two common cases:

1. **ISR.** `export const revalidate = 60`. For up to a minute, `/c/[old]` can
   still serve the pre-rename HTML. The client then POSTs `/use` with the old
   slug and gets 404.
2. **Open tab.** A supporter who loaded the page before the rename keeps the
   old slug in memory for that session.

The framed PNG still downloads locally (`saveFramedPhoto` / share sheet). The
organizer sees no join. `recordSupporterUse` sets `countedRef` **before** the
fetch. A 404 is `res.ok === false` and does not throw, so the `catch` that
resets the guard never runs. A retry in that tab is skipped.

Publish already pastes the original `/c/[slug]` into WhatsApp. Setting a custom
link on manage is a common next step. Median first supporter is 4.5 minutes, so
this lands in the first-hour window. The 20–90 minute zero-supporter cron can
still fire because `supporter_count` stayed 0.

The page comment says old URLs 301. The call is `redirect()` from
`next/navigation`, which is **307 Temporary**. WhatsApp and search may keep the
original path. `permanentRedirect()` is 308 if you want them to retire it.

When you fix this, resolve public writes through the same live-slug-then-
redirect lookup the page uses. Put the **live** slug on first-supporter and
milestone emails (the request slug may be the old one). Reset `countedRef` when
`/use` is not accepted. Do not treat an unmerged helper as shipped.

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

### Email recovery (GET burns the token)

`POST /api/recover` always returns the same success shape. It inserts a 64-hex
token (`campaign_recovery_tokens`, 24h) and mails `${SITE}/recover/${token}`.

On current `main`, `GET /recover/[token]` **redeems on first fetch**.
`redeem()` in `app/recover/[token]/page.tsx` sets `used_at` before render.
The same HTML lists every campaign dashboard as `/c/[slug]/manage?k=...`.

Outlook Safe Links, Slack unfurls, and WhatsApp previews GET the mailed URL
before the organizer taps it. That first fetch marks the token used, so the
real click lands on "This link has expired." The scanner also receives the
manage keys in the response body. Requesting a new email repeats the loop for
Safe Links users.

There is no confirm POST on `main`. A durable fix is GET as a confirm screen
and redeem on a user gesture (the recovery mail already says "Open my
campaigns"). Do not keep rendering `k=` into the first GET.

### Hub

Editor `/hub` (login required). Public `/u/[handle]`. Featured campaign Join
goes to `/c/[slug]` and records a click via `POST /api/hub/click`.

Handles: 3–30 chars, `a-z`, digits, hyphens. Reserved names in `lib/hub.ts`.

**Publish can overwrite a claimed handle if hub GET has not returned.**
`claimHubForCampaign` sends `handle` only when `existingHandle` is empty
(comment in `PublishTemplateModal`: re-claiming would overwrite a custom
handle). Once `/api/organizer/hub` has returned a handle, later claims only
update the featured campaign. The race remains: `hubHandle` starts `null`,
and Create can submit while that GET is in flight or failed. Home pre-fills
the campaign name, so a signed-in organizer with `/u/coolbrand` in an
Instagram bio can still have that handle replaced by an email local-part
suggestion (`john`). Featured-campaign save still succeeds.

When you fix this, keep `/hub` rename as `handle`. Publish should claim only
when empty (`COALESCE` / a `claimHandle` field), and must not block campaign
create if the suggested handle is taken.

**Save wipes link tap counts.** `HubEditorClient.save` always sends the full
`links` array (title + url only, no ids), including bio / theme / handle
edits. Hub PATCH then `DELETE FROM organizer_hub_links` and inserts new rows,
so `click_count` resets to 0 and UUIDs change. A public `/u` tab that was
already open posts later taps at deleted ids. See pitfall 22.

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
   opens (307, then live slug). Public `/use` on the old slug still 404s.
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

Write paths that change product behaviour. Pages called out when they are the
interface (recovery). The rest live under `app/api/`.

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/campaigns` | Create. Returns slug + manage key. `previewUrl` is stored as given (https not required at insert). |
| GET | `/api/campaigns` | Public list helper. No 5-supporter floor (Explore and home apply that). |
| GET | `/api/campaigns/[slug]` | Public read. Hidden/private → 404. Live slug only (no redirect follow). No PATCH on this route. |
| GET/PATCH | `/api/campaigns/[slug]/manage` | Dashboard + owner edits. `token` query/body or `ollabs_manage` cookie. Live slug only. PATCH `shareCaption` writes `share_caption` (trim, 180 chars, empty → null). Slug PATCH deletes any redirect row for the target name (see slug occupancy). |
| POST | `/api/campaigns/[slug]/use` | Save counted. Optional `imageUrl` stored unvalidated. Live slug only. 404 after custom-link rename if the client still has the old slug. See Public writes. |
| POST | `/api/campaigns/[slug]/view` | View bump, 120/IP/10 min. Live slug only. `is_public` required; `is_hidden` is not checked. |
| POST | `/api/campaigns/[slug]/report` | 5 distinct IPs auto-hide **by `campaign_id`**. Live slug only to find the row. |
| POST | `/api/campaigns/[slug]/claim` | Attach to signed-in organizer via owner token. |
| POST | `/api/upload` | Blob client token. JPEG/PNG/GIF/WebP, 8 MB. |
| GET/PATCH | `/api/organizer/hub` | Hub editor. PATCH `handle` always overwrites. Publish auto-claim uses this path. When `links` is sent, rows are deleted and reinserted (click counts reset). |
| POST | `/api/recover` | Start recovery. Generic success even if the email has no campaigns. |
| GET | `/recover/[token]` | Page, not API. Redeems the one-time token on GET and renders `manage?k=` links. |
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

Share-paste wording in those articles still describes a single sentence that
contains `{link} (via Ollabs)`. Live paste is link-first plus an optional
Manage caption. Update the guide body when you next edit that article; do
not treat `lib/guides.ts` as the share-contract.

---

## Email and cron

Only organizers are mailed. Tags in `lib/email.ts`: `campaign_live`,
`first_supporter`, `zero_supporter`, `milestone`, `login_code`, `recover`,
`contact_forward`.

Lifecycle mail is English or Portuguese only (`MailLang`).
`campaignMailLang(publisher_country)` returns `'pt'` when country is missing
or BR/PT, otherwise `'en'`. Create, first-supporter, milestone, and
zero-supporter cron all pass **publisher** country, not first-supporter
country. Template default is also `'pt'` if a caller omits `lang`. There are
no ID/ES/TL email templates.

Login-code mail is different: `POST /api/auth/code` uses `resolveLocale`
(cookie + Accept-Language) and sends Portuguese only when that locale is
`pt`. Recovery mail still defaults to Portuguese unless a caller passes
`lang`.

Zero-supporter cron (`vercel.json` `*/15 * * * *`):

- Needs `CRON_SECRET` and `RESEND_API_KEY`.
- Selects public, not-hidden, zero-supporter campaigns with an organizer email,
  created 20–90 minutes ago, not already nudged (`zero_supporter_emailed_at`).
- Claims rows with `FOR UPDATE SKIP LOCKED` so overlapping ticks do not
  double-send.
- A custom-link rename in the first hour can leave `supporter_count` at 0 even
  after real saves (`/use` 404). The cron then mails "nobody joined." See
  Public writes ignore redirects.

First-supporter and milestone mail in `POST /use` pass the **request** slug into
`lib/email.ts`. If you later follow redirects on `/use`, switch those to the
live `campaigns.slug` or manage links in the email 404.

Inbound: Resend webhook at `/api/webhooks/resend`. Domain `ollabs.studio`.

---

## Schema and migrations

Readable map: `lib/db/schema.ts` (campaigns, slug redirects, day overrides,
uses, reports, recovery tokens, organizers, hub links, login codes, sessions,
manage sessions).

Apply new SQL as the next numbered file under `drizzle/`. Do not invent columns
only in ad-hoc prod queries.

`scripts/apply-migrations.mjs` only lists 0014–0016. Later files (0017
referrer, 0018 zero-supporter, 0019 hub themes, 0020 owner-token hash, 0021
share caption) are **not** in that script. Do not run it expecting a full
catch-up. Apply missing files on Neon (SQL editor) or extend the script to
include every file after the last applied migration. Production already has
the Oct 2026 columns if share captions save; a fresh database does not get
`share_caption` from this script.

---

## Locale

Not a full i18n framework. Cookie `ollabs_locale` plus dictionaries
(`lib/i18n/messages.ts`, overlays in `lib/i18n/localeOverlays.ts`). Two
resolvers on purpose. Do not collapse them.

### Marketing (`/`, create chrome, NavBar)

`LocaleProvider` starts at `DEFAULT_LOCALE` (`en`). After hydrate it reads
cookie, then `navigator.languages` (`resolveLocale` in `lib/i18n/locale.ts`).
Crawlers and first HTML are English. `x-default` and home canonical are
`https://ollabs.studio`.

- Home copy (`HomeHero`, `HomeLiveDemo`, `HomeHowItWorks`,
  `HomeMarketingCopy`, `HomeExamplesCopy`, FAQ) follows that locale.
- `LocaleSwitch` (EN | PT) sits on the home nav. Portuguese on `/` stays on
  `/`. English from `/pt` goes home. `/pt` is the SEO landing, not the product
  UI (`SetLocale` in `app/pt/layout.tsx`).
- Language banner is a soft offer. It never hard-redirects (WhatsApp
  WebViews). An explicit English cookie is not overridden. Hindi still opens
  `/hi`. Spanish, Indonesian, and Tagalog set the cookie and stay on the page.
- SSR of `/` does not read `Accept-Language` (home `revalidate = 600`). A
  `pt-BR` browser switches copy after hydrate unless the cookie is already
  `en`.

### Campaign pages (`/c/[slug]`)

`resolveSupporterLocale` in `lib/i18n/locale.ts` takes a `campaignCountry`
string. The function itself:

1. BR or PT → Portuguese, even if WhatsApp reports English.
2. Falsy / missing → Portuguese. 97% of frame uses are Brazil, and most
   live campaigns were never tagged.
3. Any other ISO code → cookie / `navigator` via `resolveLocale`.

The **caller** on current `main` is not publisher-only. `campaignCountry()` in
`app/c/[slug]/page.tsx` is `publisher_country || first_supporter_country`.
That value is passed into `generateMetadata` and `CampaignClient`.

| Column | Written when | Job |
|--------|--------------|-----|
| `publisher_country` | `POST /api/campaigns` via `publisherCountry(request)` (`x-vercel-ip-country`) | Organizer tag. Nullable in local dev and some proxies (migration 0014). |
| `first_supporter_country` | First `POST /use` when `prevCount === 0` | Stats. Time-to-first by market (migration 0015). Admin geo also groups on it. |

If `publisher_country` is null and the first save is from a non-BR IP
(organizer testing from the US, a VPN, a preview), the stats column becomes
the locale tag. Step 3 then runs. Later WhatsApp visitors see English chrome
on an untagged Brazilian campaign. Cookie never overrides (1) or (2), but it
never sees (2) once that column is `US`.

Pass `publisher_country` only into `resolveSupporterLocale`. Do not document
unmerged PR #18 as shipped.

Cookie never overrides (1) or (2) when the country argument is actually
publisher-only. A supporter in WhatsApp should not inherit an organizer's
English cookie from a previous visit on the same phone. `CampaignClient`
passes `languages: [browserLocale]` from `LocaleProvider`; untagged and
Brazilian campaigns ignore that **only if** `campaignCountry` stayed empty or
BR/PT.

ISR caches campaign HTML per slug (`revalidate = 60`). The page does **not**
read `Accept-Language` on the server. Doing so would make every `/c` page
dynamic.

Product UI dictionaries are full for `en`, `pt`, `id` (`lib/i18n/messages.ts`).
`es` and `tl` are `applyLocaleOverlay(en, locale)` from
`lib/i18n/localeOverlays.ts` (deep partial over English). Marketing landings
for those locales 301 to `/` in `next.config.mjs`. `/hi` is a noindexed stub.

Organizer chrome shipped 2026-10-17 follows the visitor cookie: Mine, manage,
Explore, footer, create tools, mobile tab bar, and phone `NavBar` short
labels (`chromeTitle`). `LocaleSwitch` is still **EN | PT** only. ES / ID /
TL arrive through `LanguageBanner` writing the cookie.

Server `generateMetadata` on organizer pages uses `requestLocale()`
(`lib/i18n/requestLocale.ts`): **cookie only**. Crawlers without a cookie
stay English. Home ISR (`revalidate = 600`) still does not read
Accept-Language.

Share paste uses `shareLocale()` in `lib/share.ts` (`en|pt|id|es|tl`), not
only `prefersPortuguese()`. Prefer the UI locale when one is set.

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
| Explore / home podium (`CampaignGridThumb`) | live `frame_config`, never `preview_url` |
| Hub public featured + list (`HubPublicView`) | `preview_url` as stored |

An off-site `https` URL in `preview_url` or `campaign_uses.image_url` can become
the WhatsApp unfurl or an Explore face. Do not relax the day-frame check. If
you add a shared allowlist, use it on create, manage preview, `/use`, and OG.

### Empty-donut share snapshot (current `main`)

Create and Change the frame snapshot the editor canvas 500 ms after
`selectedFrame` (or pan/zoom) changes (`Editor.tsx`). That PNG is uploaded as
`previewUrl` on `POST /api/campaigns` and manage PATCH.

Custom overlay decode is asynchronous. `useEditorLogic` bumps `textureVersion`
when the PNG loads, and `CanvasArea` repaints the live circle via `imgTick`.
The snapshot effect does **not** list `textureVersion`. Sequence on current
`main`:

1. Organizer uploads a custom PNG. `selectedFrame` changes. Canvas fill is
   cream (`CanvasArea` path fill) and `ImageFrameRenderer` returns early while
   `!img.complete`.
2. 500 ms later the snapshot captures that cream circle (optionally with the
   demo photo, no overlay).
3. Overlay `onload` fires. Live canvas shows the art. `textureVersion` and
   `imgTick` bump. Snapshot does not run again.
4. Organizer publishes without panning. `PublishTemplateModal` uploads the
   stale `previewDataUrl`.

Campaign OG prefers `preview_url` over `frame_config.imageUrl`. The comment in
`app/c/[slug]/page.tsx` treats a stored composite as trustworthy so WhatsApp
unfurls a face. That is the opposite of this race: the first-hour card (median
first supporter is 4.5 minutes) is the empty donut. Hub public cards use the
same column. Explore already ignores it and draws live.

`toDataURL` is not wrapped. A tainted canvas (cross-origin overlay without
CORS) throws inside the timeout and never updates `previewDataUrl`. If that
leaves the field null, OG falls back to the overlay URL, which is the better
card. Swallow the throw and keep the last good snapshot; do not let it kill
publish.

Do not document unmerged PR #20 as shipped. Include `textureVersion` in the
snapshot deps. Do not assume the live canvas equals `preview_url`.

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
10. **Custom URL then emailed `/manage?k=`.** Public `/c` still opens (307).
    Manage lookup still requires the live slug. Public `/use` on the old slug
    404s (pitfall 20).
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
17. **Recovery email preview.** `GET /recover/[token]` marks the token used and
    dumps dashboard keys into HTML. Safe Links / unfurls burn the link. See
    Email recovery.
18. **Custom-link hijack.** Taking a name that is only a redirect (not a live
    slug) sends still-shared WhatsApp links to the new campaign. See slug
    occupancy under Supporter save.
19. **Publish overwrites `/u/[handle]`.** If hub GET has not returned,
    auto-claim sends `handle` and PATCH replaces a custom bio URL. Claim from
    `/hub` after publish, or wait for the handle to show in the modal, until
    publish uses a non-overwriting claim.
20. **Custom-link rename then silent `/use` 404.** Public `/c/[old]` still
    opens (ISR or 307), but `/use` `/view` `/report` and GET `[slug]` key the
    live slug only. The photo saves; the count does not. `countedRef` latches
    on 404. See Public writes vs redirects.
21. **Explore thumb before `/use`.** `recordSupporterUse` sets `countedRef`,
    then awaits `uploadExploreThumb` (two rAF + Blob upload), then POSTs
    `/use`. The intended last mile is Save then WhatsApp. Navigating away
    during the upload never increments `supporter_count`, so Explore stays
    below the 5-supporter floor and first-supporter mail never fires. HTTP
    404 does not throw, so the guard never resets (pitfall 20). Network
    throws do reset it. Count first (`keepalive`) and attach the thumb
    afterwards. Do not document unmerged PR #15 as shipped.
22. **Hub save resets link tap counts.** Every editor save sends `links`
    without ids. PATCH deletes the organizer's rows and inserts new ones, so
    `click_count` returns to 0 and public `/u` taps miss. Update owned rows
    in place when the list is unchanged. Do not document unmerged PR #16 as
    shipped.
23. **English campaign chrome on a Brazilian `/c`.** Do not feed
    `resolveLocale` (cookie / browser) into campaign copy. Use
    `resolveSupporterLocale`. WhatsApp's in-app browser often reports
    English. The 2026-09-21 split is: marketing English-default, campaigns
    Portuguese-first.
24. **First save stamps locale on untagged campaigns.** `campaignCountry()`
    ORs `first_supporter_country` into the locale resolver. That column is
    stats, written on the first `/use`. One US test download on a campaign
    with no `publisher_country` flips every later visitor to English
    (WhatsApp reports English, so step 3 of the resolver wins). Keep locale
    on `publisher_country` only. Do not document unmerged PR #18 as shipped.
25. **Custom-frame publish stores a blank cream-circle `preview_url`.** Overlay
    decode finishes after `selectedFrame` already changed, so the 500 ms
    snapshot never re-runs. WhatsApp OG and hub cards prefer that column over
    the real overlay URL. Explore is already live-rendered. See Preview URLs.
    Do not document unmerged PR #20 as shipped.
26. **Share caption is the second line only.** `share_caption` never stores
    the URL. `supporterShareText` always puts the campaign link on line one
    and appends ` (via Ollabs)` unless the custom line already mentions
    Ollabs. Do not put the URL in the Manage textarea or drop `(via Ollabs)`
    in new default copy. Migration `0021` is not in
    `scripts/apply-migrations.mjs`.
27. **Organizer mail language is publisher-country, not the UI cookie.**
    Untagged and BR/PT campaigns get Portuguese templates. A US-tagged
    campaign gets English even if the organizer's cookie is `pt`. Login codes
    follow cookie / Accept-Language instead. There is no ID/ES/TL mail.

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
