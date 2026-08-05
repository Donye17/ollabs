# Ollabs — Phases 5 through 10

*Written August 1, 2026. The strategic roadmap from "quietly live" to "the default profile-frame platform for organizations."*

---

## The competitive picture (researched, not guessed)

**Twibbonize is enormous and structurally vulnerable.**

| | Twibbonize |
|---|---|
| Users claimed | 287M+ across 193 countries |
| Traffic | 2.06M visits (May 2026), up 37% month over month |
| Indonesia | 77.91% of traffic (1.6M visits) |
| Philippines | 6.85% (141K visits) |
| India | third |
| Avg session | 5:54 |
| Monetization | Watermark on supporter downloads, removable for ~$0.99/24h, plus ads, plus Premium Creator |

Read those numbers again. Twibbonize is not a global platform, it is **an Indonesian platform with international spillover**. Nearly 78% of its traffic is one country. That 5:54 average session is not engagement, it is friction: ads, interstitials, and upsells between a supporter and their photo.

**Their structural weakness is who they charge.** Twibbonize monetizes the *supporter*, the person who just wanted to show support for a cause. If a nonprofit runs a Twibbonize campaign, its own supporters hit a watermark and a paywall. That reflects on the organization, not on Twibbonize. No serious brand, university, or nonprofit can accept that.

**The other alternatives are weak.** Phrames requires signup and its "free" is a one-month trial. SupportersFrame is mostly a content farm writing "Twibbonize alternative" blog posts.

**And you are already winning the search that matters.** Ollabs currently ranks **#1** for "Twibbonize alternative profile picture frame maker 2026," above both of them. The SEO groundwork is working.

### The thesis

**Do not fight Twibbonize in Indonesia.** They own it, and in a price-sensitive market their ad-and-watermark model is defensible.

**Take the market they cannot serve: English-language Western organizations,** plus Latin America where nobody is looking. Nonprofits, universities, K-12 schools, churches, sports clubs, and companies running culture moments. These buyers:

- cannot tolerate ads or watermarks on their supporters, which is disqualifying for Twibbonize
- have budget and recur every single year, because awareness days and seasons repeat
- are exactly who your six `/for` pages and 37 seeded campaigns already target
- found you unprompted (Unimed in Brazil, 58 supporters, and a Philadelphia event)

**The permanent brand promise, and the thing to put on the homepage: *we will never charge your supporters.*** That is not a feature, it is the wedge. Build the business on the organizer and never break it.

---

## Phase 5 — Launch and instrument
*Weeks 1 to 2. Goal: know your numbers.*

Covered operationally in [LAUNCH_PLAN.md](./LAUNCH_PLAN.md). The short version:

- [x] Fix doubled page titles site-wide *(done Aug 1)*
- [x] Add `photo_uploaded` funnel event *(done Aug 1)*
- [ ] Set a Sentry alert rule so outages are not silent
- [ ] Drop `tracesSampleRate` from 1 to 0.1
- [ ] Mark `frame_download` as a GA4 key event
- [ ] Run the mobile QA checklist end to end
- [ ] Pick the wedge, seed two flagship campaigns, share into one channel

**Exit criteria:** you can state supporter conversion and upload drop-off from memory.

---

## Phase 6 — Stop losing organizers 🔴
*Weeks 2 to 4. Goal: never lose a campaign owner again. **This is the highest-leverage phase on the list.***

### The problem, stated plainly

Right now, an organizer's only route back to their own campaign is a URL containing `?k=<owner_token>`. There is no email capture anywhere in the product. `/mine` reads from **localStorage only**.

That means: clear your browser, switch from phone to laptop, or create in incognito, and **your campaign is gone forever.** You cannot manage it, edit it, or see its numbers.

It also means **you cannot contact a single one of your organizers.** The Unimed organizer brought you 58 supporters and is completely unreachable. Organizer retention is your entire business model, and you currently have no mechanism for it.

### The fix (keep anonymous create, add optional recovery)

- [ ] **Optional email on create.** After a campaign is made, one field: "Email me my manage link." Not an account, not a password, not a signup wall. Just a lifeline.
- [ ] **Magic-link recovery.** `/recover`, enter your email, get links to every campaign associated with it.
- [ ] **Server-backed `/mine`.** Keep localStorage as the fast path, but when an email exists, resolve campaigns server-side so they survive device changes.
- [ ] **Add `organizer_email` and `email_verified_at` to `campaigns`.** Store hashed or plain per your privacy policy, and update `/privacy` to match.
- [ ] **Lifecycle emails.** These are the retention engine, and each one is a reason to come back:
  - "Your campaign is live, here is your link" (immediate, includes the manage link)
  - "Your campaign hit 25 / 50 / 100 supporters" (milestone, highly shareable, this is the one that gets forwarded internally)
  - "Your campaign hit its goal"
  - "Your campaign wrapped, here is a summary card" (7 days after the last use, with a **one-tap "run this again next year"**)
- [ ] **Never email supporters.** Only organizers. Guard this carefully.

**Exit criteria:** an organizer can lose their laptop and still recover their campaign, and you have an email list of real organizers.

---

## Phase 7 — Close the growth loop
*Weeks 4 to 8. Goal: every supporter is a potential organizer.*

The loop is already there and it is barely instrumented: organizer creates → shares link → supporters download → **some fraction should become organizers.** Today that entire step is one small "Make your own with Ollabs" link at the bottom of the campaign page. That link is your acquisition channel and it is currently an afterthought.

- [ ] **Rebuild the post-download moment.** Right after a supporter downloads, they are as warm as they will ever be. That screen should do three things: celebrate, prompt a share, and *then* ask "running something yourself?" Do not put the CTA before the download.
- [ ] **Supporter wall.** `campaign_uses.image_url` already exists in the schema and is unused. Opt-in only, moderated, off by default. Social proof plus a real reason for supporters to revisit a campaign page.
- [ ] **Attribution.** Track which campaigns produce new organizers. `withUtm` already exists, extend it so a new campaign records its referring campaign. This tells you your viral coefficient, the number that decides whether you have a growth engine or a website.
- [ ] **Share-back nudge.** Prompt supporters to post with a campaign-specific hashtag the organizer sets.
- [ ] **Embeddable counter.** A tiny script or iframe an organizer drops on their own site showing live supporter count and linking back. Free backlinks, free brand exposure, real SEO value.

**Exit criteria:** you can measure and report your viral coefficient. Target it above 0.2 before spending anything on acquisition.

---

## Phase 8 — Own the calendar
*Months 2 to 4. Goal: beat Twibbonize at the volume game using their own playbook.*

Twibbonize's traffic is almost entirely **calendar-driven**: founders' days, graduations, national days, school years. Look at their own top pages. That demand is predictable, recurring, and searchable, and you have already proven you can rank.

You seeded 37 campaigns manually. Systematize it.

- [ ] **Programmatic awareness-calendar SEO.** Build a data-driven route (`/day/[slug]` or extend `/for`) generating a page per awareness day, month, and season: Breast Cancer Awareness Month, Earth Day, Pride, Giving Tuesday, Teacher Appreciation Week, Mental Health Awareness Month, National Nonprofit Day, homecoming, graduation season. Each page ships with a ready-made frame, real copy, and a one-tap "use this campaign."
- [ ] **Publish 60 to 90 days ahead.** Organizers plan early. Ranking the week of the event is too late.
- [ ] **Add the missing use cases** the research surfaced and your `/for` pages do not cover yet:
  - **Companies and internal culture** (this is what Unimed actually did: a milestone celebration, not a fundraiser, and nobody markets to it)
  - **Universities and Greek life** (Twibbonize's US traffic is visibly sorority and fraternity founders' days)
  - **Political and advocacy campaigns**
  - **Memorials and tributes**
- [ ] **Annual re-engagement.** Any campaign tied to a recurring date triggers a "want to run this again?" email 30 days before it comes around. This turns one-time organizers into an annuity.
- [ ] **Multilingual.** Portuguese first, given the Unimed signal and that Brazil is absent from Twibbonize's top markets. Spanish next. Even a translated landing page plus localized frames is a cheap, asymmetric bet.

**Exit criteria:** organic traffic is compounding month over month without you manually seeding anything.

---

## Phase 9 — Monetize the organizer
*Months 4 to 6. Goal: revenue that never touches a supporter.*

Only start this once Phase 7 shows a real loop. Monetizing too early kills the growth you have not built yet.

**The line you never cross: supporters always download free, unwatermarked, ad-free, no signup. Forever.** That is the whole brand.

Free tier (permanent, generous):
- unlimited campaigns and unlimited supporters
- custom uploaded frames
- basic dashboard, supporter count, conversion
- small tasteful "Made with Ollabs" on the *campaign page*, never on the downloaded image

Paid tier, aimed at organizations with budget:
- [ ] custom slug and custom domain (`frames.yournonprofit.org`)
- [ ] remove Ollabs branding from the campaign page
- [ ] advanced analytics: traffic sources, geography, time-series, CSV export
- [ ] multiple frame variants in one campaign, with A/B testing
- [ ] team access for more than one organizer
- [ ] campaign scheduling with start and end dates
- [ ] priority support and a design-assist option

**Pricing to test:** a per-campaign one-time fee (matches how organizations actually budget, around $19 to $49) alongside an annual plan for orgs running several per year (around $99 to $299). Test the one-time first, since most organizers run one campaign and a subscription is a hard ask.

**Exit criteria:** one paying organization that renews.

---

## Phase 10 — Moat and scale
*Months 6 to 12. Goal: become infrastructure, not a tool.*

A better editor is not a moat. Distribution and integration are.

- [ ] **Embed widget and public API.** Let a nonprofit's own site host the frame experience. Once Ollabs is embedded in someone's donation flow, switching cost is real.
- [ ] **Integrations where the money already is:** Bloomerang, Classy, GiveButter, Donorbox, Mailchimp, Canva. A frame campaign attached to a giving campaign is a natural pairing and gets you in front of buyers who already pay for software.
- [ ] **PWA, not a native app.** Twibbonize has a Play Store app because their market is Android-first and app-first. Yours is not. A fast installable PWA gets you the "add to home screen" benefit at a fraction of the cost.
- [ ] **Frame template marketplace.** Designers publish templates, organizers pick one and go. Solves the real bottleneck (most organizers cannot design) and creates supply-side network effects.
- [ ] **Case studies from real campaigns.** "How Unimed reached 200,000 lives" is a better sales asset than any feature page, and it is free to produce. Ask permission first.
- [ ] **Own the comparison keyword.** Publish an honest, unsmug `ollabs.studio/vs/twibbonize` page. State plainly that they charge supporters and you do not. SupportersFrame is already ranking on this and their content is thin.

---

## Technical debt worth clearing (found in this audit)

None of this blocks launch, but it is all real and some of it costs you conversion directly.

**Bundle weight, which is supporter conversion on mobile:**
- `@imgly/background-removal` (5.5MB) is a **static import** in `EditorPage.tsx`. Every visitor to `/create` pays for it whether or not they remove a background. Make it a dynamic import. Single highest-value perf fix.
- `gif.js` (3.1MB) is imported in `Editor.tsx`, but the export path is stubbed out with `alert("GIF Export is coming back in the next update!")` and a leftover refactor TODO. Ship 3.1MB less by deleting it.
- `better-auth` (5.6MB) is in `package.json` with **zero references anywhere in the codebase.** Remove it.

**Dead schema from the torn-down social model.** These tables have no references outside `schema.ts`: `notifications`, `collection_items`, `frame_comments`, `frame_likes`, `user_favorites`, `likes`, `user_profiles`. Also, `likes`, `frame_likes`, and `user_favorites` are three overlapping tables that do the same thing. Plus the auth tables (`session`, `account`, `user`, `verification`) exist to serve a dependency you do not use. Write one migration and drop them.

**Other:**
- `frames` and `collections` are half-alive: still referenced in a few places but no longer central. Decide whether the frames concept survives alongside campaigns or gets folded in.
- ISR caching may make the supporter counter lag visibly. Decide whether that is acceptable or whether the count should hydrate client-side.

---

## The one metric that decides everything

**Organizer repeat rate.**

Changing a profile picture is rare, so supporters will not come back. That is fine and it was always going to be true. The business only works if **organizers return to run their next campaign**, which is why Phase 6 (do not lose them) and Phase 8 (remind them when their date comes around again) matter more than any feature in the editor.

Twibbonize wins on volume in a market you should not fight for. You win by being the platform an organization trusts with its own supporters, and by being there again next year when the date comes back around.

---

## Sources

- [Twibbonize](https://www.twibbonize.com/)
- [Twibbonize traffic analytics, Similarweb](https://www.similarweb.com/website/twibbonize.com/vs/pngwing.com/)
- [About the Remove Watermark Promo Plan, Twibbonize Help](https://help.twibbonize.com/en/articles/10489565-about-the-remove-watermark-promo-plan)
- [Can my Supporters enjoy my Campaign without Watermark?, Twibbonize Help](https://help.twibbonize.com/en/articles/9459243-can-my-supporters-enjoy-my-campaign-without-watermark)
- [Phrames](https://phrames.app/)
- [SupportersFrame, Alternative of Twibbonize](https://supportersframe.com/blog/alternative-of-twibbonize)
- [Cause awareness days calendar, GoFundMe Pro](https://pro.gofundme.com/c/blog/cause-awareness-days-calendar-activate-nonprofit-donors-year-round/)
- [2026 Nonprofit Marketing Calendar, Constant Contact](https://www.constantcontact.com/blog/nonprofit-marketing-calendar/)
