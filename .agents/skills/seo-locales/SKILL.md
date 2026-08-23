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
- Locales in play: PT, ID, TL, HI, ES landings and localized `/for` where they exist.
- No em dashes in user-facing hub/create/mine copy.

## When changing pages

1. Set `generateMetadata` (title, description, openGraph, twitter) for share previews — WhatsApp unfurls decide click-through.
2. Keep OG images accurate to the frame/campaign; use existing OG routes when present.
3. Ensure new public routes appear in the sitemap when they should be indexed.
4. For locale variants, keep hreflang / alternates consistent.
5. `/c` and supporter flows stay lean; put denser SEO content on `/for`, `/day`, hubs — not on the save path.

## Dig deeper

`docs/reference/tier-2/search-central/`, `search-console/`, `open-graph/`, `i18n-hreflang/`, plus `docs/reference/tier-1/nextjs/`
