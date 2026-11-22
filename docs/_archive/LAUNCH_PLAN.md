# Ollabs — Launch Plan

*Written August 1, 2026. Supersedes Phase 5 of OLLABS_MVP_ROADMAP.md.*

## Where things actually stand

The product is built and live at ollabs.studio. Phases 2 through 4 of the old roadmap all shipped between July 14 and July 29: campaigns, the `/c/[slug]` supporter page, per-campaign OG images, GA4 with UTM tracking, ISR caching, explore with categories and sort, owner dashboards, reporting and moderation, and 37 premade SEO campaigns.

**The thing worth noticing: you already have organic traction you did not ask for.**

- `somos-200mil-vidas-p02b` is a Unimed campaign (Brazilian healthcare co-op) sitting at 58 supporters, in Portuguese, with a custom uploaded frame.
- `fete-des-femmes-phila-2026` is a real Philadelphia event.

Neither of those came from a launch. They came from SEO and word of mouth on a product that was never announced. That changes the shape of this launch: you are not proving the concept from zero, you are pouring fuel on something already smoldering.

---

## Fixed in this pass

- **Doubled page titles site-wide.** Every page was rendering `Title | Ollabs | Ollabs` because the root layout sets `template: '%s | Ollabs'` and each page also hardcoded the suffix. Visible in browser tabs and in Google results. Fixed on `/c/[slug]`, `/c/[slug]/manage`, `/create`, `/explore`, `/mine`, and `/for/[use]`.
- **Missing funnel event.** Added `photo_uploaded` and `photo_upload_failed` to the campaign page. Without it you could see views and downloads but had no idea where people dropped off in between, which is exactly the step most likely to lose them.

Typecheck passes. Both changes are uncommitted, ready for review.

---

## Still needs you (cannot be done from code)

- [ ] **Sentry alert rules.** `sentry.client.config.ts` collects errors correctly, but alerting is a dashboard setting, not code. Go to Sentry → Alerts and create at least one rule that emails or texts you on a new issue in production. Right now an outage is still invisible until someone looks.
- [ ] **Lower `tracesSampleRate`.** It is set to `1` (100% of transactions). Fine at zero traffic, expensive and noisy the moment a campaign goes viral. Drop to `0.1` before you push volume.
- [ ] **GA4 conversion.** Mark `frame_download` as a key event in GA4 so supporter conversion shows up in reports without building a custom exploration every time.

---

## Pick the wedge

The old roadmap said "pick one real community." Given the organic signal, here are the three that actually make sense, in order:

**1. Lean into what is already working: organizations running internal culture campaigns.**
The Unimed campaign is not a fundraiser or a sports team. It is a company celebrating a milestone with its own people. That is a repeatable, high-volume use case nobody in this category markets to, and it converts well because participation is socially expected inside a workplace. Consider a `/for/companies` or `/for/milestones` landing page to match the SEO pattern you already built for the other six.

**2. Follow the language signal.**
A Portuguese-language campaign found you organically through English-only SEO. Brazil is a massive profile-frame market and Twibbon's presence there is weak. Even a single Portuguese landing page is a cheap test with an outsized possible return.

**3. Local Philadelphia events.**
The Fete des Femmes campaign is local to you. Local event organizers talk to each other, and one visible campaign at a real event seeds several more. Lowest reach, highest hit rate.

**A note on Madak clients.** USRF, JMU, and CGA are all obvious fits on paper, and a rugby foundation running a supporter frame campaign would look great. But Ollabs is your side project, deliberately separate from Madak. Pointing client relationships at a personal venture is worth thinking about before you do it, not after. If you do want to go there, the cleanest version is offering it as a free tool with no attribution back to you, not as a Madak deliverable.

---

## Pre-launch QA checklist

Run this on a real phone, not a desktop browser resized. Most supporters will be on mobile.

**Supporter path (the one that matters)**

- [ ] Open a campaign link cold on mobile data, not wifi. Time it. Anything over 3 seconds to interactive is a problem.
- [ ] Upload from the camera roll. Upload a photo taken live. Upload a HEIC from an iPhone.
- [ ] Pinch and drag to reposition. Confirm the crop edge stays clean.
- [ ] Download. Confirm the file lands in Photos and looks right, not washed out or upside down.
- [ ] Native share sheet to Instagram and WhatsApp.
- [ ] Confirm the supporter counter increments and the new number survives a refresh (ISR cache means it may lag, decide if that is acceptable).
- [ ] Upload something that is not an image. Confirm it fails gracefully.

**Organizer path**

- [ ] Create a campaign with no account. Confirm you get a link.
- [ ] Upload a custom frame with transparency. Confirm the cutout is clean.
- [ ] Add a supporter goal. Confirm it renders.
- [ ] Find the campaign again later via `/mine`.
- [ ] Open `/c/[slug]/manage` and confirm the dashboard chart populates.

**Shared-link presentation**

- [ ] Paste a campaign link into iMessage, WhatsApp, Slack, X, Facebook, and LinkedIn. Confirm the OG preview renders the campaign frame, not the generic Ollabs image, and confirm the title now reads cleanly with a single `| Ollabs`.

**Failure modes**

- [ ] Kill the database connection and load a campaign page. It should fail softly with a human message, not a stack trace.
- [ ] Load a campaign slug that does not exist.
- [ ] Load a hidden or reported campaign.

---

## Success metrics

Track exactly three things for the first 30 days. Everything else is noise.

| Metric | How to read it | Target |
|---|---|---|
| **Supporter conversion** (`frame_download` ÷ campaign page views) | The single number that says the supporter page works | 40%+ |
| **Upload drop-off** (`photo_uploaded` ÷ page views, then `frame_download` ÷ `photo_uploaded`) | Tells you *where* you lose people, newly instrumented in this pass | Identify, then fix the weaker step |
| **Organizer return rate** (organizers who create a second campaign) | The real business signal, because changing a PFP is rare but running campaigns recurs | Any repeat at all is a strong early sign |

---

## Day-of runbook

1. Commit and deploy the title and analytics fixes.
2. Set the Sentry alert rule and lower the trace sample rate.
3. Mark `frame_download` as a GA4 key event.
4. Run the mobile QA checklist end to end. Fix anything that breaks the supporter path. Ignore cosmetic issues.
5. Seed two flagship campaigns in the chosen wedge, with real frames, not placeholders.
6. Share into the wedge. One channel, not five.
7. Watch supporter conversion for 48 hours. If it is under 30%, the problem is the supporter page, not distribution. Fix the page before pushing more traffic.

---

## What launch is not

Do not rebuild anything before shipping. Do not add the supporter wall, freemium tiers, or the avatar builder. You have a live product with real strangers using it. The remaining risk is entirely distribution and polish, not features.
