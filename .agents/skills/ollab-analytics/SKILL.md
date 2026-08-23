---
name: ollab-analytics
description: >-
  Ollab event tracking and UTM share links. Use when adding track() calls,
  share attribution, GA4 events, or measuring create/campaign funnels.
---

# Ollab analytics

## Primary API

- `track(name, params?)` and `withUtm(url, source)` in `lib/analytics.ts`.
- `track` wraps `gtag` and no-ops if analytics is not loaded.
- Prefer these helpers over new analytics SDKs unless product explicitly adds one.

## Event hygiene

1. Reuse existing event names when the meaning matches (`create_started`, `create_step`, `photo_uploaded`, `frame_download`, `frame_share`, `campaign_share`, etc.).
2. Include `campaign` slug (or equivalent) on campaign-page events.
3. Outbound share links should use `withUtm(..., platform)` for WhatsApp/Messenger/native attribution.
4. Do not track PII (emails, raw photos, tokens).
5. Vercel Analytics / Speed Insights are complementary — don’t duplicate Web Vitals plumbing without need.

## Dig deeper

`docs/reference/tier-2/ga4/` and call sites in `components/campaign/` + create editor pages
