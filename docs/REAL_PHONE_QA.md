# Real-phone QA checklist (Phase 0 / P0.1)

Run these on a **physical phone**, ideally inside WhatsApp’s in-app browser on iOS. Desktop Chrome alone is not enough.

## Campaign save (`/c/[slug]`)

1. Open a live campaign link from a WhatsApp chat (not Safari bookmark).
2. Upload a photo, fit it, tap **Save or share photo**.
3. From the share sheet, choose **Save Image** (or Messages / WhatsApp).
4. Confirm the framed PNG appears in Photos (or in the destination chat).
5. Confirm the page does **not** rely on Download alone on iPhone.
6. Confirm the fixed Save/Share bar sits above the home indicator and is not covered by Mine · Create · Hub or a language banner.

## Create drag (`/create`)

1. Upload a custom frame PNG (or pick a colour ring).
2. Optionally drop a preview photo on the circle.
3. Finger-drag the photo to reposition.
4. Confirm the **page does not scroll** under the drag (`touch-action: none` on the canvas).
5. Confirm zoom/slider still works with a thumb.

## Custom frame live preview

1. Upload a custom frame with a transparent center (or a solid logo).
2. Adjust the photo window slider.
3. Confirm the live preview above stays visible while adjusting (not buried under chrome).
4. If the PNG has no transparency hole, confirm the inline transparency warning appears (does not hard-block publish).

## Post-save viral CTA

1. After a successful save on `/c`, confirm Share (framed photo / WhatsApp) is the obvious next action on mobile.
2. Confirm Download is secondary where it exists.
3. Confirm ads never sit on the photo or under the sticky save controls in a way that covers them.

## Organizer chrome

1. On public `/c/...`, confirm **no** Mine · Create · Hub tab bar.
2. On `/create`, `/mine`, `/hub`, confirm the tab bar is present.
3. On `/u/[handle]`, confirm no organizer tab bar.

## Owner follow-ups (cannot be fully automated)

- [ ] iPhone + WhatsApp: Save Image path verified on production or a preview URL.
- [ ] AdSense: create Campaign + SEO display units; set `NEXT_PUBLIC_ADSENSE_SLOT_CAMPAIGN` and `NEXT_PUBLIC_ADSENSE_SLOT_SEO` on Vercel; keep Auto ads / anchors / vignettes OFF.
- [ ] Optional cron: set `CRON_SECRET` and confirm `/api/cron/zero-supporter` runs (see `vercel.json`).
