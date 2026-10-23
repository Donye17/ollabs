# Tech stack

Current runtime, verified against `package.json` and source. Older mentions of
better-auth, OAuth, Drizzle-as-query-layer, `framer-motion`, or `gif.js` are
stale. Operational detail: `docs/ENGINEERING.md`.

## Core

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 App Router (`next` ^16.1.6), React 19 |
| Language | TypeScript 5.9 |
| Style | Tailwind CSS 3.4 + `tailwindcss-animate`. Theme tokens only (`brand`, `ink`, `paper`, `cream`, `coral`, `muted`). |
| Icons | `lucide-react`. No framer-motion. |
| Database | Neon serverless Postgres. Connection: `lib/neon.ts` (`@neondatabase/serverless` Pool). |
| Schema | Numbered SQL in `drizzle/*.sql`. `lib/db/schema.ts` is a readable map and is excluded from `tsc` (`drizzle-orm` is not installed). App queries are parameterized SQL. |
| Auth | Custom 6-digit email codes in `lib/auth.ts`. Cookie `ollabs_org`. Supporters never log in. |
| Files | Vercel Blob via `app/api/upload/route.ts` (`@vercel/blob/client`) |
| Email | Resend REST in `lib/email.ts` + Svix webhook `app/api/webhooks/resend/route.ts` |
| Errors | `@sentry/nextjs` server + edge only (`docs/SENTRY.md`) |
| Analytics | Vercel Analytics + Speed Insights; deferred GA (`NEXT_PUBLIC_GA_ID`) |
| Ads | Manual `AdSlot` on SEO pages; `DeferredAdSense` in root layout |

## Config entry points

- Next + Sentry: `next.config.mjs`, `instrumentation.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- Pool: `lib/neon.ts` (requires `DATABASE_URL`)
- Auth: `lib/auth.ts`
- Owner manage key: `lib/ownerToken.ts`
- Env inventory: `docs/ENGINEERING.md`

## Conflict notes that are still true

- Serverless isolates do not share the in-memory rate limiter (`lib/rateLimit.ts`).
- Neon pooling: keep request queries short. Do not hold transactions across waits.
- Sentry tunnel is not used. Source maps are disabled in `next.config.mjs` until `SENTRY_AUTH_TOKEN` exists.
