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
- Marketing default is English (`DEFAULT_LOCALE`). `/pt` is the SEO landing. `/es` `/id` `/tl` 301 to `/`. `/hi` is a noindex stub. Product cookie UI still exists for pt/id/es/tl.
- Campaign pages use `resolveSupporterLocale`. Pass `publisher_country` only (BR/PT or unset → Portuguese). On current `main`, `app/c/[slug]/page.tsx` ORs `first_supporter_country`, so one non-BR first save on an untagged campaign flips `/c` copy to English. Do not use the marketing cookie for `/c` copy.
- `/c` and `/u` are crawlable + noindex. Do not add them to `disallow` in `robots.ts`.
- No em dashes in user-facing hub/create/mine copy.

## When changing pages

1. Set `generateMetadata` (title, description, openGraph, twitter) for share previews — WhatsApp unfurls decide click-through.
2. Keep OG images accurate to the frame/campaign; use existing OG routes when present.
3. Ensure new public routes appear in the sitemap when they should be indexed.
4. For locale variants, keep hreflang / alternates consistent.
5. `/c` and `/u` stay lean and noindex. Put denser SEO content on `/for`, `/day`, `/guides`, `/pt`, `/vs`, not on the save path or public hubs.

## Dig deeper

`docs/reference/tier-2/search-central/`, `search-console/`, `open-graph/`, `i18n-hreflang/`, plus `docs/reference/tier-1/nextjs/`
