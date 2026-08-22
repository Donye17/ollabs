"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';

/**
 * Load GA after first interaction or a few seconds, not during initial paint.
 * lazyOnload still fires inside Lighthouse's network-idle window and tanks mobile lab scores.
 */
export function DeferredAnalytics({ gaId }: { gaId: string }) {
    const [load, setLoad] = useState(false);

    useEffect(() => {
        if (!gaId) return;
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
    }, [gaId]);

    if (!load) return null;

    return (
        <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
        </>
    );
}
