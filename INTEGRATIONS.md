# Integrations and environment

How to stand the stack up. Values stay in the Vercel dashboard (and `.env.local`).
Do not commit secrets. Architecture and pitfalls: `docs/ENGINEERING.md`.

## 1. Vercel environment variables

### Database and files

| Name | Where it comes from |
|------|---------------------|
| `DATABASE_URL` | Neon. Required. App throws at import without it. |
| `BLOB_READ_WRITE_TOKEN` | Vercel → Storage → Blob |

### Organizer email (Resend)

Verified domain: `ollabs.studio`.

| Name | Purpose |
|------|---------|
| `RESEND_API_KEY` | Outbound. If missing, mail no-ops in `lib/email.ts` (local/preview still boot). |
| `EMAIL_FROM` | Optional. Default `Ollabs <hello@ollabs.studio>` |
| `EMAIL_REPLY_TO` | Optional. Default `hello@ollabs.studio` |
| `RESEND_WEBHOOK_SECRET` | `POST /api/webhooks/resend` (Svix) |
| `CONTACT_NOTIFY_EMAIL` | Optional. Forwards inbound Receiving mail. |
| `NEXT_PUBLIC_SITE_URL` | Links inside emails. Default `https://ollabs.studio` |

There is **no** Google / Discord / Twitter OAuth. Organizer login is a 6-digit
code mailed to the address they type (`POST /api/auth/code`). Redirect URI
checklists for social providers do not apply.

### Cron, admin, Sentry, ads

| Name | Purpose |
|------|---------|
| `CRON_SECRET` | `GET /api/cron/zero-supporter` every 15 minutes (`vercel.json`). Vercel sends `Authorization: Bearer`. |
| `ADMIN_KEY` | `/admin?key=...` and `/api/admin/*`. An empty key never authenticates. |
| `SENTRY_DSN` | Server/edge only. Do not set `NEXT_PUBLIC_SENTRY_DSN`. Checklist: `docs/SENTRY.md`. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Publisher id / meta |
| `NEXT_PUBLIC_ADSENSE_SLOT_SEO` | SEO units. Campaign slot env is unused. |
| `NEXT_PUBLIC_GA_ID` | Deferred GA |

Keep AdSense Auto ads / anchors / vignettes off. Slot notes: `docs/ADSENSE_SLOTS.md`.

## 2. Vercel product toggles

- Web Analytics and Speed Insights: enable in the Vercel project if they are not already on.
- Cron: `vercel.json` already declares `/api/cron/zero-supporter`. It still needs `CRON_SECRET`.

## 3. Admin

Moderation, geo, and day-frame overrides live at `/admin`. Pass the same
`ADMIN_KEY` as the `key` query param. Robots disallow `/admin`. Do not bookmark
that URL in a shared doc.

## 4. Local

```bash
# .env.local: DATABASE_URL at minimum. Blob + Resend when you exercise upload or mail.
npm install
npm run dev
```

Migrations: numbered files in `drizzle/`. `scripts/apply-migrations.mjs` only
covers 0014–0016. Apply later files on Neon or extend the script. See
`docs/ENGINEERING.md`.
