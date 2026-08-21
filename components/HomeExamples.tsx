"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { FrameConfig } from '@/lib/types';
import { MIN_SUPPORTERS_TO_DISPLAY } from '@/lib/frameValidity';

// Card box and gap in px, per breakpoint. These live in JS because the loop maths
// needs real numbers, and they stay fixed during a scroll so nothing in the track
// ever changes size while you are dragging it.
//
// They are ALSO published as CSS custom properties (see BREAKPOINT_CSS below) and
// the markup lays itself out from those, not from these. The reason is hydration:
// the server has no viewport, so it renders desktop sizing, and a phone used to
// paint 176px cards and then snap them to 132px once the media query effect ran.
// A media query resolves on the first paint, before any JavaScript, so the sizes
// are right immediately and the JS state only drives scroll arithmetic.
const SIZES = {
    mobile: { card: 132, gap: 12, canvas: 264 },
    desktop: { card: 176, gap: 16, canvas: 352 },
};

const MOBILE_QUERY = '(max-width: 639px)';

// Keep these two in sync with SIZES above.
const BREAKPOINT_CSS = `
.ollabs-carousel{--ollabs-card:${SIZES.desktop.card}px;--ollabs-gap:${SIZES.desktop.gap}px}
@media ${MOBILE_QUERY}{.ollabs-carousel{--ollabs-card:${SIZES.mobile.card}px;--ollabs-gap:${SIZES.mobile.gap}px}}
.ollabs-spotlight::-webkit-scrollbar{display:none}
`;

// Three back-to-back copies of the list. You start in the middle one, so there is a
// full copy of runway in both directions before a seam is ever reached.
const COPIES = 3;
const MIN_FOR_LOOP = 4;

// Only cards within this many positions of the spotlight get a live canvas. Caps the
// number of drawing surfaces at ~11 no matter how long the list is, which matters a
// lot on phones where canvas memory is tight.
const RENDER_WINDOW = 5;

export interface HomeCampaign {
    slug: string;
    title: string;
    supporterCount: number;
    frame: FrameConfig;
}

function ExampleCanvas({ frame, size }: { frame: FrameConfig; size: number }) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const cx = size / 2, cy = size / 2, radius = size / 2;

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const g = ctx.createLinearGradient(0, 0, 0, size);
        g.addColorStop(0, '#3f3f46');
        g.addColorStop(1, '#27272a');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
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
    }, [frame, size, tick]);

    return <canvas ref={ref} width={size} height={size} className="w-full h-full rounded-full" />;
}

export const HomeExamples: React.FC<{ campaigns: HomeCampaign[] }> = ({ campaigns }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

    const base = campaigns.length;
    const loop = base >= MIN_FOR_LOOP;
    const items = loop ? Array.from({ length: COPIES }, () => campaigns).flat() : campaigns;
    const startIndex = loop ? base : 0;

    // Seeded to the middle copy so the server markup and the first client render agree,
    // and so the cards that get a canvas on first paint are the ones actually on screen.
    const [active, setActive] = useState(startIndex);

    // Drives the scroll arithmetic only. Layout comes from the CSS variables, so a
    // phone is laid out correctly on the first paint and this catching up a tick
    // later moves nothing on screen.
    const [size, setSize] = useState(SIZES.desktop);
    useEffect(() => {
        const mq = window.matchMedia(MOBILE_QUERY);
        const apply = () => setSize(mq.matches ? SIZES.mobile : SIZES.desktop);
        apply();
        mq.addEventListener('change', apply);
        return () => mq.removeEventListener('change', apply);
    }, []);

    const { card: CARD, gap: GAP, canvas: CANVAS } = size;
    const copyWidth = (CARD + GAP) * base;

    const offsetFor = useCallback((index: number, viewport: number) => {
        const pad = viewport / 2 - CARD / 2;
        return pad + index * (CARD + GAP) + CARD / 2 - viewport / 2;
    }, [CARD, GAP]);

    // Geometry is derived from constants instead of read back from the DOM. The previous
    // version measured offsetLeft on every card on every scroll frame, which forced a
    // synchronous layout each time and was the main source of the stutter.
    const update = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;

        let left = track.scrollLeft;

        // Once you drift a full copy from the middle, jump back by exactly one copy.
        // The content either side is identical, so the seam is invisible.
        if (loop && copyWidth > 0) {
            if (left < copyWidth * 0.5) {
                left += copyWidth;
                track.scrollLeft = left;
            } else if (left > copyWidth * 1.5) {
                left -= copyWidth;
                track.scrollLeft = left;
            }
        }

        const nearest = Math.round(left / (CARD + GAP));
        setActive(Math.max(0, Math.min(nearest, items.length - 1)));
    }, [loop, copyWidth, items.length, CARD, GAP]);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        track.scrollLeft = offsetFor(startIndex, track.clientWidth);
        update();

        const onScroll = () => {
            if (rafRef.current !== null) return;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                update();
            });
        };

        track.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            track.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [update, offsetFor, startIndex]);

    const step = useCallback((delta: number) => {
        const track = trackRef.current;
        if (!track) return;
        const target = loop ? active + delta : Math.max(0, Math.min(active + delta, items.length - 1));
        track.scrollTo({ left: offsetFor(target, track.clientWidth), behavior: 'smooth' });
    }, [active, loop, items.length, offsetFor]);

    if (!campaigns || campaigns.length === 0) return null;

    const fade = 'linear-gradient(to right,transparent,black 12%,black 88%,transparent)';

    return (
        <div className="ollabs-carousel relative">
            <style>{BREAKPOINT_CSS}</style>

            <div
                ref={trackRef}
                className="ollabs-spotlight flex items-start overflow-x-auto overscroll-x-contain"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    gap: 'var(--ollabs-gap)',
                    paddingLeft: 'calc(50% - var(--ollabs-card) / 2)',
                    paddingRight: 'calc(50% - var(--ollabs-card) / 2)',
                    WebkitMaskImage: fade,
                    maskImage: fade,
                    WebkitOverflowScrolling: 'touch',
                } as React.CSSProperties}
                role="region"
                aria-label="Live campaigns"
            >
                {items.map((c, i) => {
                    const isActive = i === active;
                    const near = Math.abs(i - active) <= RENDER_WINDOW;
                    // Only the middle copy is exposed to assistive tech and tab order, so
                    // the duplicates never read out as extra links.
                    const isReal = !loop || (i >= base && i < base * 2);
                    return (
                        <Link
                            key={`${c.slug}-${i}`}
                            href={`/c/${c.slug}`}
                            aria-hidden={!isReal || undefined}
                            tabIndex={isReal ? undefined : -1}
                            className="group shrink-0 flex flex-col items-center outline-none"
                            style={{ width: 'var(--ollabs-card)' }}
                        >
                            <div
                                className="rounded-full overflow-hidden"
                                style={{
                                    width: 'var(--ollabs-card)',
                                    height: 'var(--ollabs-card)',
                                    // Scale and opacity only. The previous version animated width
                                    // and height, which reflowed the whole flex row every frame and
                                    // dragged the scroll position around with it.
                                    transform: `scale(${isActive ? 1 : 0.62})`,
                                    opacity: isActive ? 1 : 0.4,
                                    transition: 'transform 300ms ease-out, opacity 300ms ease-out',
                                    // Promoted only while spotlit. Putting will-change on all of
                                    // them would hand the compositor 48 layers to hold on a phone.
                                    willChange: isActive ? 'transform' : 'auto',
                                    backgroundColor: near ? undefined : 'rgba(0,0,0,0.06)',
                                }}
                            >
                                {near && <ExampleCanvas frame={c.frame} size={CANVAS} />}
                            </div>
                            <div
                                className="mt-1 text-center transition-opacity duration-300 ease-out"
                                style={{ height: '3rem', opacity: isActive ? 1 : 0 }}
                            >
                                <p
                                    className="text-sm font-semibold text-ink group-hover:text-brand-deep transition-colors truncate"
                                    style={{ maxWidth: 'var(--ollabs-card)' }}
                                >
                                    {c.title}
                                </p>
                                {c.supporterCount >= MIN_SUPPORTERS_TO_DISPLAY && (
                                    <p className="text-xs text-muted">{c.supporterCount.toLocaleString()} supporting</p>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous campaign"
                className="hidden md:flex absolute left-4 h-11 w-11 items-center justify-center rounded-full bg-paper/80 backdrop-blur border border-ink/10 text-ink hover:bg-paper transition-colors"
                style={{ top: 'calc(var(--ollabs-card) / 2)', transform: 'translateY(-50%)' }}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next campaign"
                className="hidden md:flex absolute right-4 h-11 w-11 items-center justify-center rounded-full bg-paper/80 backdrop-blur border border-ink/10 text-ink hover:bg-paper transition-colors"
                style={{ top: 'calc(var(--ollabs-card) / 2)', transform: 'translateY(-50%)' }}
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};
