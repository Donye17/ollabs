"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { FrameConfig } from '@/lib/types';
import { MIN_SUPPORTERS_TO_DISPLAY } from '@/lib/frameValidity';

const CANVAS = 512;

export interface HomeCampaign {
    slug: string;
    title: string;
    supporterCount: number;
    frame: FrameConfig;
}

function ExampleCanvas({ frame }: { frame: FrameConfig }) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const cx = CANVAS / 2, cy = CANVAS / 2, radius = CANVAS / 2;

        const draw = () => {
            ctx.clearRect(0, 0, CANVAS, CANVAS);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            const g = ctx.createLinearGradient(0, 0, 0, CANVAS);
            g.addColorStop(0, '#3f3f46');
            g.addColorStop(1, '#27272a');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, CANVAS, CANVAS);
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.beginPath();
            ctx.arc(cx, cy - radius * 0.18, radius * 0.32, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx, cy + radius * 0.72, radius * 0.6, radius * 0.42, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            try {
                FrameRendererFactory.render({ ctx, centerX: cx, centerY: cy, radius, frame, onImageLoad: () => setTick((t) => t + 1) });
            } catch (e) {
                console.error('example frame render failed', e);
            }
        };

        draw();
    }, [frame, tick]);

    return <canvas ref={ref} width={CANVAS} height={CANVAS} className="w-full h-full rounded-full" />;
}

export const HomeExamples: React.FC<{ campaigns: HomeCampaign[] }> = ({ campaigns }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const frameRef = useRef<number | null>(null);
    const [active, setActive] = useState(0);

    // Whichever card sits closest to the horizontal centre of the track is the one in
    // the spotlight. Measured from live layout rather than tracked by index, so it stays
    // correct through drags, snaps, keyboard scrolling and resizes alike.
    const recompute = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        const centre = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDistance = Number.POSITIVE_INFINITY;
        itemRefs.current.forEach((el, i) => {
            if (!el) return;
            const distance = Math.abs(el.offsetLeft + el.offsetWidth / 2 - centre);
            if (distance < bestDistance) {
                bestDistance = distance;
                best = i;
            }
        });
        setActive(best);
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const onScroll = () => {
            if (frameRef.current !== null) return;
            frameRef.current = requestAnimationFrame(() => {
                frameRef.current = null;
                recompute();
            });
        };

        recompute();
        track.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            track.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        };
    }, [recompute]);

    const scrollToIndex = useCallback((index: number) => {
        const clamped = Math.max(0, Math.min(index, campaigns.length - 1));
        itemRefs.current[clamped]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [campaigns.length]);

    if (!campaigns || campaigns.length === 0) return null;

    return (
        <div className="relative">
            <style>{`.ollabs-spotlight::-webkit-scrollbar{display:none}`}</style>

            <div
                ref={trackRef}
                className="ollabs-spotlight flex items-center gap-6 sm:gap-10 overflow-x-auto snap-x snap-mandatory scroll-smooth py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                role="region"
                aria-label="Live campaigns"
            >
                {/* Spacers let the first and last card reach the centre of the track. */}
                <div aria-hidden className="shrink-0 w-[calc(50vw-5.5rem)]" />

                {campaigns.map((c, i) => {
                    const isActive = i === active;
                    return (
                        <Link
                            key={c.slug}
                            href={`/c/${c.slug}`}
                            ref={(el) => { itemRefs.current[i] = el; }}
                            onFocus={() => scrollToIndex(i)}
                            aria-current={isActive || undefined}
                            className="group shrink-0 snap-center flex flex-col items-center gap-3 outline-none"
                        >
                            <div
                                className={[
                                    'transition-all duration-500 ease-out rounded-full',
                                    isActive
                                        ? 'w-40 h-40 sm:w-48 sm:h-48 opacity-100 drop-shadow-xl'
                                        : 'w-28 h-28 sm:w-32 sm:h-32 opacity-40 group-hover:opacity-70',
                                ].join(' ')}
                            >
                                <ExampleCanvas frame={c.frame} />
                            </div>
                            <div
                                className={[
                                    'text-center transition-all duration-500 ease-out',
                                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1',
                                ].join(' ')}
                            >
                                <p className="text-sm font-semibold text-ink group-hover:text-brand-deep transition-colors whitespace-nowrap">
                                    {c.title}
                                </p>
                                {c.supporterCount >= MIN_SUPPORTERS_TO_DISPLAY && (
                                    <p className="text-xs text-muted">{c.supporterCount.toLocaleString()} supporting</p>
                                )}
                            </div>
                        </Link>
                    );
                })}

                <div aria-hidden className="shrink-0 w-[calc(50vw-5.5rem)]" />
            </div>

            <button
                type="button"
                onClick={() => scrollToIndex(active - 1)}
                disabled={active === 0}
                aria-label="Previous campaign"
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-paper/80 backdrop-blur border border-ink/10 text-ink hover:bg-paper disabled:opacity-0 transition-all"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                type="button"
                onClick={() => scrollToIndex(active + 1)}
                disabled={active === campaigns.length - 1}
                aria-label="Next campaign"
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-paper/80 backdrop-blur border border-ink/10 text-ink hover:bg-paper disabled:opacity-0 transition-all"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};
