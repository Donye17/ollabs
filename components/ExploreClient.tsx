"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { CampaignGridThumb } from '@/components/CampaignGridThumb';
import { prefetchFrameOverlays } from '@/components/renderer/strategies';
import { FrameConfig, FrameType } from '@/lib/types';

export interface ExploreCampaign {
    slug: string;
    title: string;
    supporterCount: number;
    frame: FrameConfig;
    supporterPhotos: string[];
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
//      112-176 CSS px, so 256 is still 2x on a retina phone.
const INITIAL_WINDOW = 8;
const THUMB_RESOLUTION = 256;

// Start drawing before the card is actually on screen, so it is already painted
// by the time it scrolls into view.
const NEAR_VIEWPORT = '600px';

function frameOverlayUrl(frame: FrameConfig): string | null {
    if (typeof frame.imageUrl === 'string' && frame.imageUrl.trim()) return frame.imageUrl.trim();
    if (frame.type === FrameType.CUSTOM_IMAGE) return null;
    return null;
}

const LazyPreview: React.FC<{ frame: FrameConfig; supporterPhotos: string[]; eager: boolean }> = ({
    frame,
    supporterPhotos,
    eager,
}) => {
    const holder = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(eager);

    useEffect(() => {
        if (show) return;
        const el = holder.current;
        if (!el) return;

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

    return (
        <div
            ref={holder}
            className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden bg-ink/5 ring-1 ring-ink/10"
        >
            {show && (
                <CampaignGridThumb
                    frame={frame}
                    supporterPhotos={supporterPhotos}
                    size={THUMB_RESOLUTION}
                    className="w-full h-full"
                />
            )}
        </div>
    );
};

export const ExploreClient: React.FC<{ campaigns: ExploreCampaign[] }> = ({ campaigns }) => {
    const [q, setQ] = useState('');

    // Warm custom-frame PNGs for the first screen before canvases mount, so
    // thumbs paint artwork instead of a gray silhouette flash (Lane B5).
    useEffect(() => {
        const eager = campaigns.slice(0, INITIAL_WINDOW);
        prefetchFrameOverlays(eager.map((c) => frameOverlayUrl(c.frame)));
        for (const c of eager) {
            for (const url of c.supporterPhotos.slice(0, 2)) {
                const img = new Image();
                img.decoding = 'async';
                img.src = url;
            }
        }
    }, [campaigns]);

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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                    {filtered.map((c, i) => (
                        <Link key={c.slug} href={`/c/${c.slug}`} className="group flex flex-col items-center gap-3">
                            <LazyPreview
                                frame={c.frame}
                                supporterPhotos={c.supporterPhotos}
                                eager={i < INITIAL_WINDOW}
                            />
                            <div className="text-center max-w-[11rem]">
                                <p className="text-sm font-semibold text-ink group-hover:text-brand-deep transition-colors line-clamp-2">
                                    {c.title}
                                </p>
                                <p className="text-xs text-muted mt-0.5">
                                    {c.supporterCount.toLocaleString()} supporting
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
