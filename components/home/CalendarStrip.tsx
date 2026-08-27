"use client";
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FramePreview } from '@/components/FramePreview';
import { FrameConfig, FrameType } from '@/lib/types';
import { track } from '@/lib/analytics';
import { ArrowRight } from 'lucide-react';

export interface StripItem {
    slug: string;
    name: string;
    dateTop: string;     // "AUG"
    dateMain: string;    // "10", or "" for a month-long observance
    countdown: string;   // "2 days away" | "Today" | "Happening now"
    past: boolean;
    frame: FrameConfig;
}

/**
 * Home calendar must not download multi-MB custom frame PNGs. Vector / color
 * rings stay; CUSTOM_IMAGE becomes a solid ring in the day's color.
 */
function thumbFrame(frame: FrameConfig): FrameConfig {
    if (!frame.imageUrl) return frame;
    return {
        ...frame,
        type: FrameType.SOLID,
        imageUrl: undefined,
        color1: frame.color1 || '#01BEF6',
    };
}

/**
 * The home page calendar: a row of date cards, each carrying that day's frame
 * and linking through to its page.
 *
 * The cards are built to read as calendar tiles, month over day number, because
 * the date is the thing someone is scanning for. Frame second, name third.
 *
 * It scrolls itself to today on mount rather than starting at the left edge, so
 * the first thing in view is what is next rather than what was missed. When
 * everything fits, the row centres instead of hugging the left, which is what
 * stops a short calendar looking like a loading error.
 */
export const CalendarStrip: React.FC<{ items: StripItem[] }> = ({ items }) => {
    const scroller = useRef<HTMLDivElement>(null);
    const marker = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scroller.current, m = marker.current;
        if (!el || !m) return;
        if (el.scrollWidth <= el.clientWidth) return;   // fits, nothing to centre
        el.scrollLeft = m.offsetLeft - el.clientWidth / 2 + m.clientWidth / 2;
    }, [items.length]);

    if (items.length === 0) return null;

    const firstUpcoming = items.findIndex((i) => !i.past);
    const markerAt = firstUpcoming === -1 ? items.length : firstUpcoming;

    const card = (i: StripItem) => (
        <Link
            key={`${i.slug}-${i.dateTop}-${i.dateMain}`}
            href={`/day/${i.slug}`}
            onClick={() => track('calendar_strip_click', { day: i.slug, past: i.past })}
            className={`group shrink-0 w-[190px] snap-center rounded-2xl border border-ink/10 bg-cream
                        overflow-hidden transition-all hover:border-brand/50
                        ${i.past ? 'opacity-50 hover:opacity-90' : ''}`}
        >
            {/* date header, the calendar tile */}
            <div className="bg-ink/[0.04] border-b border-ink/10 px-4 py-2.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted leading-none mb-1">
                    {i.dateTop}
                </p>
                <p className="font-display text-2xl font-extrabold leading-none">
                    {i.dateMain || i.dateTop}
                </p>
            </div>

            <div className="p-4">
                <FramePreview
                    frame={thumbFrame(i.frame)}
                    size={160}
                    className="w-[136px] h-[136px] rounded-full mx-auto mb-3"
                />
                <p className="font-display font-bold text-sm leading-snug text-center line-clamp-2 mb-1">
                    {i.name}
                </p>
                <p className="text-xs text-muted text-center">{i.countdown}</p>
            </div>
        </Link>
    );

    return (
        <div
            ref={scroller}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-6 justify-start lg:justify-center
                       [scrollbar-width:thin] [scrollbar-color:rgba(6,20,31,0.2)_transparent]"
        >
            {items.slice(0, markerAt).map(card)}

            {/* today marker, sitting in the run rather than floating over it */}
            <div ref={marker} className="shrink-0 flex flex-col items-center justify-center gap-2 px-1 snap-center">
                <span className="w-2.5 h-2.5 rounded-full bg-brand ring-4 ring-brand/25" />
                <span className="w-px flex-1 bg-ink/15" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-deep whitespace-nowrap [writing-mode:vertical-rl]">
                    Today
                </span>
                <span className="w-px flex-1 bg-ink/15" />
            </div>

            {items.slice(markerAt).map(card)}

            <Link
                href="/day"
                className="group shrink-0 w-[190px] snap-center rounded-2xl border border-dashed border-ink/20
                           flex flex-col items-center justify-center gap-2 hover:border-brand/50 transition-colors"
            >
                <ArrowRight size={20} className="text-muted group-hover:text-brand-deep transition-colors" />
                <span className="text-sm font-bold">See all days</span>
            </Link>
        </div>
    );
};
