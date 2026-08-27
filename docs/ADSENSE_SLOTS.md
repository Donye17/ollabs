# AdSense dual slots (P0.6)

Code in `components/AdSlot.tsx` already branches on surface:

| Surface | Env var | Used on |
|---------|---------|---------|
| `campaign` | `NEXT_PUBLIC_ADSENSE_SLOT_CAMPAIGN` | `/c` lean units |
| `seo` | `NEXT_PUBLIC_ADSENSE_SLOT_SEO` | `/for`, `/day`, hubs, locale SEO |

Fallback order per surface: dedicated slot → `NEXT_PUBLIC_ADSENSE_SLOT_INLINE` → hardcoded default.

Also required: `NEXT_PUBLIC_ADSENSE_CLIENT` (publisher id).

**ads.txt:** served from [`app/ads.txt/route.ts`](../app/ads.txt/route.ts) at `https://ollabs.studio/ads.txt` (plain one-line seller record). If AdSense flips to "Not found", open that URL (expect 200), then use **Check for updates** / wait a few days. Do not put a second copy in `public/`.

The `adsbygoogle.js` loader is deferred via `DeferredAdSense` (interaction or ~5s) so home LCP is not fighting unused AdSense JS. Ownership still uses the `google-adsense-account` meta in `app/layout.tsx`. Units still only mount via `AdSlot`. Keep `/create` ad-free (no units on that page).

**Also on SEO surfaces:** locale landings (`LocaleLandingPage`) and Twibbonize comparison pages (`VsTwibbonizeShell`) use `surface="seo"`. Keep `/create` ad-free.

**Human action:** In AdSense, create two display units (Campaign inline + SEO inline), set the two env vars on Vercel production (and preview if desired). Keep Auto ads, anchors, and vignettes **OFF**.
