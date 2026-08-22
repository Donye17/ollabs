"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { FramePreview } from '@/components/FramePreview';
import { FrameConfig } from '@/lib/types';

export interface ExploreCampaign {
    slug: string;
    title: string;
    supporterCount: number;
    frame: FrameConfig;
}

// Explore loads up to 60 campaigns and used to mount a live canvas for every
// one of them on first paint. Cap drawing surfaces for the same reason the
// home podium only mounts three frames:
//
// Two caps, because a grid has no spotlight to measure distance from:
//   1. Only the first screenful draws immediately. Everything else waits until
//      it comes near the viewport, so a visitor who never scrolls pays for
//      eight canvases instead of sixty.
//   2. Thumbnails render at 256 rather than the 512 default. They display at
//      112-128 CSS px, so 256 is still 2x on a retina phone, at a quarter of
//      the memory.
const INITIAL_WINDOW = 8;
const THUMB_RESOLUTION = 256;

// Start drawing before the card is actually on screen, so it is already painted
// by the time it scrolls into view.
const NEAR_VIEWPORT = '600px';

const LazyPreview: React.FC<{ frame: FrameConfig; eager: boolean }> = ({ frame, eager }) => {
    const holder = useRef<HTMLDivElement>(null);
    // `eager` is derived from the index, so the server and the first client
    // render agree and there is nothing to reconcile.
    const [show, setShow] = useState(eager);

    useEffect(() => {
        if (show) return;
        const el = holder.current;
        if (!el) return;

        // No IntersectionObserver (old in-app browsers): draw rather than show
        // an empty grid. Correctness beats the optimisation.
        if (typeof IntersectionObserver === 'undefined') {
            setShow(true);
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setShow(true);
                    io.disconnect();
                }
            },
            { rootMargin: `${NEAR_VIEWPORT} 0px` }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [show]);

    // Once drawn it stays drawn. Unmounting on scroll-out would return the
    // memory but repaint a blank circle every time you scrolled back.
    return (
        <div ref={holder} className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-ink/5">
            {show && <FramePreview frame={frame} size={THUMB_RESOLUTION} className="w-full h-full" />}
        </div>
    );
};

export const ExploreClient: React.FC<{ campaigns: ExploreCampaign[] }> = ({ campaigns }) => {
    const [q, setQ] = useState('');

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return campaigns;
        return campaigns.filter((c) => c.title.toLowerCase().includes(term));
    }, [q, campaigns]);

    return (
        <div>
            <div className="max-w-md mx-auto mb-10">
                <div className="flex items-center gap-2 bg-cream border border-ink/10 rounded-xl px-4 focus-within:ring-2 focus-within:ring-brand/40 focus-within:border-brand transition-all">
                    <Search size={18} className="text-muted shrink-0" />
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search campaigns"
                        className="flex-1 bg-transparent py-3 text-ink placeholder-muted outline-none"
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="text-center text-muted">No campaigns match that search.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {filtered.map((c, i) => (
                        <Link key={c.slug} href={`/c/${c.slug}`} className="group flex flex-col items-center gap-3 transition-transform hover:-translate-y-1">
                            <LazyPreview frame={c.frame} eager={i < INITIAL_WINDOW} />
                            <div className="text-center">
                                <p className="text-sm font-semibold text-ink group-hover:text-brand-deep transition-colors line-clamp-1">{c.title}</p>
                                <p className="text-xs text-muted">{c.supporterCount.toLocaleString()} supporting</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
