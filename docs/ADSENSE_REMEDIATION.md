# AdSense "Low value content" remediation plan

Status as of Aug 28, 2026: ollabs.studio is **Needs attention / Low value content**.
Ads.txt is Authorized, so the seller file is not the problem. This is a
human-ish content review of the site as a whole.

---

## What the reviewer is actually reacting to

"Low value content" is the catch-all AdSense uses for three separate things.
Ollabs is currently tripping all three at once.

1. Ad units sit on the emptiest pages on the site.
2. The indexable surface is dominated by templated pages.
3. There is almost no original informational content to balance any of it.

Ranked by how much each one is likely costing us:

### 1. Ads are rendering on the thinnest pages we have (highest impact)

`AdSlot` is mounted in:

- `components/campaign/CampaignClient.tsx` -> every `/c/<slug>` page
- `components/hub/HubPublicView.tsx` -> every `/u/<handle>` page
- `components/hub/HubEditorClient.tsx` -> the signed-in hub editor
- the SEO shells (`UseCasePageShell`, `VsTwibbonizeShell`, `LocaleLandingPage`,
  `LocalizedForHub`), `/day`, `/day/<slug>`, `/for`

The first three are the problem. A campaign page is a frame image, a title, a
counter and a button. A hub is a bio line and some links. Both are
user-generated, both are the majority of URLs in our sitemap (up to 5,000
campaigns + 2,000 hubs vs about 100 editorial URLs), and both carry ads. From a
reviewer's seat that is the textbook pattern: ads placed on pages with little or
no publisher content.

The hub **editor** is worse than thin. Serving ads inside a logged-in tool UI is
a placement problem on its own, separate from content value.

### 2. The crawlable surface reads as programmatic

- 39 use-case pages: 12 English plus 7 es, 7 id, 7 pt, 6 tl, every one of them
  rendered from the same `UseCasePageShell` with the same skeleton (2 intro
  paragraphs, 3 benefits, 2 FAQs, related links, CTA). About 300 words each.
- 5 translations of `/vs/twibbonize`, plus `/vs/linktree`.
- 5 locale homepages, one of which (`/hi`) is a stub with no child pages and
  reuses the English message bundle (`getMessages('en').landingHi`).

The English copy in `lib/useCases.ts` is genuinely written, not spun, and I
would defend it. But a reviewer skimming 8 URLs in a row that differ only in the
noun ("fundraisers", "nonprofits", "churches", "schools") sees scaled content.
The ×5 language duplication multiplies that impression without adding a single
new idea.

### 3. There is no real body of content underneath it

Total original informational content on the site: **2** entries in
`lib/guides.ts` (`hub` and `start-a-campaign`), both routed, each roughly 600 to
900 words. (An earlier draft of this doc said 4; a `grep -c "slug:"` had counted
the type definition and the `getGuide` lookup. It is 2.) `/about` is solid. `/explore` is a thumbnail grid with two
sentences of copy. `/updates` is a changelog.

So: ~100 indexable URLs, and under 2,000 words of actual articles behind them.
There is nothing on the site a person would arrive at, read, and leave better
informed. That is the specific thing AdSense is looking for and not finding.

### 4. Minor, but free to fix

- No standalone `/contact` page. `hello@ollabs.studio` is buried inside `/about`
  and `/privacy`. Reviewers look for About + Contact + Privacy + Terms as
  four discoverable, footer-linked pages.
- `/hi` in the sitemap with English message content under a Hindi meta title.

---

## The fix

### Tier 1: structural, ~2 hours, do before anything else

These are the changes that move us from "ads on empty pages" to "ads only on
pages we would defend."

| # | Change | Files |
|---|---|---|
| 1.1 | Remove `AdSlot` from `HubEditorClient.tsx` entirely. No ads in a signed-in tool. | `components/hub/HubEditorClient.tsx` |
| 1.2 | Gate `AdSlot` in `CampaignClient.tsx` behind a content threshold: only render if the campaign has a description over ~150 chars AND supporter_count > 0. Thin campaigns show no ad. | `components/campaign/CampaignClient.tsx` |
| 1.3 | Same gate on `HubPublicView.tsx`: only if bio is non-empty and the hub has at least one public campaign. | `components/hub/HubPublicView.tsx` |
| 1.4 | Stop listing `/c/` and `/u/` in the sitemap unless they clear the same threshold, and add `robots: { index: false }` to the ones that do not. | `app/sitemap.ts`, `app/c/[slug]/page.tsx`, `app/u/[handle]/page.tsx` |
| 1.5 | Add `/contact` with the real operator name, `hello@ollabs.studio`, and a response-time line. Link it in `SiteFooter.tsx` next to About/Privacy/Terms. | new `app/contact/page.tsx`, `components/SiteFooter.tsx` |
| 1.6 | Either translate `/hi` properly or drop it from the sitemap and add noindex. Half a locale is worse than none. | `app/hi/page.tsx`, `app/sitemap.ts` |

Note on 1.2 and 1.3: this reduces our ad inventory, and campaign pages are
where post-download attention lives, so it is real revenue we are deferring.
It is the right trade until approval. The gate is a one-line constant we can
loosen after we are in.

### Tier 2: content, 2 to 3 weeks, this is the actual approval condition

Ship **8 to 10 real articles**, 1,000 to 1,800 words each, with original
screenshots from the product. Not more use-case landers. Articles that answer a
question someone actually typed, where Ollabs is the example rather than the
subject. Working set:

1. How to run a profile-frame campaign that people actually join (the full
   playbook, with the WhatsApp-first-hour timing)
2. What makes a frame design work on a phone: the transparent-PNG window,
   safe areas, contrast against dark and light photos
3. Twibbonize is shutting features behind paywalls: what your options are now
   (honest comparison, includes the ones that are not us)
4. Running an awareness day campaign: a 7-day timeline
5. Church and small-nonprofit playbook: getting an older congregation to
   actually change their profile picture
6. Why profile-picture campaigns work at all (social proof, some real sourcing)
7. School spirit weeks and club recruitment: what we see work
8. The organizer metrics that matter and the ones that do not
9. Frame design mistakes: 8 real before/afters
10. How to write the ask that goes with the link

Rules for these: original screenshots (not stock), a named author byline, a
visible publish date, and no page shipping under 900 words. Put them at
`/guides/<slug>` and extend `lib/guides.ts` rather than inventing a second
system. Link them from the homepage and the footer so they are not orphans.

I can draft these. Figure 2 to 3 per session, and you supply or approve the
screenshots.

### Tier 3: thin the templated surface, ~3 hours

Do this at the same time as Tier 2, not before.

- Consolidate the 12 English use-case pages down to the 6 with real search
  demand, and merge the rest into `/for` as sections. Redirect the retired
  slugs.
- For the ones that stay, add 300 to 500 words of genuinely distinct content
  each: a real example campaign, specific numbers, a screenshot. Different
  content, not a different noun in the same sentence.
- Keep the translated use-case pages only for locales where we have actual
  traffic. Check Search Console first. Everywhere else, keep the translated
  homepage and `/vs/twibbonize`, drop the `/for/<slug>` tree.

---

## Reapply sequence

1. Ship Tier 1 and Tier 3 in one deploy.
2. Ship the first 5 articles. Wait for them to be crawled (check Search
   Console coverage, usually 3 to 7 days).
3. Ship the remaining articles.
4. Only then click "Request review" in AdSense.

Do not request a review after each deploy. Each rejection makes the next review
slower and a repeat rejection on the same ground is much harder to come back
from. One request, after the site actually looks different.

Realistic timeline: 3 to 4 weeks to the review request.

## What not to do

- Do not generate the articles wholesale and publish 30 of them. Scaled content
  is a separate and more serious policy violation than low value content, and it
  is the one Google has been enforcing hardest.
- Do not remove ads entirely from the site during review. There is nothing to
  approve if there are no units, and the account is already verified.
- Do not add more locale trees or more `/for/<noun>` pages until we are approved.

---

## Policy citations (from the links in the rejection notice)

The exact language to hold the fixes against:

- **Inventory value**, publisher policies: "We do not allow Google-served ads on
  screens without publisher-content or with low-value content." This is the one
  the `/c/` and `/u/` ad placements violate directly.
- **Unique content**, AdSense 10015918: pages need "enough unique content so
  that we can determine what your site is about" and "substantial value and
  originality when compared to other sites covering similar subjects."
  Explicitly forbidden: "cloaking and doorway pages, pages with little to no
  content, or pages optimized for specific keywords" and "duplicate content
  within the same page or across multiple pages."
- **User experience**, same page: an "accessible, easy-to-use navigation bar,"
  content organized by topic, readable text, everything clickable. Relevant to
  the guides being orphaned from the nav.
- **Thin content**, webmaster 9044175: thin pages with "little or no added
  value," doorway pages, scaled content abuse.
- **Spam policies**, publisher policies 11035931: doorway pages built for search
  engines, "unnecessary, repeated use of keywords."

Note that scaled content abuse is a *more* serious finding than low value
content. Mass-generating articles to clear this rejection would trade a
recoverable problem for a much harder one.

The executable version of this plan, written for Cursor, is in
`docs/CURSOR_ADSENSE_PROMPT.md`.

---

## Production data, Aug 28 2026 (this supersedes the Tier 1 and Tier 3 plans above)

Queried the live database rather than guessing at thresholds. Two findings
changed the plan.

**1. There is no viable ad gate for campaign pages.** Of 426 public campaigns:

| | count | share |
|---|---|---|
| Empty description | 233 | 55% |
| Zero supporters | 279 | 65% |
| 26+ supporters | 55 | 13% |
| Description 150+ chars AND 1+ supporter | **13** | **3%** |

A threshold gate would admit 13 pages. And supporter count barely correlates
with description length, so popular campaigns are often the ones with no text at
all. Decision: no ads and no indexing on `/c/` or `/u/`, unconditionally. Ad
inventory moves to editorial pages only. Revisit after approval, most likely by
requiring a description at publish time, which is a product change, not a
config one.

Hubs: 17 handles, 1 with a bio over 80 chars. Not worth a gate either.

**2. Ollabs is a Brazilian product.** From `campaign_uses.supporter_country`:

| Country | Frame uses |
|---|---|
| Brazil | 5,560 |
| India | 149 |
| Philippines | 15 |
| Vietnam | 9 |
| US | 7 |

97% Brazil. Decision: delete the `es`, `id`, and `tl` trees entirely, about 20
templated pages serving nobody, and 301 them to the homepage. Keep Portuguese
fully and invest in it more, not less. `/hi` stays as a noindexed stub until it
is genuinely translated.

Note: `publisher_country` only exists from migration 0014, so campaign-creation
geo is partial. The supporter numbers are the reliable ones and say the same.

Search Console was not reachable for this analysis: the Chrome extension was not
connected and the browser pane's Google profile is not signed in. The usage data
above answers the same question more directly anyway, since it measures people
who actually used the product rather than impressions.

The executable plan reflecting all of this is `docs/CURSOR_ADSENSE_PROMPT.md`.
