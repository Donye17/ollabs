# Ollabs SEO, AEO, and AdSense audit

Date: 2026-10-19. Branch: `cursor-seo-aeo-ads`. Live crawl of `https://ollabs.studio/sitemap.xml` and `robots.txt` on that date. Scores are 0 to 10. Evidence is a live fetch or a file in this repo.

## Inventory

Sitemap: about 70 URLs. Robots allows public marketing and campaign URLs, disallows `/api/`, `/hub`, `/mine`, `/login`, `/recover`, `/admin`, and points at the sitemap. `/c` and `/u` stay crawlable on purpose so their `noindex` tag can be read.

| Type | URLs | EN | PT |
| --- | --- | --- | --- |
| Home | `/`, `/pt` | Yes | Yes, hreflang pair |
| Comparison | `/vs/twibbonize`, `/pt/vs/twibbonize`, `/vs/linktree` | Yes | Twibbonize only. Linktree is EN only |
| Use cases | `/for` plus 10 slugs | Yes | Hub plus 6 slugs (`igrejas`, `escolas`, `times`, `ongs`, `eventos`, `conscientizacao`). Missing PT: fundraisers, birthdays, companies, universities |
| Calendar | `/day` plus 24 day slugs and one coffee independents list | English body, including `independencia-do-brasil` and `dia-das-criancas` | No PT URLs |
| Guides | `/guides` plus 7 articles | Yes | None |
| Product | `/create`, `/explore`, `/updates` | Yes | Product UI translates. These URLs do not have PT twins |
| Legal | `/about`, `/contact`, `/privacy`, `/terms` | Yes | None. Left in English on purpose |
| Hindi stub | `/hi` returns 200, not in the sitemap | n/a | n/a |
| Campaigns and hubs | not in the sitemap | UGC, `noindex` | Supporter locale follows the campaign, not a marketing URL |

`ads.txt` is one line: `google.com, pub-5665798404376894, DIRECT, f08c47fec0942fa0`.

## Competitors

Twibbonize ranks as the category name. Its help center (help.twibbonize.com) is English Intercom articles with a table of contents and a direct definition up front. Examples: what a frame twibbon is, how to remove ads by paying. The product page leads with "create, share one link, supporters add a photo." Scale is the moat, not the writing.

Framefy (framefy.pro) is the Brazilian content competitor. Dedicated answer pages, not a blog dump:

- `/como-colocar-moldura-em-foto` opens with "three steps, in the phone browser, no app, no account," then numbered supporter steps and organizer steps, then an FAQ.
- `/moldura-para-foto-de-perfil` defines the frame in the first paragraph and answers size, account, and price in an FAQ.
- `/alternativa-ao-twibbonize` is Portuguese, answer-first, and claims the campaign page shows no third-party ads.

Apoio.top is a product homepage (profile and Story frames, free with a watermark, PRO removes ads). Thin editorial. Apoio Eleitoral is a separate election-frame pitch with three steps and almost no FAQ. Neither is an article site. They win on brand queries, not on how-to queries.

## What 2026 AEO actually rewards

Google's own generative-search guide says `llms.txt` is ignored by Google Search, and that rewriting for AI or adding special markup is not required to be cited there. Other agents still request `/llms.txt` (spec at llmstxt.org: one H1, a blockquote summary, then H2 lists of links). Shipping the file does not buy Google rankings. It does give non-Google agents a map.

What does show up in both Google's guide and current answer-engine writeups:

- A passage of about 40 to 60 words that answers the question by itself, near the top.
- Question-shaped headings and visible FAQs. FAQPage schema only when that Q&A is on the page. Google no longer shows FAQ rich results for most sites. The schema still tells a parser which sentence answers which question.
- HowTo schema only when the steps are visible.
- A real `dateModified`, a named author, and Article plus Organization so the page has an entity behind it.
- Freshness and being the page that matches the query. Framefy already owns the Portuguese how-to. Ollabs did not have a page whose H1 is that question.

## Baseline scores

### 1. Technical SEO: 7

Pass: unique titles and descriptions on the sampled URLs (home, `/pt`, guides, a guide, both Twibbonize pages, a day page, church use cases, privacy). Canonicals are correct, including `/pt/for/igrejas` not inheriting the `/pt` canonical. hreflang pairs exist in HTML as `rel="alternate"` for home, `/for`, and `/vs/twibbonize`. Organization, WebSite, and WebApplication JSON-LD are in the root layout. FAQPage JSON-LD matches visible questions on home, guides, use cases, day pages, and both comparison pages. Viewport is `device-width` with pinch zoom left on. Sitemap and robots agree.

Fail or gap:

- `<html lang="en">` on every URL, including `/pt`. Portuguese copy sits in `<div lang="pt-BR">` from `app/pt/layout.tsx`, which is valid for that subtree. Reading the path inside the root layout to flip the html element would mark the whole site dynamic, so this stays.
- Guides have no hreflang because there is no Portuguese twin.
- No BreadcrumbList.
- No HowTo, even on `start-a-campaign`, which already has numbered steps.
- `/hi` is allowed and returns 200 but is absent from the sitemap.
- `/llms.txt` is a 404.

### 2. Content and keywords: 5

| Query | Page that should rank | Gap |
| --- | --- | --- |
| how to add a frame to my profile picture | none. Closest is the iPhone save guide, which answers a failure mode | Framefy's how-to is the page an engine would quote |
| Twibbonize alternative | `/vs/twibbonize` and `/pt/vs/twibbonize` | Strong and honest. EN page has no ad unit. PT page has one. Neither links to a how-to |
| moldura para foto de perfil | `/pt` title matches | No long answer page in Portuguese |
| profile picture frame for churches / igrejas | `/for/churches`, `/pt/for/igrejas` | Covered |
| calendar day frames | 24 `/day` pages | Bodies are English, including Brazilian holidays. Next Independência is 2027, so this is not the first gap |
| start a campaign | `/guides/start-a-campaign` | Organizer steps exist. Subtitle is close to an answer but the H1 is not the supporter question |

EN/PT parity: home, 6 use cases, and the Twibbonize comparison. Missing: all 7 guides, 4 use cases, every day page, Linktree, legal.

### 3. AEO readiness: 4

- `llms.txt`: absent (404).
- FAQ schema on guides: yes, and the questions are visible.
- Answer form: guides open with context. `start-a-campaign` is the closest to steps. Nothing leads with a standalone answer to "how do I add a frame."
- Would an engine cite Ollabs for "how to add a frame to my profile picture"? Unlikely. The words are scattered across the iPhone guide and the product UI.
- Would an engine cite Ollabs for "Twibbonize alternative"? Plausible. The comparison page states who pays, in the first paragraph, with a visible FAQ and FAQPage schema, in English and Portuguese.

### 4. AdSense readiness: 7.5

`ads.txt` publisher id `pub-5665798404376894` matches `ca-pub-5665798404376894` in `components/AdSlot.tsx` and the root layout. Live guide HTML for `/guides/start-a-campaign` contains one `ins.adsbygoogle`. Day and `/for` pages contain four, between content blocks, and the first unit on a day page is below `DayFrameTool`, not on the canvas. `/` had zero units in the sampled HTML. Campaign components do not mount `AdSlot`.

| Requirement | Result | Evidence |
| --- | --- | --- |
| ads.txt format and publisher id | Pass | Live file matches the client id. Route handler sets `text/plain` |
| Ad code not rewritten | Pass | `AdSlot` pushes `{}` into `adsbygoogle` |
| Label is Advertisement or Sponsored Links | Pass | Visible label is "Advertisement" |
| Ads distinguishable from content | Pass | Label plus a separate block, not under "resources" or "helpful links" |
| No encouragement to click ads | Pass | No such copy |
| Not on the photo or the frame tool | Pass | Units are outside `DayFrameTool`. None in the campaign client |
| Not on `/create` | Pass | No `AdSlot` on that route |
| Not on campaign pages (`/c`, `/u`) | Pass | No `AdSlot` in campaign components. `surface="campaign"` is unused |
| Guides and info pages may carry units | Pass | One unit mid-guide. SEO units on `/for`, `/day`, locale landings, PT comparison |
| Privacy policy names ads, cookies, and an opt-out | Pass | `/privacy` section 5, Google Ads Settings and aboutads.info |
| About and contact exist | Pass | Both return 200 and are in the sitemap |
| Original content, not a doorway | Pass | Guides and day pages are written here |
| HTTPS | Pass | ollabs.studio |
| Mobile layout | Pass | Thumb-zone rules, 48px guide buttons, viewport allows zoom |
| Accidental-click distance from the primary button | Pass with a watch | Day-page ads start after the frame card, in normal flow. Four units on a long day page is a lot for a phone. They collapse when unfilled |
| Auto ads, anchors, vignettes off | Needs a human | The site only mounts manual units. The AdSense account can still turn Auto ads on, which injects units the code did not place |
| Site approved and serving | Needs a human | Unfilled units collapse. Approval and "Check for updates" on ads.txt are dashboard clicks |
| Two separate ad units (campaign vs SEO) | Needs a human | Code reads `NEXT_PUBLIC_ADSENSE_SLOT_SEO`. Campaign slot is unused. Confirm the SEO unit exists in the dashboard |

## Strategy

Highest leverage is a page an engine can quote for the supporter how-to, in English and Portuguese, using the guide pipeline that already emits FAQ and Article schema and one labelled SEO ad. `llms.txt` is second because it is the explicit AEO gap and it is cheap, with the limit that Google Search will ignore it. Breadcrumbs are third. Translating the whole calendar and the legal pages is not this loop.

Scores get updated at the bottom after each cycle.

## Strategy loop

Each cycle was checked on a production build (`npx next build`, which typechecks) and `npm run lint` (0 errors, the same 6 existing warnings). Markup was fetched from `next start` on port 3457.

### Cycle 1. The missing how-to

Gap: no page answers "how to add a frame to my profile picture," in either language.

Change: `/guides/add-a-frame-to-a-profile-picture` and `/pt/guides/add-a-frame-to-a-profile-picture`. The first paragraph is the answer. Four visible steps. FAQ matches FAQPage. HowTo schema comes from those steps, so `/guides/start-a-campaign` gained HowTo as well. Sitemap and hreflang include the pair. The home footer, the site footer on Portuguese pages, and both Twibbonize pages link to it. One labelled SEO ad sits mid-article. `/c/hugo-wanderley-ajqw` still has zero ad units.

Fetch: both guides 200, H1 matches the query, types include FAQPage, Article, HowTo, HowToStep. English and Portuguese answer sentences are in the HTML. Each has one `ins.adsbygoogle`. Three hreflang alternates.

Re-score: Content 5 to 7. AEO 4 to 6.5. Technical 7 to 7.5. AdSense stays 7.5.

### Cycle 2. llms.txt

Gap: `/llms.txt` was a 404.

Change: `public/llms.txt` follows the llmstxt.org shape (H1, blockquote, H2 link lists) and points at the new guides, the comparison, and the organizer start guide. Google Search does not use this file. Agents that ask for it now get a map.

Fetch: 200, first line `# Ollabs`.

Re-score: AEO 6.5 to 7. Other areas unchanged.

### Cycle 3. Breadcrumbs

Gap: guides had no BreadcrumbList, so the path from home to the article was only in the footer.

Change: every guide shows Home / Guides / the article title, and the same items are in BreadcrumbList. Portuguese guides use Início / Guias.

Fetch: BreadcrumbList on the new guide, the Portuguese guide, and `start-a-campaign`.

Re-score: Technical 7.5 to 8. Other areas unchanged.

### Stop

The next gaps are the ones in AGENT-DECIDED.md: translating the other guides, translating day pages, translating legal copy, and flipping the root `html` lang. None of those is a single change that would beat the how-to, and two of them need a human. A fourth cycle inside those limits would not move a score, so the loop stops at three.

## After scores

| Area | Before | After | Why |
| --- | --- | --- | --- |
| Technical SEO | 7 | 8 | hreflang on the guide pair and the guide index, HowTo on stepped guides, visible breadcrumbs plus BreadcrumbList. `html lang` is still `en` on `/pt` |
| Content and keywords | 5 | 7 | The supporter how-to exists in English and Portuguese and is linked from the Twibbonize pages. Day pages and four use cases are still English only |
| AEO readiness | 4 | 7 | A quotable first paragraph, HowTo, FAQ, and `/llms.txt`. An engine can now cite Ollabs for the how-to and for the Twibbonize comparison |
| AdSense readiness | 7.5 | 7.5 | Placement did not change. New guides carry one labelled unit. Campaign pages still have none. Approval and Auto ads remain dashboard work |

## AdSense steps that need the account owner

These are clicks in a logged-in AdSense or Vercel session. Code cannot do them.

1. Open https://adsense.google.com as the owner of publisher `ca-pub-5665798404376894`.
2. Go to Sites. Confirm `ollabs.studio` says Ready or Approved. If it says Getting ready or Needs attention, open the notice and fix only what it names.
3. Open Ads, then Auto ads, for `ollabs.studio`. Turn Auto ads off. If the page lists them separately, turn off Anchor ads, Vignette ads, and Side rail.
4. Open Ads, then By ad unit. Confirm one Display ad unit for the guide and article pages. Copy its slot id (the `data-ad-slot` number).
5. In the Vercel project for ollabs, set Production env `NEXT_PUBLIC_ADSENSE_SLOT_SEO` to that slot id. Redeploy. Leave `NEXT_PUBLIC_ADSENSE_SLOT_CAMPAIGN` unset. No campaign page mounts a unit.
6. After this deploy is live, in AdSense open Sites, then ads.txt, then Check for updates. The live file is already `google.com, pub-5665798404376894, DIRECT, f08c47fec0942fa0`. Status should become Authorized. If it says Not found, wait and check again. Do not add a second ads.txt under `public/`.
7. Do not turn Auto ads on to speed up review. Manual units are already in the HTML on guides, `/for`, `/day`, and the Portuguese comparison.

## Loop 2 (`cursor-seo-aeo-2`, 2026-10-19)

Starting scores are the after scores above: Technical 8, Content 7, AEO 7, AdSense 7.5.

### Cycle 1. iPhone save guide in Portuguese

Gap: the highest-traffic remaining English guide had no Portuguese twin, and it opened with context instead of the answer. It also had no visible steps, so no HowTo.

Change: `/guides/save-framed-photo-on-iphone` now leads with the save path, and a visible four-step list feeds HowTo. `/pt/guides/save-framed-photo-on-iphone` is the same article in Portuguese, same slug, with FAQPage, Article, HowTo, and BreadcrumbList. Sitemap and hreflang include the pair. `llms.txt` lists both. One labelled ad, from the existing guide shell.

Re-score: Content 7 to 8. AEO 7 to 7.5. Technical 8 to 8.5 (HowTo and hreflang on a guide that had neither). AdSense stays 7.5.

### Cycle 2. Two Brazilian holiday bodies, and the upcoming calendar

Coverage from 19 October 2026. Every upcoming date already in the calendar has an English page. Nothing new was missing:

| Next date | Page | Language before this cycle |
| --- | --- | --- |
| 21 Oct 2026, Unity Day | `/day/unity-day` | English |
| 28 Oct 2026, Sumpah Pemuda | `/day/sumpah-pemuda` | English |
| 29 Oct 2026, National Cat Day | `/day/national-cat-day` | English |
| Through 31 Oct, breast cancer and domestic violence months | those two slugs | English |
| 30 Nov 2026, Bonifacio Day | `/day/philippines-bonifacio-day` | English |
| 5 Dec 2026, Thailand National Day | `/day/thailand-national-day` | English |
| 7 Sep 2027, Independência | `/day/independencia-do-brasil` | English only |
| 12 Oct 2027, Dia das Crianças | `/day/dia-das-criancas` | English only. 12 Oct 2026 has passed, so the page already rolls to 2027 |

Change: Portuguese bodies for Independência and Dia das Crianças at `/pt/day/independencia-do-brasil` and `/pt/day/dia-das-criancas`. Same frame tool, FAQ, and Event schema, hreflang to the English URL. The other upcoming days stay English. Day pages keep four labelled units below the tool, the count already decided. No fifth unit.

Re-score: Content 8 to 8.5. AEO 7.5 to 8. Technical stays 8.5. AdSense stays 7.5.

### Cycle 3. Answer-first on the remaining English guides

Gap: four organizer guides opened with context and had no step list, so an engine had no HowTo and no standalone first paragraph.

Change: custom PNG frame, dashboard, keeping a campaign across phones, and running a campaign people join now open with the answer and a visible three-step list. HowTo comes from that list. The start-a-campaign subtitle now leads with the steps. The hub guide already defined the hub in the first sentence and already had steps, so it was left.

Re-score: AEO 8 to 8.5. Content, Technical, and AdSense unchanged. The pages were already indexed. The gain is that each one can be quoted.

### Stop

The three items in this brief are done. A fourth cycle would be another guide translation or another day page. Either moves Content a little, and neither is in the priority list. Legal copy, root `html lang`, and the AdSense dashboard stay NEEDS-HUMAN. Two further cycles inside those limits would not beat 8.5.

## Loop 2 scores

| Area | Before this loop | After | Why |
| --- | --- | --- | --- |
| Technical SEO | 8 | 8.5 | hreflang and HowTo on the iPhone guide pair, and hreflang on the two Portuguese day URLs. `html lang` is still `en` on `/pt` |
| Content and keywords | 7 | 8.5 | The iPhone save guide is in Portuguese. Independência and Dia das Crianças have Portuguese bodies. Other day pages and four use cases are still English only |
| AEO readiness | 7 | 8.5 | The iPhone guide and the four organizer guides now open with a quotable answer and visible steps. The two holiday pages answer in Portuguese |
| AdSense readiness | 7.5 | 7.5 | The new guide has one labelled unit. Day pages, including the Portuguese ones, stay at four below the tool. Campaign pages still have none |

## Content cadence

- One Portuguese translation of an existing guide each week, starting with "How to save a framed photo on iPhone," because that is the WhatsApp failure mode.
- One new answer page a month, in English and Portuguese the same week, aimed at a query Framefy or Twibbonize already ranks for. Do not publish the English page alone.
- Refresh `/vs/twibbonize` the week Twibbonize changes its watermark or pricing help article, and change the "August 2026" line in the disclaimer.
- In August, before Sete de Setembro, write the Portuguese body for `independencia-do-brasil` and `dia-das-criancas`. Leave the other day pages in English until a day is actually close.
- Do not add `/c` or `/u` URLs to the sitemap.
