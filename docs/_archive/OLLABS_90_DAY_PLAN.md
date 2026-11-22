# Ollabs — The Next 90 Days

*August 1 to October 31, 2026. Execution plan for Phases 5 through 8.*

The strategy is in [OLLABS_PHASES_5-10.md](./OLLABS_PHASES_5-10.md). This is the calendar.

**The shape of the quarter:** October is the biggest profile-frame month of the year (Breast Cancer Awareness Month alone). Everything before it is preparation. If the site is not ranking and the organizer email loop is not working by September 15, October passes you by and the next comparable window is a year out.

---

## First: the money question

You asked whether a donate button beats a subscription. Here is the honest read.

### Donate alone will not fund this

Donation conversion on a free tool runs roughly 0.1% to 1% of users, and it does not scale with the value you deliver. A university running a 10,000-supporter campaign gives you the same $5 as a hobbyist. Wikipedia makes the model work, but only on ~1.5 billion monthly visitors and with aggressive banner campaigns you would hate having on your site.

There is also a practical blocker people miss: **organizations cannot easily donate to a vendor.** A nonprofit's finance team can process a $49 invoice for software. It cannot process "a donation to a company." Procurement, expense reports, and grant reporting all need a line item. Asking an institution to donate is asking it to do the one thing its accounting system is not built for.

### But you are right that a paywall is off-brand

Your entire wedge against Twibbonize is that they charge supporters. A hard subscription wall makes you a cheaper Twibbonize instead of a different thing.

### The resolution: both, aimed at different people

| | Who | What | Why it works |
|---|---|---|---|
| **Donate** | Individuals, small groups, anyone who used it free and liked it | "Ollabs is free and ad-free, and stays that way. If it helped, chip in." Suggested $3 / $10 / $25, no account | Reinforces the brand promise instead of undercutting it. Costs nothing to run. Real but small revenue. |
| **Campaign upgrade** | Institutions with a budget | **One-time, per-campaign fee** (test $29 to $49) for custom slug, no Ollabs branding on the campaign page, advanced analytics, CSV export, team access. Sends a proper invoice | Matches how organizations actually budget: per event, per campaign, expensable. No recurring commitment to justify. |

**Call it an upgrade, not a subscription.** Most organizers run one campaign. A subscription asks them to commit to a cadence they do not have. A per-campaign fee with a real invoice is a much easier yes, and it is the version a finance team can approve without a meeting.

**Sequence it:** donate button in month 2 (cheap, on-brand, starts the habit). Paid upgrade not before month 4, and only once Phase 7 shows the growth loop works. Monetizing before the loop exists kills the loop.

**The line, on the homepage, permanently: *your supporters will never pay, never see an ad, and never get a watermark.*** Whatever else changes, that does not.

---

## Month 1 — August: foundation and recovery

**Goal: stop losing organizers, and get October's pages indexed.**

### Week 1 (Aug 1 to 7) — ship what is already done
- [x] Title, analytics, and bundle fixes *(done Aug 1)*
- [x] Commit, deploy, and apply migration `0007` *(done Aug 4)*
- [ ] Delete the orphaned `public/gif.worker.js`
- [ ] Set the Sentry alert rule, drop `tracesSampleRate` to 0.1
- [ ] Mark `frame_download` as a GA4 key event
- [ ] Full mobile QA pass ([checklist](./LAUNCH_PLAN.md))

### Week 2 (Aug 8 to 14) — Phase 6, organizer email 🔴
The highest-leverage work in the quarter.
- [x] Migration: `organizer_email`, `email_sent_at`, `milestone_notified` on `campaigns`, plus `campaign_recovery_tokens` *(0007)*
- [x] Optional "email me my links" field on create. Not an account, not a password
- [x] Transactional email via `lib/email.ts`. Calls the Resend REST API with fetch, no SDK dependency, and no-ops with a warning when `RESEND_API_KEY` is unset **(set that env var to switch sending on)**
- [x] "Your campaign is live" email with the dashboard link, fired async so mail failures never fail a create
- [x] `/privacy` updated: what we store, why, that supporters are never emailed, and how to be removed

### Week 3 (Aug 15 to 21) — Phase 6, recovery
- [x] `/recover` and `/recover/[token]`. Single-use, 24h expiry, and the request endpoint always returns the same response so it cannot be used to test whether an address exists
- [x] `/mine` keeps localStorage as the fast path and now links to email recovery
- [x] Milestone emails at 25/50/100/250/500/1k/5k/10k and on hitting goal, guarded by `milestone_notified` so a traffic burst cannot double-send
- [ ] Ship National Nonprofit Day (Aug 17) as the first real test of the new flow

### Week 4 (Aug 22 to 31) — SEO groundwork for October
- [x] `/for/companies` and `/for/universities` published, with FAQ schema, and picked up automatically by `/for` and the sitemap
- [x] `/vs/twibbonize` published, including a section on where Twibbonize is the better pick, and a correction address
- [ ] Submit updated sitemap, request indexing on the new October campaign pages
- [x] Migration 0008 drops nine social tables and four auth tables. Schema and relations rewritten to campaign-only; 34 dead scripts moved to `scripts/_archive`

**End of August you should have:** a working organizer email list, October pages indexed, and a live recovery path.

---

## Month 2 — September: the growth loop and the September moments

**Goal: make supporters into organizers, and prove it with September traffic.**

### Week 5 (Sep 1 to 7) — September campaigns live
- [ ] Artwork for the September moments (Suicide Prevention, Childhood Cancer, Hispanic Heritage, Alzheimer's), then seed them as campaigns
- [ ] Reach out to 10 organizations running these campaigns. Offer the frame free, built for them, with their logo. This is manual and it is the fastest path to real flagship campaigns
- [ ] Watch supporter conversion daily. If it is under 30%, fix the supporter page before anything else

### Week 6 (Sep 8 to 14) — Phase 7, the post-download moment
- [ ] Rebuild the screen after download: celebrate, prompt a share, *then* ask "running something yourself?" Never before the download
- [ ] Referral attribution: record which campaign a new campaign came from
- [ ] Report your viral coefficient for the first time

### Week 7 (Sep 15 to 21) — Phase 7, social proof
- [ ] Supporter wall using the existing unused `campaign_uses.image_url`. Opt-in, moderated, off by default
- [ ] Embeddable counter widget an organizer can drop on their own site. Free backlinks and real SEO value
- [ ] Donate button ships here. Quiet, in the footer and on the post-download screen, framed as keeping Ollabs ad-free

### Week 8 (Sep 22 to 30) — October readiness
- [ ] **Pre-October push.** Contact 25 breast cancer nonprofits, hospital foundations, and corporate wellness teams with a ready-made frame. Two weeks before the month starts, not during
- [ ] Load-test a campaign page. October could spike hard and ISR caching has not been proven under load
- [ ] Confirm the supporter counter behaves under cache pressure

**End of September you should have:** a measurable viral coefficient, at least three real organizations running campaigns, and a donate button live.

---

## Month 3 — October: the big month

**Goal: this is the traffic event of the year. Ride it and learn from it.**

### Week 9 (Oct 1 to 7) — Breast Cancer Awareness Month opens
- [ ] Breast Cancer artwork live and indexed
- [ ] Daily conversion monitoring. Ship small fixes fast, do not start new features
- [ ] Every organizer who creates a campaign gets the milestone email sequence

### Week 10 (Oct 8 to 14) — World Mental Health Day (Oct 10)
- [ ] Mental health artwork live and promoted
- [ ] First case study drafted from whichever campaign performed best. Ask permission first
- [ ] Mid-month conversion review: where exactly does upload drop-off happen now that `photo_uploaded` is instrumented

### Week 11 (Oct 15 to 21) — Unity Day (3rd Wednesday) and Domestic Violence Awareness
- [ ] Unity Day artwork pushed to schools. Schools plan late, so this timing is right
- [ ] Domestic Violence artwork pushed to shelters and advocacy orgs
- [ ] Start Giving Tuesday outreach now. December 1 pages are already seeded and should be ranking

### Week 12 (Oct 22 to 31) — measure and decide
- [ ] Full quarter review: supporter conversion, upload drop-off, organizer repeat rate, viral coefficient
- [ ] Ask every organizer with 50+ supporters what would have made them pay
- [ ] **Decide on the paid upgrade** based on those answers, not on guesses
- [ ] Plan Q4 (Giving Tuesday, Movember, Veterans Day, holidays)

---

## Frames for this quarter

**Open.** A designed frame set was built and then pulled; the calendar moments below still need artwork before they can ship. `public/frames` holds only `team-usa.png`.

The dates are the fixed part and they do not move: Breast Cancer Awareness Month and Domestic Violence Awareness Month (October), Unity Day (third Wednesday of October), World Mental Health Day (October 10), Suicide Prevention and Childhood Cancer Awareness (September), Hispanic Heritage Month (September 15 to October 15), plus Giving Tuesday on December 1, which needs pages ranking by October.

Whatever the artwork ends up being, the constraint that matters is that a profile picture is usually seen at 32 to 48 pixels. Colour and silhouette carry the signal at that size; fine detail and thin curved type do not survive it.

---

## The three numbers to watch

1. **Supporter conversion** (`frame_download` ÷ campaign page views). Target 40%+. Under 30% means fix the page, not the marketing.
2. **Viral coefficient** (new organizers per campaign). Target above 0.2. This is the difference between a growth engine and a website.
3. **Organizer repeat rate.** The business. Everything in Phase 6 exists to move this one.

---

## What not to do this quarter

No avatar builder. No native app. No social features. No paid tier before November. October is a traffic event you get once a year, and the worst possible use of it is shipping something new in the middle and breaking the flow that was working.
