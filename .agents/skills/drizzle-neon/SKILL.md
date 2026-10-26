---
name: drizzle-neon
description: >-
  Drizzle schema and migrations on Neon serverless for Ollab. Use when changing
  lib/db/schema, drizzle/*.sql, queries, or DATABASE_URL / pool usage.
---

# Drizzle + Neon

## Source of truth

- Schema: `lib/db/schema.ts` (campaign-centric tables).
- SQL migrations: `drizzle/*.sql` (through `0023_hub_growth.sql`) — never
  hand-edit production. `scripts/apply-migrations.mjs` only applies
  0014–0016. Apply 0017–0023 on Neon or extend the script.
- Connection: Neon serverless pool used by API routes.

## Rules

1. Change TypeScript schema first, then add a numbered migration — never invent columns only in ad-hoc SQL on prod. App queries are raw SQL; `drizzle-orm` is not installed (`lib/db/schema.ts` is a readable map and is excluded from `tsc`).
2. Keep serverless in mind: short-lived queries; avoid long transactions and huge joins on request paths.
3. Add indexes in migrations when filtering by slug, email, country, or created_at (follow existing `idx_*` patterns).
4. Organizer email is optional on create; supporters do not have accounts — do not add auth tables without an explicit product decision.
5. Refresh `DATABASE_URL` in Vercel + local together when Neon rotates credentials.

## Dig deeper

`docs/reference/tier-1/drizzle/`, `docs/reference/tier-1/neon/`
