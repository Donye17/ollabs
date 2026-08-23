---
name: mobile-share-download
description: >-
  Saves framed photos on mobile, especially iOS WhatsApp/Instagram in-app
  browsers. Use when adding download, Share, Save Image, Web Share, blob
  downloads, or any campaign/day save bar.
---

# Mobile share & download

Most Ollab traffic is phones; many arrive inside WhatsApp/Instagram WebViews where `<a download>` fails silently.

## Do this

1. Prefer `saveFramedPhoto` from `lib/savePhoto.ts` for framed PNG save flows.
2. Gate file share with `canShareFiles` from `lib/share.ts`.
3. Trigger blob downloads only via `downloadBlob` in `lib/download.ts` — never a hand-rolled detached anchor.
4. On iPhone, lead with Share / Save Image; do not rely on Download as the primary path (`preferShareSheetForSave`).
5. Put save/share controls in a fixed thumb-zone bar with `env(safe-area-inset-bottom)`.
6. Share campaign links with `whatsappUrl` + `organizerShareText` / `supporterShareText` from `lib/share.ts` (first supporter usually arrives within minutes of publish).

## Do not

- Revoke an object URL immediately after `click()` — `downloadBlob` already delays revoke (~60s).
- Call `navigator.share` with `text`/`url` alongside `files` on iOS in-app browsers (files-only payloads are safer — see `saveFramedPhoto`).
- Use `alert()` for save failures — inline `role="alert"` next to the control.

## Dig deeper

`docs/reference/tier-1/mdn-mobile/`
