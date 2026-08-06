# Spec: the `/day/[slug]` awareness calendar

*August 5, 2026. Phase 8 of [OLLABS_PHASES_5-10.md](./OLLABS_PHASES_5-10.md), pulled forward because October has a deadline.*

---

## What this is

A page per awareness day, month, and season, at `/day/[slug]`. Each one answers "what is this day and how do we mark it" **and** lets a visitor act on it without leaving the page.

Not a blog. A blog post about Breast Cancer Awareness Month gets you a reader who leaves. A day page with a working frame gets you an organizer.

## Why this and not a blog

Twibbonize's traffic is almost entirely calendar-driven: founders' days, graduations, national days, school years. That demand is predictable, recurring, and searchable, and you have already proven you can rank against it. Ollabs sits at #1 for "Twibbonize alternative profile picture frame maker 2026," above SupportersFrame, who are running precisely the blog strategy this replaces.

The advantage over their approach is that a day page converts in place. Theirs sends people back to Google.

---

## The risk, and how we beat it

Google's March 2026 core update hit sites running thin, template-built page sets hard, with reported losses of 60 to 80%. The surviving test is whether **each page answers a distinct query no other page on the site already answers.**

365 near-identical pages would fail that test and could drag down the pages already ranking. Four rules keep us on the right side of it:

1. **Cap the set.** 25 to 40 days, not 365. Every page earns its place or does not ship.
2. **Real editorial per day.** History, the actual date and how it moves, official colour and symbol, how organisations genuinely mark it, and specific campaign ideas. Minimum ~350 words of content that could not be produced by substituting a variable.
3. **Live data no template can fake.** Each page queries real Ollabs campaigns in that day's category and shows them with live supporter counts. This is the strongest differentiator available: the page changes as the platform does.
4. **A working tool on the page.** The frame is usable inline. That is utility, not content, and it is what a competitor's blog post cannot copy.

---

## Data model

Editorial content lives in a TypeScript file, `lib/days.ts`, following the existing `lib/useCases.ts` pattern. Not a database table: this is written content, it belongs in the repo, and it wants to go through review.

```ts
export interface AwarenessDay {
  slug: string;                   // 'national-nonprofit-day'
  name: string;                   // 'National Nonprofit Day'
  kind: 'day' | 'week' | 'month' | 'season';

  // Dates move. Fixed days are a month/day pair; floating ones are a rule.
  date:
    | { type: 'fixed'; month: number; day: number }
    | { type: 'range'; from: [number, number]; to: [number, number] }
    | { type: 'month'; month: number }
    | { type: 'nth-weekday'; month: number; weekday: number; n: number }
    | { type: 'after-thanksgiving'; offsetDays: number };

  colors: { name: string; hex: string }[];   // official ribbon/colour
  symbol?: string;                            // 'ribbon' | 'heart' | none
  category: string;                           // maps to existing CATEGORY_KEYS
  audience: string[];                         // ['nonprofits','hospitals']

  keyword: string;                            // primary search phrase
  intro: string[];                            // 2-3 real paragraphs
  background: string;                         // what the day is, its history
  howOrgsMark: { title: string; body: string }[];  // 3-4, specific
  campaignIdeas: string[];                    // 4-6, actionable
  faqs: { q: string; a: string }[];           // 3-5

  frameSuggestion: { colors: string[]; caption?: string };
  relatedUseCases: string[];                  // slugs from lib/useCases.ts
  relatedDays: string[];                      // internal linking
}
```

Floating dates are computed, never hardcoded. Verified for this cycle:

| Day | Rule | 2026 |
|---|---|---|
| Unity Day | 3rd Wednesday of October | **Oct 21** |
| Giving Tuesday | Tuesday after Thanksgiving | **Dec 1** |
| National Nonprofit Day | fixed Aug 17 | Mon Aug 17 |
| World Mental Health Day | fixed Oct 10 | Sat Oct 10 |

A `nextOccurrence(day, from)` helper returns the upcoming date so pages never go stale and can render "12 days away."

---

## Page anatomy

`/day/[slug]`, roughly in this order:

1. **Hero.** Name, the resolved date, a live countdown ("12 days away" / "happening now" / "next on Oct 21, 2027"). Countdown is the reason this page beats a static blog post.
2. **Use the frame, inline.** Upload, adjust, download, without leaving. Reuses `CampaignClient`.
3. **What this day is.** Real background, 2 to 3 paragraphs.
4. **How organisations mark it.** 3 to 4 specific approaches, written per day.
5. **Live campaigns for this day.** Pulled from the database by category, with real supporter counts. Empty state links to `/create` rather than showing zeroes.
6. **Campaign ideas.** 4 to 6 concrete, copy-pasteable.
7. **Start your own.** Primary CTA into `/create`, prefilled with the day's suggested colours and caption.
8. **FAQ.** 3 to 5, marked up as FAQPage schema.
9. **Related.** Other days, and the relevant `/for` pages.

**Schema:** `FAQPage` on every page, plus `Event` where the day has a fixed date. `Event` markup is what earns the date-and-countdown treatment in results.

**Caching:** ISR with a 1-hour revalidate, matching the campaign pages. The live-campaign block needs to be reasonably fresh without hitting Neon on every crawl.

---

## The set, prioritised

Ordered by when the page must be **live**, which is 60 to 90 days ahead of the date, because organisers plan early. Ranking the week of the event is worthless.

### Ship immediately (October is already inside the window)

| Day | Date 2026 | Category | Live by |
|---|---|---|---|
| Breast Cancer Awareness Month | October | awareness | **now** |
| Domestic Violence Awareness Month | October | awareness | **now** |
| World Mental Health Day | Oct 10 | awareness | **now** |
| Unity Day (bullying prevention) | Oct 21 | school | **now** |
| Suicide Prevention Month | September | awareness | **now** |
| Childhood Cancer Awareness Month | September | awareness | **now** |
| Hispanic Heritage Month | Sep 15 – Oct 15 | community | **now** |
| World Alzheimer's Month | September | awareness | **now** |
| National Nonprofit Day | Aug 17 | cause | **now** (tight) |

### Ship in August, for Q4

Giving Tuesday (Dec 1), Movember, Veterans Day (Nov 11), World AIDS Day (Dec 1), Homecoming season, Thanksgiving, Small Business Saturday.

### Ship in Q4, for H1 2027

World Cancer Day (Feb 4), International Women's Day (Mar 8), Autism Acceptance Month (April), Earth Day (Apr 22), Teacher Appreciation Week (May), Mental Health Awareness Month (May), Pride Month (June), Juneteenth, graduation season, Back to School.

**Stop at 40.** Past that the marginal page is a listicle with a different noun, which is exactly what gets a site flagged.

---

## Implementation

Small, and mostly follows paths that already exist.

- `lib/days.ts` — data + `nextOccurrence()` + `getDay()`
- `app/day/page.tsx` — the calendar index, grouped by month, showing what is coming up
- `app/day/[slug]/page.tsx` — `generateStaticParams`, `generateMetadata`, ISR
- `components/day/DayClient.tsx` — inline frame tool, wrapping the existing campaign renderer
- `app/api/days/[slug]/campaigns/route.ts` — live campaigns by category
- `app/sitemap.ts` — add the day routes
- Cross-links from `/for/[use]` pages into the relevant days

Reuses the existing renderer, `CATEGORY_KEYS`, `frameValidity`, and ISR config. No new dependencies, no schema changes.

**Estimate:** the system is roughly a day. The content is the real cost, at 45 to 60 minutes per day page to write properly. Nine pages for October is the first milestone.

---

## Success metrics

- **Organic impressions on `/day/*`**, weekly, in Search Console
- **Day page → `/create` conversion.** The number that says these are working as product pages rather than as articles
- **Campaigns created with a day's category**, attributed to the day page
- **Ranking for `[day name] profile picture frame`** on the nine October pages

If a day page pulls traffic but nobody starts a campaign, the page is an article and needs the CTA rebuilt. That is the diagnostic to watch.

---

## What would make this fail

- **Shipping all 40 at once with thin copy.** The fastest route to a scaled-content flag, and it would put the pages that already rank at risk.
- **Publishing late.** A page that goes live in October for an October day has missed the planning window.
- **Letting it go stale.** Dates that do not roll forward make the whole set look abandoned, which is why `nextOccurrence()` is computed rather than typed.
