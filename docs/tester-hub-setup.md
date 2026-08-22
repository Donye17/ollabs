# Ollab Studio hub — tester setup

Organizer hubs are the Linktree-style page at **`/u/[handle]`**. The frame tool stays on **`/c/[slug]`**; the hub is the one bio link that lists campaigns and a Support button.

## URLs

| What | URL |
|------|-----|
| Hub editor (login required) | https://ollabs.studio/hub |
| Public hub (after publish) | https://ollabs.studio/u/your-handle |
| My campaigns | https://ollabs.studio/mine |

## Setup checklist (Ollab Studio test org)

1. **Create a campaign** at `/create` (or use an existing one). Note the slug.
2. **Sign in** at `/login` with the organizer email (6-digit code).
3. Open **`/hub`** (also linked from `/mine` and the campaign manage dashboard).
4. **Claim a handle** — e.g. `ollabstudio` → public URL `https://ollabs.studio/u/ollabstudio`.
5. Set **display name**, **bio**, optional **avatar**.
6. Pick a **featured campaign** (Support button goes to `/c/[slug]`).
7. Add **extra links** (Instagram, donate page, etc.).
8. **Save** → open the public hub in a private window and tap Support.

## What to verify

- Support button opens the framed campaign on a phone.
- More campaigns list below if you have several.
- Hub with no content stays `noindex`; hub with bio + campaign indexes (sitemap).
- Share the hub link in WhatsApp — page loads, no horizontal scroll, thumb-friendly taps.

## If handle is taken

Handles are 3–30 chars, lowercase `a-z`, digits, hyphens. Reserved: `ollabs`, `create`, `hub`, etc. (see `lib/hub.ts`).
