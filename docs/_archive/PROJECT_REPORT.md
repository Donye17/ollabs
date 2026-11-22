# Ollabs — Project Report

*Prepared July 14, 2026*

## What it is

Ollabs (`ollabs.studio`) is a free, web-based **avatar frame and profile-picture border creator**. Users upload a photo, wrap it in a customizable circular frame (solid, gradient, neon, double-border, textured, and custom-uploaded styles), add text-on-path and stickers, then export the result as an image or animated GIF. It's positioned SEO-first as "the #1 free tool to create custom avatar frames, PFP overlays and borders for Discord, Twitter, Instagram, and TikTok — no login required," with a community layer (public gallery, likes, comments, collections, user profiles) that turns creations into a shareable, viral feed. A recent "Olympics / country flags" campaign shows the product leaning into topical, event-driven frames.

## Tech stack

It's a modern, single-repo **Next.js 16 / React 19** app written in **TypeScript**, deployed on **Vercel**. Data lives in **Neon serverless Postgres**, accessed through **Drizzle ORM**. Auth is handled by **better-auth** with email/password plus Google, Discord, and Twitter/X social login. Supporting services: **Vercel Blob** for file storage, **Sentry** for error monitoring, and **Vercel Analytics + Speed Insights**. The UI is **Tailwind CSS** with `framer-motion`, `lucide-react` icons, and Radix primitives. Image work is done client-side with `@imgly/background-removal`, `colorthief`, and `gif.js`, and all frame rendering runs through a clean HTML-canvas **strategy pattern** (`components/renderer/`).

## Scale and structure

Roughly **11,600 lines** of application TypeScript/TSX across **33 app files, 45 components, and 16 API routes**, plus about **35 database/utility scripts**. The codebase is organized sensibly: `app/` (routes + API), `components/` (feature-grouped UI, including a dedicated `renderer/` engine and `editor/` logic), `lib/` (auth, db schema/relations, types, constants), and `drizzle/` (one migration + snapshot). Development has been active and iterative — **94 commits** on `main`, with history showing a phased build (auth, social features, editor, "phases 9–12," launch prep, SEO, and the Olympics campaign).

## Feature areas (from the code)

The app implements a full editor (`components/editor/`, `Editor.tsx`, avatar builder), a public gallery with trending/sorting, frame detail modals with likes and comments, collections, notifications with a bell, user profiles with verified badges, an admin panel, dynamic Open Graph image generation (`app/api/og/`), and SEO scaffolding (`sitemap.ts`, `robots.ts`, JSON-LD structured data). Auth supports onboarding and username flows.

## Health and observations

**Strengths.** The architecture is clean for a project this young — the renderer strategy pattern, feature-grouped components, typed schema, and separation of `lib` concerns are all good signs. Monitoring, analytics, and SEO were wired in early rather than bolted on. The stack is current and coherent.

**Things worth attention:**

- **Secrets in git.** `.env` is tracked in the repository and contains `DATABASE_URL` (the Neon connection string). This should be removed from version control (`git rm --cached .env`, add to `.gitignore`) and the database credential rotated, since it may exist in git history. Only `*.local` is currently ignored.
- **Debug and seed routes are live.** `app/api/debug/tables`, `app/api/debug/fix-schema`, and `app/api/seed` expose schema/database operations over HTTP. These should be removed or gated behind admin auth before/at production.
- **Schema churn.** There are ~35 one-off `scripts/` (many named `fix-*`, `migrate-*`, `inspect-*`) and code comments referencing a "split-brain schema" on the verification table (both `expiresAt` and `expires_at`). The database schema evolved reactively rather than through disciplined migrations — there's only a single Drizzle migration despite many manual fixes. Worth consolidating into a clean migration baseline.
- **Casing inconsistency.** `isVerified` maps to a DB column `isverified` (all-lowercase), a known friction point flagged in the tech notes. Minor, but a source of bugs.
- **Uncommitted work.** The working tree has a large number of modified files (nearly every API route, admin, docs, and `.env`) not yet committed — worth committing or reviewing so the repo reflects reality.

## Bottom line

Ollabs is a well-scoped, actively developed consumer web app with a genuinely clean rendering architecture and a sensible modern stack, already launched with SEO, monitoring, and a social/viral layer in place. The main risks are operational rather than architectural: a committed `.env` with a live database credential, exposed debug/seed endpoints, and a database schema that needs to be consolidated after a period of reactive patching. Address those three and the foundation is solid.
