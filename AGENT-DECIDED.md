# Agent-decided product calls

SEO, AEO, and AdSense loop on `cursor-seo-aeo-ads`, 2026-10-19.

1. Ship one bilingual guide for "how to add a frame to a profile picture" instead of translating all seven existing guides in this pass. That is the query Framefy already answers and Ollabs did not. The other guides stay English until a later cadence.

2. Put the Portuguese guide at `/pt/guides/add-a-frame-to-a-profile-picture`, same slug, with hreflang. Do not invent a translated slug. The index at `/pt/guides` lists only guides that have a Portuguese body, and links to the English index for the rest.

3. Emit HowTo schema from the first visible step list on a guide. `start-a-campaign` gains it because those steps were already on the page. Guides without steps do not get an empty HowTo.

4. Ship `/llms.txt` as a map for agents that request it. Google's generative-search guide says Google Search ignores the file. It is not treated as a ranking change.

5. Do not flip `<html lang>` from the root layout. A pathname read there would opt every page out of static rendering. Portuguese routes already set `lang="pt-BR"` on the layout wrapper.

6. Do not translate privacy, terms, or the day-page bodies in this loop. Legal copy stays English until a human reviews it. Calendar pages are English even for Brazilian holidays. The next Independência is in 2027, so the evergreen how-to comes first.

7. Leave day-page ad count at four labelled in-flow units, all below the frame tool. Do not add units to `/c`, `/u`, or `/create`. Do not turn on Auto ads from code. Account toggles stay a human step.

8. Do not add an Apoio comparison page. Apoio.top is a product homepage with less editorial than Twibbonize, and a second comparison without a fresh primary source would be thin.

9. Keep `/hi` out of the sitemap. It is a stub landing, allowed by robots, and not a page to push.

Loop 2, `cursor-seo-aeo-2`, 2026-10-19.

10. Translate the iPhone save guide in full, same slug, under `/pt/guides/`. Add a visible step list on the English page too, so both languages emit HowTo the way the profile-picture how-to does. Do not invent a translated slug.

11. Write the Portuguese bodies for Independência and Dia das Crianças now, at `/pt/day/independencia-do-brasil` and `/pt/day/dia-das-criancas`, even though an earlier cadence said to wait until August. This loop asked for them, and the English pages are already indexed. Dia das Crianças 2026 has passed, so the page shows 12 October 2027.

12. Do not translate the other upcoming days in this loop. Unity Day (21 Oct 2026), Sumpah Pemuda (28 Oct), National Cat Day (29 Oct), the two October months, Bonifacio Day (30 Nov), and Thailand National Day (5 Dec) already have English pages. Leave them in English until a later pass.

13. Bring the remaining English guides up to the how-to standard by rewriting the opening sentence and adding a visible step list where HowTo was missing. Leave the hub guide as it was: the first sentence already defines a hub, and the steps were already on the page.

14. Do not translate privacy or terms. Do not change pricing or billing. Do not add `/c` or `/u` to the sitemap. Do not add ad units. Day pages stay at four labelled units below the frame tool. Guides stay at one.
