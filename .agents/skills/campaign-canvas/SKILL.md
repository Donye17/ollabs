---
name: campaign-canvas
description: >-
  Frame editor and campaign canvas: drag photo window, touch scrolling, PNG
  export. Use when editing CanvasArea, frame customizer, render/export, or
  create-flow canvas UX.
---

# Campaign canvas

## Hard mobile rules

1. Any element with drag/pinch handlers needs `touchAction: 'none'` on that element — React’s root `touchmove` is passive, so `preventDefault` alone will not stop page scroll (`components/editor/CanvasArea.tsx`).
2. Keep the live preview visible while the organizer adjusts the photo window.
   Premade colour rings open on the first visit (`simpleStylesOpen` defaults
   true; collapse writes `ollabs_simple_styles_open`). The 500 ms share
   snapshot in `Editor.tsx` does not list `textureVersion`, so custom-frame
   publish can store a blank cream circle (`docs/ENGINEERING.md`).
3. Cap canvas work — do not re-render at full export resolution on every pointer move.
4. Export through `saveFramedPhoto` / shared blob helpers, not one-off canvas download code.
5. Modals over the editor: `dvh` + scroll lock with restore (see existing publish modal pattern).

## UX

- Errors inline next to the control (`role="alert"`) — no `alert()`.
- Create focuses on custom frame upload + window adjust; don’t bury the canvas under chrome.

## Dig deeper

`docs/reference/tier-4/canvas/`, `docs/reference/tier-1/mdn-mobile/`
