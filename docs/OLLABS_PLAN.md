# Ollabs: the plan

**Written 29 August 2026. This is the single source of truth.**
Everything below replaces the plans listed in section 1. If another document
disagrees with this one, this one wins.

Read alongside, and only alongside:
- `AGENTS.md` for hard technical rules learned from production breakage
- `.cursor/rules/ollabs-ux.mdc` for who the user is and how interfaces must behave
- `docs/REAL_PHONE_QA.md` for the device QA gate
- `docs/ADSENSE_SLOTS.md` for ad config reference

---

## 1. What this replaces

Move these into `docs/_archive/` so agents stop reading them as instructions:

| File | Why |
|---|---|
| `OLLABS_90_DAY_PLAN.md` | Aug 1 to Oct 31 window, Month 1 spent with items still unchecked. Its live Sept and Oct work is carried into section 6 below. Its audience premise is wrong. |
| `OLLABS_SOCIAL_PLAN.md` | Its August calendar is unrecoverable and its "24 frames built" premise is false. Its channel templates are carried into section 7. |
| `OLLABS_MVP_ROADMAP.md` | Self-declared superseded on Aug 1. Everything but Phase 5 is done. |
| `OLLABS_GAME_PLAN.md` | Phases 0 to 2 shipped. Phase 3 is restated better in Phases 5-10. Its data model says "keep better-auth", which was uninstalled in migration 0008. |
| `LAUNCH_PLAN.md` | An Aug 1 snapshot. Its QA checklist is superseded by and partly contradicts `REAL_PHONE_QA.md`. |
| `PROJECT_REPORT.md` | Describes the pre-pivot product: stickers, GIF export, avatar builder, community gallery, three OAuth providers. None of it exists. |
| `TECH_STACK.md` | Two of five sections document removed packages. |
| `INTEGRATIONS.md` | **Extract the env var list first.** Section 4 publishes a live-looking admin secret in plain text: `secret=ollabs-2026-master-key`. Rotate it. |
| `docs/PATH_TO_MILLION_HANDOFF.md` | Phases A through E are complete per its own checkboxes. Its ads line ("`/c` lean, 1 before save, 2 after") is stale and contradicts `AGENTS.md`. |

Keep, unchanged: `OLLABS_CALENDAR_SPEC.md` (the only spec of record for day-page
anatomy and the 40-page cap), `docs/ADSENSE_REMEDIATION.md`,
`docs/ADSENSE_SLOTS.md`, `docs/REAL_PHONE_QA.md`, `docs/tester-hub-setup.md`,
`docs/FUTURE_IDEAS.md`, `OLLABS_PHASES_5-10.md` (Phase 9 and 10 only, the rest
is shipped or wrong).

```
mkdir -p docs/_archive
git mv OLLABS_90_DAY_PLAN.md OLLABS_SOCIAL_PLAN.md OLLABS_MVP_ROADMAP.md \
       OLLABS_GAME_PLAN.md LAUNCH_PLAN.md PROJECT_REPORT.md TECH_STACK.md \
       INTEGRATIONS.md docs/_archive/
git mv docs/PATH_TO_MILLION_HANDOFF.md docs/_archive/
```

---

## 2. Corrected facts

Five things the old plans got wrong. Everything downstream follows from these.

**Ollabs is a Brazilian product.** Production data, 28 Aug, from
`campaign_uses.supporter_country`: Brazil 5,560, India 149, Philippines 15,
Vietnam 9, **United States 7**. That is 97% Brazil. The "English-language
Western organizations" thesis in `OLLABS_PHASES_5-10.md`, the LinkedIn-first
channel decision, the US awareness-month calendar, and the September outreach to
US nonprofits were all aimed at a segment measuring seven frame uses. They are
cancelled.

**Twibbonize is not your competitor in Brazil.** They are 72% Indonesia and 19%
Philippines. Brazil is 0.6% of their traffic. Your actual competitors are
**Apoio.top**, **WhatsArt**, and **DivulgaCand**, all Brazilian, all small, all
unfunded. Keep `/vs/twibbonize` because it ranks, but stop treating Twibbonize as
the benchmark. See section 4.

**There are 426 public campaigns, not 37.** Every doc except the AdSense one
still says 37. An 11x change that nothing was replanned around.

**AdSense was rejected.** The remediation programme in
`docs/ADSENSE_REMEDIATION.md` is the largest open work item in the repo. Ads
currently serve nowhere, because approval never happened.

**There is no error monitoring.** Sentry was removed from the codebase entirely.
No config files, no dependency, no references. Four documents still carry open
Sentry tasks and two describe it as installed infrastructure. Outages are
currently silent. Decide whether to reinstall it or accept that.

---

## 3. The thesis

Ollabs is two products fused into one, and that part was always right:

| Lane | Job |
|---|---|
| Campaigns `/c/[slug]` | The viral instrument. Publish, send to WhatsApp, supporters save a framed photo. Median first supporter at 4.5 minutes, 84% inside the hour, dead after 24. |
| Hubs `/u/[handle]` | The permanent bio URL. What an organizer pastes into Instagram. Retention and identity. |

Canonical funnel: Instagram or TikTok bio, to `/u/{handle}`, to Support on the
featured frame, to `/c` save, to WhatsApp share again.

**Who it is for, corrected:** Brazilian organizers. Candidates and their teams
during election cycles. Then universities and student groups, churches, unions,
local businesses, and event organizers, in roughly that order of evidenced
willingness to pay.

**The lines that never move.** Supporters never pay. Supporters never see a
watermark on their photo. Supporters never see an ad on `/c` or `/u`. Supporters
never need an account. No social feed. No supporter caps, ever, on any tier.

That last one resolves a real contradiction: `OLLABS_GAME_PLAN.md` and
`OLLABS_MVP_ROADMAP.md` both proposed higher supporter caps as a paid lever,
while `OLLABS_PHASES_5-10.md` promised unlimited supporters forever. The promise
wins. Capping supporters punishes the organizer for succeeding and it breaks the
one thing that makes the product spread.

---

## 4. What the competitors do better, and what to do about it

I could not take screenshots (the device connection dropped), so this is
structural rather than pixel level. It is still specific.

**Apoio.top:** two navigation items. One dominant brand color, purple #2e2076.
Eight sections, roughly 850 words. Pricing on the homepage. PIX payment. Offers a
*nota fiscal*.

**Frameyu:** four navigation items. Pricing on the homepage, non-renewing, free
tier explicitly stated with no watermark and no ads. Their headline is the
sharpest in the category: put your campaign on every profile picture. One link,
one upload, supporters export a polished on-brand photo in seconds, no account,
no watermark.

### Why yours reads busier

**Your footer has roughly eighteen links in four columns.** Theirs have two to
four navigation items total. Nothing signals "small tool made by a person" faster
than a footer built like an enterprise site map. Cut it to Product, Guides,
Legal, and one language switch.

**Your homepage carries three blog articles with bylines, dates and eight-minute
read times.** That is content-farm furniture on a product homepage, and it exists
because of the AdSense remediation, not because a visitor wants it. Move guides
to `/guides` and link once from the footer.

**Two of your homepage sections rendered empty.** A mobile text extraction showed
"Top campaigns" and "What is coming up" as headings with nothing underneath. If
those hydrate slowly, a first-time visitor on a slow Brazilian phone sees a page
with two empty holes in it. Nothing reads less clean than that, and it costs you
your best social proof. **Verify this first, before any restyling.** If it is a
render timing problem, server-render those two sections.

**You have three accent colors.** `brand` cyan, `coral`, and `amber`, plus
`brand.deep` and `brand.wash`. Apoio uses one. Pick cyan as the single accent,
demote coral to errors only, and retire amber from product surfaces.

**Nobody shows the tool above the fold, including you.** Both competitors open
with marketing copy. This is an opportunity rather than a gap: put a working
frame preview on the first screen, with a real photo already in it, so the
product demonstrates itself before anyone reads a word. That would differentiate
you visually from everyone in the category.

**Your headline is weaker than Frameyu's.** "Bring your people together" is a
feeling. Theirs names the outcome. Rewrite in Portuguese first, outcome first,
with the promise attached: one link, under a minute, no account and no watermark
for the people you are asking.

---

## 5. Design work

Execute in this order. The competitor teardown behind these choices is in
`docs/OLLABS_UX_SPEC.md`; the paste-ready brief is `docs/CURSOR_NEXT_TASK.md`.

Note: the Ollabs supporter page is already the leanest in the category, about
45 words against Frameyu's 61 and Apoio's 306. The felt quality gap is
language, in-app-browser reliability and the step after download, not clutter
on `/c`.

1. Verify and fix the empty homepage sections.
2. Cut the footer to three columns and one language control.
3. Move the guide cards off the homepage.
4. Collapse to a single accent color.
5. Rewrite the hero, Portuguese first, outcome first.
6. Put a live frame preview on the first screen.
7. Restyle `/mine` and campaign manage. These are the least designed surfaces and
   the ones an organizer judges you by once the frame works.
8. Accessibility floor, then motion, in that order and last.

Do not add a component library. Do not add `framer-motion` or `motion`. Watermelon
UI is a reference for card density, empty states and dialog placement, not a
dependency. Reasoning in `docs/DESIGN_AND_UX_STACK.md`.

---

## 6. The plan

### Now, through 4 October

The Brazilian first round is 4 October and the runoff is 25 October. This is the
only window this year where a buyer with a legally earmarked budget is actively
in market. Everything else waits.

**Revenue, week 1.** Build the payment path: PIX, and an invoice. Manual
fulfilment is fine at this volume. Do not build billing infrastructure. Pull the
list of campaigns on your own platform already running candidate frames with
ballot numbers. That is a warm-lead list with supporter counts attached.

**Revenue, week 2.** Contact them individually, not by broadcast. Show each one
their own supporter count. The offer is R$150 to R$300 for a campaign package:
custom slug, no Ollabs branding, CSV export, priority support through the
election, and a proper invoice. The invoice is the reason the purchase can
happen at all.

**Revenue, week 3 through 3 October.** Fulfil and support. Ship nothing new
between 1 and 4 October.

**Product, in parallel and only these.**
- Load-test a campaign page. **Answered 29 August 2026.** ISR of 60s holds.
  A localhost run of `scripts/load-test-campaign.mjs` against
  `/c/foto-com-drpitagoras-o9qr` (20 concurrent, 400 requests, `cache: no-store`)
  is the rehearsal: the HTML is a cached React tree plus one Neon read on
  miss, not a per-hit query. Ten times the August weekend is on the order of
  ~2 requests/second average and a few hundred at a spike. ISR is the right
  cache for that. Do not force-dynamic `/c`.
- Supporter counter under ISR: **accept the lag.** The person who just saved
  already sees their increment from `POST /api/campaigns/[slug]/use`. Everyone
  else can be up to 60 seconds behind. That is social proof, not a ticker.
  Hydrating the count from the API on every visit would multiply Neon load
  through the exact window we are trying to survive. Leave the SSR number.
- Portuguese depth on create and manage. 96.7% of your users are reading English.
- The empty homepage sections, and the footer cut.
- Rebuild the post-download moment: celebrate, prompt the share, then and only
  then ask whether they are running something themselves. This is the single
  highest-leverage unshipped growth item and it has been unchecked in two plans
  since July.

**Ops, this week.**
- Rotate `ollabs-2026-master-key` and remove it from `INTEGRATIONS.md`.
- Switch Vercel to Pro.
- Decide on error monitoring. **Done 29 August 2026:** `@sentry/nextjs` is
  wired for server and edge only (`docs/SENTRY.md`). No browser SDK, so the
  `/create` bundle delta is 0 kb gzipped. Set `SENTRY_DSN` in Vercel and
  create the alert rule in that checklist. A thrown API error will appear
  once the DSN is present.
- Mark `frame_download` as a key event in GA4.
- Set `CRON_SECRET` and confirm `/api/cron/zero-supporter` runs.

**Do not do in this window:** AdSense review request, new locale trees, new
`/for` pages, the paid tier build, hubs work, or anything in `FUTURE_IDEAS.md`.

### Next, October to December

**Finish the AdSense remediation, or abandon it deliberately.** Tier 2 needs
eight to ten articles of 1,000 to 1,800 words with original screenshots, a named
byline and a visible date. Seven guides exist. Ship the rest, wait for crawling,
then request review once. Do not request a review after each deploy.

Worth asking honestly before spending that effort: display advertising on this
traffic was priced in your own monetization doc at $1 to $6 per weekend and $150
to $750 in a peak week. The article programme is weeks of work for that. If the
direct sales test in October works, consider dropping the AdSense workstream and
taking the guides off the homepage entirely.

**Then, in order:** supporter proof on the campaign page (opt-in, moderated, off
by default, using the unused `campaign_uses.image_url`); attribution so a new
campaign records its referring campaign; the annual re-engagement email 30 days
before a recurring date; Q4 and H1 2027 day pages per `OLLABS_CALENDAR_SPEC.md`,
staying under the 40-page cap.

**Consolidate, do not expand, the use-case pages.** Twelve English `/for` pages
go to the six with real search demand, the rest merge in as sections with 301s.
This directly contradicts Phase 8 of `OLLABS_PHASES_5-10.md`, which said to add
four more. The AdSense finding wins.

### Later, 2027

Paid tier proper, per `OLLABS_PHASES_5-10.md` Phase 9, but only after the October
test produces a real answer. Indonesian Independence Day on 17 August is the
single largest date in this category worldwide and you have eleven months to
prepare for it. Philippine school year, Mexican 16 September, and the Brazilian
municipal cycle after that.

---

## 7. Marketing

Two funnels. Do not blend them.

**Organizers arrive by search.** Portuguese first. Your `/for`, `/day` and `/vs`
pages are the right structure and need depth, not more pages. Add comparison
pages against the actual Brazilian competitors, not only Twibbonize.

**Supporters arrive by WhatsApp.** 56% of category traffic is direct, which in
these markets means messaging apps stripping referrers. Your own August data said
the same: 812 of 1,524 sessions had no source.

**The distribution formula, from a competitor's own published guide.** Instagram
bio link converts highest, then pinned WhatsApp group messages, then weekly Story
links with link stickers, then printed QR codes. Message copy stays short,
promises under one minute with no app to install, and puts the link alone on the
last line. Build this into the product so the organizer does not have to write
it. Measure frames generated and frames actually posted as separate steps.

**Social accounts.** The week-one setup checklist in the archived social plan was
never done and its August calendar is gone. Redo it minimally: Instagram in
Portuguese, one handle, bio in Portuguese with the promise line. Skip LinkedIn.
Your buyers are not there. Build the fifteen-second upload-frame-download clip.
It is still the most persuasive asset you do not have.

**Do not point Madak clients at Ollabs.** Both archived docs raised this. It
stands.

---

## 8. Money

**Two products.**

**A. Campaign package, sold direct. R$150 to R$300 per campaign.** Candidates
now, then universities, unions, dioceses, NGOs. Custom slug, no Ollabs branding,
CSV export, priority support, invoice.

**B. Self-serve unlock. R$19 to R$29, one time, non-renewing, PIX.** Prices
against Apoio.top at R$14.99 rather than Twibbonize at $11.99 per month. Two
independent operators in two of your markets converged on low-ticket
non-recurring pricing. Campaign budgets are episodic, not subscription shaped.

This resolves the four incompatible pricing models across the archived docs
($19-49, $29-49, $99-299 annual, and unspecified freemium). One-time, two tiers,
Brazilian pricing, PIX.

**Never behind a paywall:** supporter experience, supporter count, campaign
count, image quality.

**Honest expectation.** At R$200 with a 10% conversion on 100 identified
candidate campaigns, that is R$2,000. It does not replace an income. What it buys
is proof of the organizer-pays model with real money before any billing
infrastructure gets built, plus a customer list and testimonials going into the
much larger 2027 seasons.

**The donate button** was scheduled in the archived 90-day plan and never shipped.
Leave it unshipped. It was framed as keeping Ollabs ad-free while an AdSense
workstream was running, and donation conversion on a free tool runs a fraction of
a percent. It would not fund anything.

---

## 9. Metrics

Five, in priority order. Everything else is diagnostic.

1. **Percentage of campaigns with at least one supporter within an hour.** The
   zero-supporter rate is roughly 58%. This is the number.
2. **Post-save share rate on `/c`.**
3. **Supporter conversion on the campaign page.** If it drops under 30%, fix the
   supporter page before anything else.
4. **Paid campaign packages sold.** New. Zero today.
5. **Viral coefficient.** Currently 0.03 by the archived plan's own measurement.
   Target above 0.2. It has never once been reported.

If a change does not move 1, 2 or 4, question whether it belongs in this quarter.

---

## 10. Open questions

Answer these. Each one is currently blocking or duplicated across documents.

1. Error monitoring: **answered 29 August 2026.** Server and edge Sentry only.
   See `docs/SENTRY.md`. No client SDK (0 kb gzipped delta on `/create`).
2. ISR and the supporter counter: **answered 29 August 2026.** Keep 60s ISR.
   Accept the lag. Do not hydrate the count client-side. Details in section 6.
3. AdSense: finish Tier 2 and request review, or abandon the programme and take
   the guides off the homepage?
4. Do the `frames` and `collections` concepts survive alongside campaigns, or get
   folded in? They are half-alive in the codebase.
5. Foreign-vendor invoicing to a Brazilian campaign: resolved in the lawyer
   conversation, or still open?
