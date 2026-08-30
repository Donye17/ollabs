# Sentry setup checklist

Server and edge only. There is no `instrumentation-client.ts` on purpose.
`/create` already fights `@imgly` on low-end Android. Shipping the browser SDK
would add client JS to that route. Measured delta on `/create` with the client
SDK omitted: **0 kb gzipped**.

Until `SENTRY_DSN` is set, init is a no-op and nothing is sent.

## Vercel environment variables

Set these on Production (and Preview if you want staging noise):

1. `SENTRY_DSN`  
   From the Sentry project: Settings → Client Keys (DSN). Server and edge read
   this. Do **not** add `NEXT_PUBLIC_SENTRY_DSN`. That would pull the SDK into
   the browser bundle.

2. Optional, only if you later upload source maps: `SENTRY_AUTH_TOKEN`,
   `SENTRY_ORG`, `SENTRY_PROJECT`. Leave them unset for now. Source maps are
   off in `next.config.mjs` (`sourcemaps.deleteSourcemapsAfterUpload` is not
   used; we pass `silent: true` and skip auth).

Redeploy after saving the DSN.

## Confirm it works

1. Temporarily hit a debug route after deploy, or throw in an API handler you
   control. `/api/campaigns/this-slug-does-not-exist-zzzz` returning 404 is not
   enough. Add a one-line `throw new Error('sentry-probe')` in a private API,
   request it, then delete the throw.
2. The event should appear in Sentry Issues within a minute.

## Alert rule that pages you

In Sentry → Alerts → Create Alert:

- **When:** Number of errors  
- **Filter:** `environment:production`  
- **Threshold:** more than **0** unique issues in **1 minute** for a first
  pass during the election window. After 4 October, raise this if it is noisy.
- **Action:** Email you (and SMS/PagerDuty if you have it).  
  Email-only into a dashboard nobody opens is not monitoring.

Also set a second rule:

- **When:** The issue is seen **more than 20 times in 5 minutes**  
- **Action:** same page-out.

Turn off issue emails for `development`.

## PII

`sendDefaultPii` is false. `beforeSend` in `lib/sentryScrub.ts` strips emails,
`data:image` payloads, photo/frame fields, cookies, and Authorization headers.
Supporter photos must never reach Sentry.

## Sampling

`tracesSampleRate` is **0.1** on server and edge. Do not set it to 1 in
production. October traffic will burn quota and add latency for no gain.
