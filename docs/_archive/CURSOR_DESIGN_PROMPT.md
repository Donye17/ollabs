# Cursor prompt: design and UX pass

Paste the block below into Cursor as the opening message of a new session.
Everything it references exists in this repo.

---

You are working on Ollabs, a profile-picture frame campaign platform. Next.js 16,
React 19, Tailwind, Neon Postgres, Vercel.

Read these three files before writing any code, in this order:

1. `AGENTS.md` - hard technical rules learned from production breakage. Violating
   any of them is a failed change.
2. `.cursor/rules/ollabs-ux.mdc` - who the user is, what job they are doing, and
   the interaction rules that follow.
3. `docs/OLLABS_PLAN.md` sections 3, 5 and 9 - the thesis, the design work in
   priority order, and the five metrics that matter.

Load the skills `mobile-share-download`, `campaign-canvas`, `impeccable`, and
`frontend-design`. Ignore every `apple-design-*` skill. This is an Android-first,
WhatsApp-first product for Brazil, Indonesia, Nigeria and the Philippines.

## The standard you are held to

Ollabs has a 58% zero-supporter rate. Most campaigns that get created never
reach a single supporter. That is a design failure, not a marketing failure, and
it is what this pass exists to fix. Judge every change against one question: does
this make the supporter job or the organizer job faster or more certain?

Do not restyle for its own sake. Do not add a component library. Do not add
`framer-motion` or `motion`. Use CSS transitions and the keyframes already in
`tailwind.config.ts`. Use only the existing color tokens: `brand`, `brand.deep`,
`brand.wash`, `ink`, `paper`, `paper2`, `cream`, `coral`, `amber`, `muted`.

## Work in this order. Finish each before starting the next.

### 1. Verify the comparison and promise copy

Ads do not render on `/c` or `/u`. Confirm that in the code, then check every
claim on `/vs/twibbonize`, `/for` and the locale landings against what the code
actually does. Fix any that do not hold. While you are there, make the supporter
promise explicit and prominent on the homepage: supporters never pay, never see
an ad, never get a watermark, never need an account. It is the strongest thing
the product has and it is currently buried.

Acceptance: every comparison claim is verifiable from the codebase, and the
supporter promise appears above the fold.

### 2. Audit the supporter path element by element

Walk `/c/[slug]` on a 375px viewport in a mobile emulator. Count every element
between landing and a saved photo. For each one, write one sentence saying which
job it serves. Delete or defer anything that serves neither.

Specifically check: does anything overlap the save bar at 375x812 with the
language banner visible? Does the frame preview stay visible while the photo is
being positioned? Is there exactly one primary action at each step?

Acceptance: a written element inventory in the PR description, and a reduced
element count on the supporter path.

### 3. Make the save-to-share handoff certain

After a successful save, the framed result must be visible and the single most
obvious next action must be sharing it back to WhatsApp. Secondary action is
download. On iOS in-app browsers the share sheet leads, per `lib/share.ts` and
`canShareFiles()`. Do not hand-roll the anchor, use `saveFramedPhoto` and
`downloadBlob`.

Acceptance: on a phone viewport, after save, share is unmistakable without
scrolling.

### 4. Fix the first-hour problem for organizers

The median first supporter arrives 4.5 minutes after publish and 84% arrive
within the hour. The publish flow must end with the organizer sending the link,
not with a confirmation screen. After publish: show the live link, one tap to
WhatsApp with pre-filled text in the organizer's language, and a visible
statement that the next hour decides the campaign.

Acceptance: publish ends in a share action, not a dead end.

### 5. Empty states that teach

`/mine`, the hub editor, and a zero-supporter campaign manage page all need
empty states that name the next action and say why it matters. No bare "nothing
here yet."

Acceptance: every empty state contains a verb and a reason.

### 6. Accessibility floor

Run through section 6 of `.cursor/rules/ollabs-ux.mdc`. Contrast 4.5:1 on body
text, 44px touch targets, visible focus, focus trap and Escape on modals, real
alt text on campaign art, no horizontal scroll at 200% zoom. Fix what fails.

Acceptance: each item checked and the failures listed with what you changed.

### 7. Motion pass, last

Only after 1 through 6. Add motion only where it explains a state change:
entering a modal, a supporter count incrementing, a step advancing. 150ms to
250ms, ease out on entry, `transform` and `opacity` only, honor
`prefers-reduced-motion`. Never animate the framed photo preview.

Acceptance: no new dependency, no animation over 250ms, reduced-motion path
verified.

## How to work

Small commits, sentence-case messages, no conventional-commit prefixes. Explain
why in comments, not what. When user-visible behavior ships, add a bullet to
`lib/announcements.ts`. Do not commit or push unless I ask. If a step needs a
real iPhone or a dashboard action, do the code and leave me an exact checklist.

Start with step 1 and show me the false claims you find before you rewrite them.
