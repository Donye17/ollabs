"use client";
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FramePreview } from '@/components/FramePreview';
import { FrameConfig } from '@/lib/types';
import { track } from '@/lib/analytics';
import { ArrowRight } from 'lucide-react';

export interface StripItem {
    slug: string;
    name: string;
    when: string;        // "Monday, August 10, 2026"
    countdown: string;   // "2 days away" | "Today" | "Happening now"
    past: boolean;
    frame: FrameConfig;
}

/**
 * The home page timeline: a horizontal run of awareness days with today marked,
 * past behind and upcoming ahead.
 *
 * It scrolls itself to today on mount rather than starting at the left edge,
 * because the first thing someone should see is what is next, not what they
 * already missed. Past entries stay in the run so the calendar reads as a year
 * rather than as a to-do list, but they are dimmed and sit behind the marker.
 */
export const CalendarStrip: React.FC<{ items: StripItem[] }> = ({ items }) => {
    const scroller = useRef<HTMLDivElement>(null);
    const marker = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scroller.current, m = marker.current;
        if (!el || !m) return;
        // centre the today marker without scrolling the whole page
        el.scrollLeft = m.offsetLeft - el.clientWidth / 2 + m.clientWidth / 2;
    }, [items.length]);

    if (items.length === 0) return null;

    const firstUpcoming = items.findIndex((i) => !i.past);
    const markerAt = firstUpcoming === -1 ? items.length : firstUpcoming;

    const card = (i: StripItem) => (
        <Link
            key={`${i.slug}-${i.when}`}
            href={`/day/${i.slug}`}
            onClick={() => track('calendar_strip_click', { day: i.slug, past: i.past })}
            className={`group shrink-0 w-[168px] snap-center transition-opacity ${i.past ? 'opacity-45 hover:opacity-80' : ''}`}
        >
            <FramePreview
                frame={i.frame}
                className="w-[168px] h-[168px] rounded-full mb-3 transition-transform group-hover:-translate-y-1"
            />
            <p className="font-display font-bold text-sm leading-snug mb-0.5 line-clamp-2">{i.name}</p>
            <p className="text-xs text-muted">{i.countdown}</p>
        </Link>
    );

    return (
        <div className="relative">
            <div
                ref={scroller}
                className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 px-6 md:px-8
                           [scrollbar-width:thin] [scrollbar-color:rgba(6,20,31,0.2)_transparent]"
            >
                {items.slice(0, markerAt).map(card)}

                {/* today marker, sitting in the run rather than floating over it */}
                <div ref={marker} className="shrink-0 flex flex-col items-center justify-start pt-[52px] snap-center">
                    <span className="w-3 h-3 rounded-full bg-brand ring-4 ring-brand/25" />
                    <span className="w-px flex-1 bg-ink/15 my-2" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-deep whitespace-nowrap">
                        Today
                    </span>
                </div>

                {items.slice(markerAt).map(card)}

                <Link
                    href="/day"
                    className="group shrink-0 w-[168px] snap-center flex flex-col items-center justify-center gap-2
                               rounded-2xl border border-dashed border-ink/20 h-[168px] hover:border-brand/50 transition-colors"
                >
                    <ArrowRight size={20} className="text-muted group-hover:text-brand-deep transition-colors" />
                    <span className="text-sm font-bold">See all days</span>
                </Link>
            </div>
        </div>
    );
};
