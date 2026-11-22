# Tech Stack & Integrations Overview

## Core Stack
-   **Framework:** Next.js v16.1.6
-   **Language:** TypeScript v5.9.3
-   **Database:** Neon (Postgres) Serverless
-   **Authentication:** better-auth v1.4.18
-   **Monitoring:** Sentry (@sentry/nextjs) v10.38.0

## Key Integrations & Tools

### 1. Authentication (Better Auth)
-   **Configuration:** `lib/auth.ts`
-   **Database Adapter:** `@neondatabase/serverless` pool.
-   **Potential Conflict Area:**
    -   **Database Schema:** Expects `snake_case` columns (e.g., `expires_at`), but library defaults might drift if not explicitly mapped.
    -   **State Management:** OAuth state cookies vs. database storage.

### 2. Monitoring (Sentry)
-   **Configuration:** `sentry.client.config.ts`, `sentry.server.config.ts`, `next.config.mjs`
-   **Integration:** Wraps the entire Next.js configuration (`withSentryConfig`).
-   **Potential Conflict Area:**
    -   **API Route Wrapping:** Sentry automatically wraps API routes. If `better-auth` handles errors internally (like 500s) before Sentry catches them, you might see vague logs.
    -   **Tunnel Route:** Configured to `/monitoring`. Ensure no other API route collides with this.

### 3. Database (Neon Serverless)
-   **Connection:** `lib/neon.ts` uses `@neondatabase/serverless` Pool.
-   **Potential Conflict Area:**
    -   **Connection Pooling:** Serverless functions (Next.js API routes) can exhaust connections. The `Pool` client is designed to handle this, but heavy traffic might trigger limits.

### 4. File Storage (Vercel Blob)
-   **Configuration:** `app/api/upload/route.ts`
-   **Library:** `@vercel/blob`
-   **Usage:** Handling user uploads (likely avatar frames or images).
-   **Potential Conflict Area:**
    -   **Environment Variables:** Requires `BLOB_READ_WRITE_TOKEN`. If this is missing in Vercel, uploads will fail.
    -   **CORS:** If uploads are client-side (`@vercel/blob/client`), CORS must be configured correctly, though usually Vercel handles this automatically.

### 5. UI & Styling
-   **Styling:** Tailwind CSS v3.4.19 + `tailwindcss-animate`
-   **Components:** `lucide-react` (Icons), `framer-motion` (Animations)
-   **Asset Processing:** `@imgly/background-removal`, `color-thief`, `gif.js`
-   **Conflict Risk:** Low. Mostly client-side.

## Detailed Configuration Files
-   **Next.js + Sentry:** [`next.config.mjs`](./next.config.mjs)
-   **Auth + Database:** [`lib/auth.ts`](./lib/auth.ts)
-   **Database Connection:** [`lib/neon.ts`](./lib/neon.ts)
