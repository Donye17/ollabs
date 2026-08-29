---
name: adsense-quiet
description: >-
  Places quiet labelled AdSense units for Ollab. Use when editing AdSlot,
  campaign/SEO ad placement, AdSense env vars, or monetization layout.
---

# Quiet AdSense

## Product rules

- Same quiet labelled units. No special rules by category, country, or politics.
- Never on the photo / canvas.
- Never on `/create`.
- Never on `/c` or `/u` (user-generated pages with almost no publisher content).
- SEO pages (`/for`, `/day`, locale landings, `/vs`, guides) may carry denser labelled inventory between content blocks.
- Auto ads, anchors, and vignettes stay OFF in the AdSense dashboard.

## Implementation

- Use `components/AdSlot.tsx` only — do not invent a second ad loader.
- Surfaces: `campaign` | `seo`.
- Env: `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT_CAMPAIGN`, `NEXT_PUBLIC_ADSENSE_SLOT_SEO` (optional fallback `NEXT_PUBLIC_ADSENSE_SLOT_INLINE`).
- Script loads on first `AdSlot` mount, not in the root layout (keeps `/create` clean).
- Unfilled units must collapse; filled units reserve height to avoid layout shift under thumb buttons.

## Dig deeper

`docs/reference/tier-2/adsense/` (start with `OLLABS.md` if present)
