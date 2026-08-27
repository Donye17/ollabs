"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';

/**
 * AdSense connection script, deferred like GA.
 *
 * Ownership still uses the google-adsense-account meta in the root layout.
 * Loading adsbygoogle on every first paint (including home, which has no units)
 * showed up as ~150KB unused JS and competed with LCP on mobile lab audits.
 * Interaction or a few seconds is enough for crawlers and real sessions; units
 * still push() via AdSlot when they mount.
 */
export function DeferredAdSense({ client }: { client: string }) {
    const [load, setLoad] = useState(false);

    useEffect(() => {
        if (!client) return;
        let done = false;
        const arm = () => {
            if (done) return;
            done = true;
            setLoad(true);
            cleanup();
        };

        const timer = window.setTimeout(arm, 5000);
        const opts: AddEventListenerOptions = { once: true, passive: true };
        const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
        const cleanup = () => {
            window.clearTimeout(timer);
            events.forEach((e) => window.removeEventListener(e, arm, opts));
        };
        events.forEach((e) => window.addEventListener(e, arm, opts));

        return cleanup;
    }, [client]);

    if (!load) return null;

    return (
        <Script
            id="adsense-loader"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
        />
    );
}
