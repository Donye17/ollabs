# Real-phone QA checklist (Phase 0 / P0.1 + Lane A)

**Go-live gate:** automated Playwright and SEO checks passed on 2026-08-26. This checklist is the remaining step that needs a physical phone, ideally WhatsApp in-app on iOS. See sections below before calling the platform fully verified on device.

Run these on a **physical phone**, ideally inside WhatsApp’s in-app browser on iOS. Desktop Chrome alone is not enough.

## Campaign save (`/c/[slug]`) — Lane A

### Empty state
1. Open a live campaign link from a WhatsApp chat (not Safari bookmark).
2. Confirm the circle fills most of the first viewport (roughly half the screen height).
3. Confirm **Upload your photo** is the only primary CTA (no three step cards).
4. Confirm **no** Mine · Create · Hub tab bar.
5. Confirm first paint is Portuguese for Brazilian (or untagged) campaigns: buttons, counts as 1.926, not English leftover chrome.

### Adjust (after photo)
1. Upload a photo.
2. Confirm the mark / wordmark is hidden while adjusting.
3. Confirm **Drag to move** + Size slider are visible under the circle.
4. Finger-drag the photo. Confirm the **page does not scroll** under the drag.
5. Confirm the fixed **Save or share photo** bar sits above the home indicator.
6. Confirm **no ads** on this page (inventory lives on SEO pages only). The bar must not cover fit controls.

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
6. Share to WhatsApp immediately, then check the organizer count. On current `main` the join waits on the Explore thumb upload, so leaving during that upload can leave the count at 0 (`docs/ENGINEERING.md`, pitfall 21).

## Homepage tool (`/`)

1. First viewport is headline, live slug, one name field, **Create a campaign**. No colour rings. First HTML is English.
2. Confirm **EN | PT** in the nav. Portuguese stays on `/`. `/pt` is the SEO landing, not the product UI.
3. Confirm **no** Mine · Create · Hub tab bar on `/`.
4. Type a name. Confirm the `/c/` slug preview updates, then Create a campaign lands on `/create?name=...`.
5. Open a Brazilian or untagged `/c` from WhatsApp. Confirm campaign chrome is Portuguese even if you just used English on `/`.
6. On an **untagged** campaign (`publisher_country` null), save once from a non-BR network, then reopen `/c` from WhatsApp. On current `main` chrome can switch to English (`docs/ENGINEERING.md`, pitfall 24). Skip if the campaign already has `publisher_country = BR`.

## Hub public (`/u/[handle]`) — Lane A4

1. Open a hub that has a featured campaign.
2. On a phone viewport, confirm without scrolling you can see: avatar/name, **large frame preview**, supporter count (if any), and a full-width **Join** button.
3. Tap Join. Confirm it lands on `/c/[slug]` and records a hub click.
4. Confirm **no** organizer tab bar on `/u/...`.
5. On `/hub`, note a link's tap count, change only the bio, Save. On current `main` the count returns to 0 (`docs/ENGINEERING.md`, pitfall 22).

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
3. On `/` and `/u/[handle]`, confirm no organizer tab bar.
4. Confirm a language banner never covers the sticky save bar on `/c`.

## Manage / Change the frame

1. Open `/c/[slug]/manage?k=...` once, then bookmark the URL **after** `k=` disappears.
2. From that bookmarked (cookie-only) page, tap **Change the frame**. Confirm Create loads the live frame, not a blank new campaign. If it publishes a second slug, that is the current cookie-only gap (`docs/ENGINEERING.md`).
3. Change the custom link on manage. Confirm old WhatsApp `/c/[old]` still opens the campaign. Confirm the welcome-email `/manage?k=` URL: today it 404s after rename.
4. Within a minute of that rename, open the **original** WhatsApp `/c/[old]` link, save a photo, and check the manage count. On current `main` the PNG still saves and `/use` can 404, so the count never moves (`docs/ENGINEERING.md`, Public writes). Wait a minute and retry from a fresh tab if you are isolating ISR from the `countedRef` latch.
5. Do not take a custom URL that another campaign used to own (their redirect). On current `main` that hijacks their still-shared link. See `docs/ENGINEERING.md`.

## Email recovery

1. Request a recover link for an organizer mailbox that has campaigns.
2. Open the mailed `/recover/[token]` URL once. Confirm it lists dashboards.
3. Refresh. Confirm it shows expired (one-time). Note: a chat unfurl or Outlook Safe Links GET counts as that first open, so the organizer tap may already be expired. Current `main` also puts `manage?k=` in that first HTML.

## Signed-in publish vs hub handle

1. Claim a custom handle on `/hub` (not the email local-part).
2. Open Create while signed in and publish as soon as the modal appears (slow network if you can).
3. Confirm `/u/your-custom-handle` still resolves. If it became `/u/<email-local-part>`, that is the current publish overwrite (`docs/ENGINEERING.md`).

## Owner follow-ups (cannot be fully automated)

- [ ] iPhone + WhatsApp: Save Image path verified on production or a preview URL.
- [ ] iPhone + WhatsApp: post-save Share photo opens the sheet with the framed PNG.
- [ ] Hub Join CTA above the fold on a real handset (not only desktop DevTools).
- [ ] AdSense: SEO display unit env `NEXT_PUBLIC_ADSENSE_SLOT_SEO` on Vercel; keep Auto ads / anchors / vignettes OFF. Do not put units back on `/c` or `/u`.
- [ ] Optional cron: set `CRON_SECRET` and confirm `/api/cron/zero-supporter` runs (see `vercel.json`).
