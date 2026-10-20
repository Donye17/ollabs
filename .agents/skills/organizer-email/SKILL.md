---
name: organizer-email
description: >-
  Organizer transactional email via Resend and Svix webhooks. Use when editing
  lib/email.ts, /api/webhooks/resend, campaign_live / first_supporter mail, or
  RESEND_* env setup.
---

# Organizer email

## Scope

- Email **organizers only**. Supporters never provide an address and must never be mailed.
- Implementation: `lib/email.ts` (`sendEmail`, `campaignLiveEmail`, `firstSupporterEmail`, `milestoneEmail`, `recoveryEmail`, `loginCodeEmail`).
- Webhook: `app/api/webhooks/resend/route.ts` — Svix verify with `RESEND_WEBHOOK_SECRET`.

## Rules

1. If `RESEND_API_KEY` is unset, no-op with a warning. Do not throw and break create flows.
2. From / reply: `EMAIL_FROM` / `EMAIL_REPLY_TO` (see `AGENTS.md`); keep `ollabs.studio` verified in Resend.
3. Tag sends for dashboard analytics (`campaign_live`, `first_supporter`, etc.).
4. Webhook must verify the **raw** body; avoid retry storms on handler bugs after a valid signature.
5. Optional notify path for inbound `hello@`. Never conflate with supporter messaging.
6. Recovery mail links to `/recover/[token]`. On current `main` the first GET redeems the token and renders `manage?k=` keys. Do not add more one-time GET redeemers. Prefer a confirm POST. See `docs/ENGINEERING.md`.
7. Lifecycle templates are `en` or `pt` only. `campaignMailLang(publisher_country)` returns Portuguese when country is missing or BR/PT. Create, first-supporter, milestone, and zero-supporter cron pass publisher country. Login codes use cookie + Accept-Language instead (`pt` or `en`). Do not add ID/ES/TL mail without templates.

## Dig deeper

`docs/ENGINEERING.md`, `docs/reference/tier-3/resend/`, `docs/reference/tier-3/svix/`
