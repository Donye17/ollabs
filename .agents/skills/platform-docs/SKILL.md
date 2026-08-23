---
name: platform-docs
description: >-
  Use saved Ollab platform documentation under docs/reference when working on
  Next.js, React, Tailwind v3, Vercel, Neon, Drizzle, mobile share/download,
  SEO/Search Console, AdSense, GA4, Open Graph, Resend, Svix, Sentry,
  accessibility, Web Vitals, canvas framing, optional Google/share tooling,
  or Cursor rules/skills/MCP/agent/CLI behavior.
---

# Platform docs

Before inventing APIs or SEO/ad behavior, read the local reference tree:

- Index: `docs/reference/INDEX.md`
- Cursor `@Docs` URL list: `docs/reference/CURSOR_DOCS.md`

## Tier map

| Need | Open |
| --- | --- |
| App Router, metadata, sitemap, ISR, i18n routing | `docs/reference/tier-1/nextjs/` |
| React 19 / RSC / compiler | `docs/reference/tier-1/react/` |
| Tailwind utilities (v3 only) | `docs/reference/tier-1/tailwind/` |
| Deploy, env, Analytics, Speed Insights | `docs/reference/tier-1/vercel/` |
| Neon serverless / pooling | `docs/reference/tier-1/neon/` |
| Schema, migrations, queries | `docs/reference/tier-1/drizzle/` |
| Share sheet, download, touch-action, dvh, safe-area | `docs/reference/tier-1/mdn-mobile/` |
| SEO crawl/index, sitemaps, snippets | `docs/reference/tier-2/search-central/` |
| Search Console | `docs/reference/tier-2/search-console/` |
| Ads | `docs/reference/tier-2/adsense/OLLABS.md` first |
| Analytics events | `docs/reference/tier-2/ga4/` + existing `lib/analytics` |
| Social link previews | `docs/reference/tier-2/open-graph/` |
| hreflang / locale landings | `docs/reference/tier-2/i18n-hreflang/` |
| Frame/image uploads | `docs/reference/tier-3/vercel-blob/` |
| Organizer email | `docs/reference/tier-3/resend/` + `tier-3/svix/` |
| Error monitoring | `docs/reference/tier-3/sentry/` |
| A11y / touch / vitals / canvas | `docs/reference/tier-4/` |
| GTM, GSI, reCAPTCHA, PSI, Fonts | `docs/reference/tier-5/` only if needed |
| WhatsApp / Meta share / Onlook / Radix / Lucide | `docs/reference/tier-7/` |
| Cursor rules, skills, MCP, agent modes, CLI | `docs/reference/cursor/` (start with `README.md` / `llms-index.md`) |

## Hard project facts

- Tailwind **v3.4**, not v4 syntax.
- Mobile WhatsApp/Instagram in-app browsers: use `saveFramedPhoto` / `downloadBlob` + `canShareFiles`; share-first on iPhone.
- Draggable canvases need `touchAction: 'none'`.
- Modals use `dvh`, never `vh`. No `alert()`.
- AdSense: manual slots only; never on photo or `/create`.

## Playbook skills (prefer these over dumping docs)

| Task | Skill |
| --- | --- |
| Save/share on phones | `mobile-share-download` |
| Ad placement | `adsense-quiet` |
| SEO / locales / OG | `seo-locales` |
| Schema / migrations | `drizzle-neon` |
| Frame editor canvas | `campaign-canvas` |
| Resend / webhooks | `organizer-email` |
| `track` / UTM | `ollab-analytics` |

Prefer `llms-index.md` files when choosing which deep page to open next.
