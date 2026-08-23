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

1. If `RESEND_API_KEY` is unset, no-op with a warning — do not throw and break create flows.
2. From / reply: `EMAIL_FROM` / `EMAIL_REPLY_TO` (see `AGENTS.md`); keep `ollabs.studio` verified in Resend.
3. Tag sends for dashboard analytics (`campaign_live`, `first_supporter`, etc.).
4. Webhook must verify the **raw** body; avoid retry storms on handler bugs after a valid signature.
5. Optional notify path for inbound `hello@` — never conflate with supporter messaging.

## Dig deeper

`docs/reference/tier-3/resend/`, `docs/reference/tier-3/svix/`
