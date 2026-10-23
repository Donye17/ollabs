---
name: drizzle-neon
description: >-
  Drizzle schema and migrations on Neon serverless for Ollab. Use when changing
  lib/db/schema, drizzle/*.sql, queries, or DATABASE_URL / pool usage.
---

# Drizzle + Neon

## Source of truth

- Schema (readable TypeScript map): `lib/db/schema.ts`. Excluded from `tsc`.
- SQL migrations: `drizzle/*.sql` — never hand-edit production. These files are
  the authority. App code queries with parameterized SQL through `lib/neon.ts`.
  `drizzle-orm` is **not** a runtime dependency.
- Connection: Neon serverless pool used by API routes.

## Rules

1. Change the TypeScript map and add a numbered migration together. Never invent columns only in ad-hoc SQL on prod.
2. Keep serverless in mind: short-lived queries; avoid long transactions and huge joins on request paths.
3. Add indexes in migrations when filtering by slug, email, country, or created_at (follow existing `idx_*` patterns).
4. Organizer email is optional on create; supporters do not have accounts — do not add auth tables without an explicit product decision. Login is 6-digit codes (`lib/auth.ts`), not better-auth.
5. Refresh `DATABASE_URL` in Vercel + local together when Neon rotates credentials.
6. `scripts/apply-migrations.mjs` is a partial helper (0014–0016 only). Later files must be applied explicitly.

## Dig deeper

`docs/ENGINEERING.md`, `docs/reference/tier-1/drizzle/`, `docs/reference/tier-1/neon/`
