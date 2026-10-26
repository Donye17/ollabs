---
name: seo-locales
description: >-
  SEO and locale landing work for Ollab: metadata, OG images, sitemaps,
  hreflang, /for /day hubs, Search Console. Use when editing public marketing
  pages, campaign metadata, or crawl/index behavior.
---

# SEO & locales

## Stack facts

- App Router metadata API + sitemap / robots conventions.
- Campaign + day pages use ISR-style revalidate where freshness matters without hammering Neon.
- Product UI: `en` `pt` `id` dictionaries; `es` `tl` overlays. Marketing landings
  for ES/ID/TL 301 to `/`. `/pt` is SEO, not the product UI. `/hi` is a noindex stub.
- `/c` is crawlable + noindex. `/u` indexes when bio ≥ 40 chars (`hubIsIndexable`)
  and those handles are in `app/sitemap.ts`. Do not `disallow` `/c` or `/u`.
- Portuguese editorial: `/pt/guides`, `/pt/day`, `/pt/for`, `/pt/vs/twibbonize`.
  Machine index: `public/llms.txt`.
- No em dashes in user-facing hub/create/mine copy.

## When changing pages

1. Set `generateMetadata` (title, description, openGraph, twitter) for share previews — WhatsApp unfurls decide click-through.
2. Keep OG images accurate to the frame/campaign; use existing OG routes when present.
3. Ensure new public routes appear in the sitemap when they should be indexed.
4. For locale variants, keep hreflang / alternates consistent.
5. `/c` and supporter flows stay lean; put denser SEO content on `/for`, `/day`,
   `/guides`. Indexable hubs need a real bio, not a handle alone. Ads still
   never mount on `/c` or `/u`.

## Dig deeper

`docs/reference/tier-2/search-central/`, `search-console/`, `open-graph/`, `i18n-hreflang/`, plus `docs/reference/tier-1/nextjs/`
