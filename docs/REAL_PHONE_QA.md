# Real-phone QA checklist (Phase 0 / P0.1 + Lane A)

Run these on a **physical phone**, ideally inside WhatsApp’s in-app browser on iOS. Desktop Chrome alone is not enough.

## Campaign save (`/c/[slug]`) — Lane A

### Empty state
1. Open a live campaign link from a WhatsApp chat (not Safari bookmark).
2. Confirm the circle fills most of the first viewport (roughly half the screen height).
3. Confirm **Upload your photo** is the only primary CTA (no three step cards).
4. Confirm **no** Mine · Create · Hub tab bar.

### Adjust (after photo)
1. Upload a photo.
2. Confirm the mark / wordmark is hidden while adjusting.
3. Confirm **Drag to move** + Size slider are visible under the circle.
4. Finger-drag the photo. Confirm the **page does not scroll** under the drag.
5. Confirm the fixed **Save or share photo** bar sits above the home indicator.
6. Confirm ads sit under the fit controls, not on the photo, and are not covered by the bar.

### Save / share sheet
1. Tap **Save or share photo**.
2. From the share sheet, choose **Save Image** (or Messages / WhatsApp).
3. Confirm the framed PNG appears in Photos (or in the destination chat).
4. Confirm the page does **not** rely on Download alone on iPhone.

### Post-save (Lane A2)
1. After a successful save, confirm the sticky save bar is **gone**.
2. Confirm the framed result stays large on screen.
3. Confirm **Share photo** (WhatsApp green) is the first / largest button.
4. Confirm **Share as story** is the clear second action.
5. Confirm supporter count and report sit below the share stack (not competing with WhatsApp).

## Hub public (`/u/[handle]`) — Lane A4

1. Open a hub that has a featured campaign.
2. On a phone viewport, confirm without scrolling you can see: avatar/name, **large frame preview**, supporter count (if any), and a full-width **Join** button.
3. Tap Join. Confirm it lands on `/c/[slug]` and records a hub click.
4. Confirm **no** organizer tab bar on `/u/...`.

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

## Organizer chrome

1. On public `/c/...`, confirm **no** Mine · Create · Hub tab bar.
2. On `/create`, `/mine`, `/hub`, confirm the tab bar is present.
3. On `/u/[handle]`, confirm no organizer tab bar.
4. Confirm a language banner never covers the sticky save bar on `/c`.

## Owner follow-ups (cannot be fully automated)

- [ ] iPhone + WhatsApp: Save Image path verified on production or a preview URL.
- [ ] iPhone + WhatsApp: post-save Share photo opens the sheet with the framed PNG.
- [ ] Hub Join CTA above the fold on a real handset (not only desktop DevTools).
- [ ] AdSense: create Campaign + SEO display units; set `NEXT_PUBLIC_ADSENSE_SLOT_CAMPAIGN` and `NEXT_PUBLIC_ADSENSE_SLOT_SEO` on Vercel; keep Auto ads / anchors / vignettes OFF.
- [ ] Optional cron: set `CRON_SECRET` and confirm `/api/cron/zero-supporter` runs (see `vercel.json`).
