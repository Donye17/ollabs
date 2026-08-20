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
 */

// Both are public values that appear in the page source anyway, so they are
// defaulted here the same way GA_ID is in app/layout.tsx. Nothing to configure
// in Vercel; an env var can still override either one.
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-5665798404376894';
const SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE || '5387568326';

/** Whether ads are configured at all. Also used to gate the loader script. */
export const adsEnabled = Boolean(CLIENT && SLOT);

interface AdSlotProps {
    /** Extra classes for the wrapper, e.g. page-specific spacing. */
    className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ className = '' }) => {
    const pushed = useRef(false);

    useEffect(() => {
        if (!adsEnabled || pushed.current) return;
        // React can mount an effect twice in development. Pushing the same slot
        // twice makes AdSense log "already have ads in them", so guard it.
        pushed.current = true;
        try {
            const w = window as unknown as { adsbygoogle?: unknown[] };
            w.adsbygoogle = w.adsbygoogle || [];
            w.adsbygoogle.push({});
        } catch {
            // Blocked by an extension, offline, or the script never loaded.
            // None of that is worth showing anyone.
        }
    }, []);

    if (!adsEnabled) return null;

    return (
        // ad-slot lets globals.css collapse the whole block, label included, when
        // AdSense reports the unit unfilled. That is the state during review and
        // any time there is no bid, and a labelled empty box is worse than
        // nothing. The min-height only reserves space once an ad actually fills.
        <div className={`ad-slot w-full ${className}`}>
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted/60 text-center mb-1.5">
                Advertisement
            </p>
            <div className="min-h-[100px] flex items-center justify-center overflow-hidden rounded-xl">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%' }}
                    data-ad-client={CLIENT}
                    data-ad-slot={SLOT}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>
        </div>
    );
};
