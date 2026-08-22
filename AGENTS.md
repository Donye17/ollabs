# Ollabs — working notes for AI assistants

Next.js 16 / React 19 / Tailwind / Neon Postgres / Vercel Blob. Deploys through Vercel's
GitHub integration: a push to `main` is a production deploy. There is no CI workflow and no
`.vercel` directory — the link lives in the Vercel dashboard.

Ollabs lets an organizer build a profile-picture frame, publish it as a campaign, and share one
link. Supporters open that link, drop in a photo, and download the framed result.

---

## Where things stand (2026-08-21)

**On `main`:** Phases 1–7. Mobile shell, custom-frame create, organizer save + slug
301s, quiet ads, PT-BR, organizer hubs, and Bahasa (`/id` landing + locale chrome).

Lawyer gate still applies before denser ads on Brazilian electoral campaign pages.
**Paid upgrade:** deferred — do not build vanity/custom domain/CSV/invoice until hubs
show demand.

Next: Phase 8 calendar moments (BR/ID local + awareness days), not monetization.

**Still needs a real phone (Phase 0):** open a preview from inside WhatsApp and confirm
“Save or share photo” → Save Image works. Finger-drag on `/create` and confirm the page
holds still. Upload a custom frame PNG and confirm the live preview stays visible while
adjusting the photo window.

Execution plan canvas: `ollabs-execution-plan` in the Cursor canvases folder.

---

## Mobile constraints — learned the hard way, do not regress

Most traffic is phones, and a large share arrives inside iOS in-app browsers (WhatsApp,
Instagram). Three consequences:

**Downloads.** Use `downloadBlob` from `lib/download.ts`. Never hand-roll the anchor. The
anchor must be appended to the document — some mobile browsers ignore a click on a detached
element — and the object URL must outlive the click by a wide margin, because revoking right
after `click()` races the browser's read of the blob and the file silently never arrives.

Pair every download with a `navigator.share({ files })` button gated on `canShareFiles()` from
`lib/share.ts`. iOS in-app browsers ignore `<a download>` entirely, so the share sheet is the
only path that reliably saves the picture there. Where the sheet exists it should lead; on
desktop, Download leads. Prefer a fixed thumb-zone bar with `env(safe-area-inset-bottom)`.

**Draggable canvases** need `touchAction: 'none'` in the inline style of the element carrying
the touch handlers. React attaches `touchmove` passively at the root, so `e.preventDefault()`
inside `onTouchMove` is a no-op — only `touch-action` stops the page scrolling under the drag.

**Modals** use `dvh`, never `vh`. On iOS Safari `100vh` is the height with the toolbars hidden,
so a `vh`-capped panel runs under the address bar and the button at its bottom cannot be
reached. Use `max-h-[92dvh] overflow-y-auto overscroll-contain`, plus the position-fixed body
scroll lock with scroll restore — copy the effect in `PublishTemplateModal.tsx` verbatim.

**No `alert()` anywhere.** It covers the page, and in an in-app browser a stray tap dismisses it
before it is read. Errors render inline next to the control that failed, with `role="alert"` and
`text-coral bg-coral/10 border-coral/25`.

**Create focuses on custom frames.** Premade colour rings are a collapsed fallback. Keep the
live canvas visible while the organizer adjusts the photo window.

---

## Sharing behaviour

`lib/share.ts` holds the reasoning, and it is worth reading before changing any share copy. The
short version: campaigns either get shared in the minutes right after publishing or never — the
median first supporter arrives 4.5 minutes after publish, 84% within the hour, none after 24
hours. So the publish screen opens WhatsApp directly rather than offering a link to copy. Share
text switches to Portuguese via `prefersPortuguese()`, because the people pasting these links
into group chats are overwhelmingly Brazilian even though the interface is English.

---

## Conventions

Comments explain **why**, not what, and they carry the history — why a thing is the way it is,
what broke before, what was tried. Match that register; do not strip those comments when
editing nearby code.

Commit messages are plain sentences describing the effect, sentence case, no conventional-commit
prefixes. Recent examples:

- `Delete the dead weight: framer-motion, the onboarding overlay, and the unreachable editor features`
- `Fix the shared renderer bug that stalled mobile, and cap canvas work`

Colors come from the Tailwind theme (`brand`, `ink`, `paper`, `cream`, `coral`, `muted`) — no
hardcoded hex in components.

`_to_delete/` and `_parked/` are dead code kept around deliberately. They are gitignored, are
not part of the app, and produce TypeScript errors if you run `tsc` across the whole tree.
Ignore them; `next build` does.

## Building

`next build` works normally. Note for anyone running it through a mounted/virtualized
filesystem: it can die with a bare `Bus error` there — that is the mount, not the code. Build on
a local checkout.
