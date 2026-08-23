"use client";

import React, { useEffect, useRef } from 'react';

/**
 * A single, quiet, in-page display ad.
 *
 * The rules this is built to, from what Josh asked for: nothing that pops up,
 * nothing that covers anything, nothing that could be mistaken for part of the
 * product. So this is one responsive display unit, in the normal flow of the
 * page, with a label on it, and that is all it will ever be.
 *
 * Two things worth knowing about it.
 *
 * It takes up no space until an ad actually fills. AdSense marks the <ins> with
 * data-ad-status="unfilled" when nothing bid, and while the account is still in
 * review that is every unit on the site, so globals.css collapses the whole
 * block. Nobody sees an "Advertisement" label sitting above an empty box.
 *
 * Once an ad does fill, the container reserves its height. An ad that pushes
 * the page down as it loads is the most annoying thing a display unit does, and
 * on a phone it moves the button someone is already reaching for.
 *
 * The AdSense script is loaded on first AdSlot mount, not in the root layout,
 * so /create and other ad-free screens never pay for the request.
 *
 * Env: NEXT_PUBLIC_ADSENSE_CLIENT, NEXT_PUBLIC_ADSENSE_SLOT_CAMPAIGN,
 * NEXT_PUBLIC_ADSENSE_SLOT_SEO (optional fallback NEXT_PUBLIC_ADSENSE_SLOT_INLINE).
 * See docs/ADSENSE_SLOTS.md for the Vercel dashboard steps. Auto ads stay OFF.
 */

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-5665798404376894';
const SLOT_CAMPAIGN = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CAMPAIGN
    || process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE
    || '5387568326';
const SLOT_SEO = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SEO
    || process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE
    || '5387568326';

/** Whether ads are configured at all. */
export const adsEnabled = Boolean(CLIENT && SLOT_CAMPAIGN);

type AdSurface = 'campaign' | 'seo';

interface AdSlotProps {
    /** Extra classes for the wrapper, e.g. page-specific spacing. */
    className?: string;
    /**
     * Which inventory bucket this unit belongs to. Separate AdSense slots let
     * fill and RPM optimise differently for post-download campaign pages vs
     * long SEO pages. Falls back to the same default slot if only one is set.
     */
    surface?: AdSurface;
}

let scriptPromise: Promise<void> | null = null;

function loadAdSenseScript(): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    if ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle) {
        return Promise.resolve();
    }
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise((resolve) => {
        const existing = document.querySelector('script[data-ollabs-adsense]');
        if (existing) {
            existing.addEventListener('load', () => resolve());
            // Already loaded earlier in this session.
            if ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle) resolve();
            return;
        }
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
        s.crossOrigin = 'anonymous';
        s.dataset.ollabsAdsense = '1';
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.appendChild(s);
    });
    return scriptPromise;
}

export const AdSlot: React.FC<AdSlotProps> = ({ className = '', surface = 'seo' }) => {
    const pushed = useRef(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const slot = surface === 'campaign' ? SLOT_CAMPAIGN : SLOT_SEO;

    useEffect(() => {
        if (!adsEnabled || pushed.current || !rootRef.current) return;

        let cancelled = false;
        const el = rootRef.current;

        const push = async () => {
            if (cancelled || pushed.current) return;
            // React can mount an effect twice in development. Pushing the same slot
            // twice makes AdSense log "already have ads in them", so guard it.
            pushed.current = true;
            try {
                await loadAdSenseScript();
                if (cancelled) return;
                const w = window as unknown as { adsbygoogle?: unknown[] };
                w.adsbygoogle = w.adsbygoogle || [];
                w.adsbygoogle.push({});
            } catch {
                // Blocked by an extension, offline, or the script never loaded.
            }
        };

        // Wait until the unit is near the viewport so a below-the-fold SEO ad
        // does not compete with the frame tool for bandwidth on a phone.
        if (typeof IntersectionObserver === 'undefined') {
            void push();
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    io.disconnect();
                    void push();
                }
            },
            { rootMargin: '200px 0px' }
        );
        io.observe(el);
        return () => {
            cancelled = true;
            io.disconnect();
        };
    }, [slot]);

    if (!adsEnabled) return null;

    return (
        // ad-slot lets globals.css collapse the whole block, label included, when
        // AdSense reports the unit unfilled. That is the state during review and
        // any time there is no bid, and a labelled empty box is worse than
        // nothing. The min-height only reserves space once an ad actually fills.
        <div ref={rootRef} className={`ad-slot w-full ${className}`}>
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted/60 text-center mb-1.5">
                Advertisement
            </p>
            <div className="min-h-[100px] flex items-center justify-center overflow-hidden rounded-xl">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%' }}
                    data-ad-client={CLIENT}
                    data-ad-slot={slot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>
        </div>
    );
};
