'use client';

import { useEffect, useRef, useState } from 'react';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { prefetchFrameOverlays } from '@/components/renderer/strategies';
import { DEFAULT_FRAME } from '@/lib/constants';
import { FrameType, type FrameConfig } from '@/lib/types';

/**
 * Homepage hero only. The supporter canvas stays still: that preview is the
 * product, and motion there reads as the photo slipping. Here the fan is the
 * pitch, so one photo may crossfade while the other two hold.
 *
 * Photos come only from /hero/photo-01.jpg … photo-07.jpg. A missing file is
 * skipped. Nothing else is substituted: no generated faces, no stock, no
 * supporter uploads.
 *
 * The rings are the published overlay art from three live campaigns, drawn
 * through FrameRendererFactory with the same cutout the campaign page uses.
 */

/**
 * Desktop circles match the old Top campaigns fan (208px center).
 * Mobile stays at least that fan's phone size (156px) and fits a 390px screen.
 */
const DESKTOP_FAN = { circle: 208, step: 108, drop: 28, pad: 8 };
const MOBILE_FAN = { circle: 156, step: 60, drop: 20, pad: 2 };
type FanMetrics = typeof DESKTOP_FAN;

function fanSize(m: FanMetrics) {
    return {
        w: m.pad + m.step * 2 + m.circle + m.pad,
        h: m.pad + m.drop + m.circle + m.pad,
    };
}

function placements(m: FanMetrics) {
    return [
        { x: m.pad, y: m.pad + m.drop, rotate: -16, z: 1 },
        { x: m.pad + m.step, y: m.pad, rotate: 0, z: 3 },
        { x: m.pad + m.step * 2, y: m.pad + m.drop, rotate: 16, z: 2 },
    ] as const;
}

/** Campaign-art colors, so a late photo never flashes a blank paper circle. */
const SLOT_TINT = ['var(--frame-green)', 'var(--frame-magenta)', 'var(--frame-purple)'] as const;

const SWAP_MS = 3500;
const FADE_MS = 250;
const PHOTO_COUNT = 7;

/** Left Hugo, center Valkyries, right Pitágoras. Center sits in front. */
const FAN_FRAMES: FrameConfig[] = [
    {
        id: 'hero-hugo',
        type: FrameType.CUSTOM_IMAGE,
        name: 'Hugo Wanderley',
        imageUrl: '/hero/frames/hugo.png',
        cutoutScale: 0,
        color1: DEFAULT_FRAME.color1,
        width: 12,
    },
    {
        id: 'hero-valkyries',
        type: FrameType.CUSTOM_IMAGE,
        name: 'Golden State Valkyries',
        imageUrl: '/hero/frames/valkyries.png',
        cutoutScale: 0,
        color1: DEFAULT_FRAME.color1,
        width: 12,
    },
    {
        id: 'hero-pitagoras',
        type: FrameType.CUSTOM_IMAGE,
        name: 'Foto com DrPitagoras',
        imageUrl: '/hero/frames/pitagoras.png',
        cutoutScale: 0.18,
        color1: DEFAULT_FRAME.color1,
        width: 12,
    },
];

function photoSrc(index: number): string {
    return `/hero/photo-${String(index + 1).padStart(2, '0')}.jpg`;
}

const TINT_VAR = ['--frame-green', '--frame-magenta', '--frame-purple'] as const;

function tintColor(slot: number): string {
    if (typeof document === 'undefined') return 'transparent';
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(TINT_VAR[slot] ?? TINT_VAR[0])
        .trim();
    return value || 'transparent';
}

/** Cover-crop into the circle, then stroke the real frame. Same pipeline as a campaign. */

function drawFramed(
    canvas: HTMLCanvasElement,
    photo: HTMLImageElement | null,
    frame: FrameConfig,
    size: number,
    slot: number,
    onImageLoad?: () => void,
) {
    const dpr = 2;
    if (canvas.width !== size * dpr || canvas.height !== size * dpr) {
        canvas.width = size * dpr;
        canvas.height = size * dpr;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2;

    ctx.save();
    if (photo && photo.naturalWidth > 0 && photo.naturalHeight > 0) {
        const ratio = Math.max((radius * 2) / photo.naturalWidth, (radius * 2) / photo.naturalHeight);
        const w = photo.naturalWidth * ratio;
        const h = photo.naturalHeight * ratio;
        ctx.drawImage(photo, cx - w / 2, cy - h / 2, w, h);
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    } else {
        ctx.fillStyle = tintColor(slot);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();

    FrameRendererFactory.render({ ctx, centerX: cx, centerY: cy, radius, frame, onImageLoad });
}

function FanSlot({
    frame,
    photo,
    reduce,
    placement,
    circle,
    slot,
}: {
    frame: FrameConfig;
    photo: HTMLImageElement | null;
    reduce: boolean;
    placement: { x: number; y: number; rotate: number; z: number };
    circle: number;
    slot: number;
}) {
    const aRef = useRef<HTMLCanvasElement>(null);
    const bRef = useRef<HTMLCanvasElement>(null);
    const layerRef = useRef<'a' | 'b'>('a');
    const painted = useRef<HTMLImageElement | null | undefined>(undefined);
    const paintedSize = useRef<number | null>(null);
    const [layer, setLayer] = useState<'a' | 'b'>('a');

    useEffect(() => {
        const a = aRef.current;
        const b = bRef.current;
        if (!a || !b) return;
        if (painted.current === photo && paintedSize.current === circle) return;

        const paint = (canvas: HTMLCanvasElement, img: HTMLImageElement | null) => {
            const whenFrameLoads = () => {
                const current = painted.current === undefined ? img : painted.current;
                if (aRef.current) drawFramed(aRef.current, current, frame, circle, slot);
                if (bRef.current) drawFramed(bRef.current, current, frame, circle, slot);
            };
            drawFramed(canvas, img, frame, circle, slot, whenFrameLoads);
        };

        const first = painted.current === undefined;
        painted.current = photo;
        paintedSize.current = circle;

        if (first) {
            paint(a, photo);
            paint(b, photo);
            return;
        }

        const incoming = layerRef.current === 'a' ? 'b' : 'a';
        paint(incoming === 'a' ? a : b, photo);
        layerRef.current = incoming;
        setLayer(incoming);
    }, [photo, frame, circle, slot]);

    const fade = reduce ? 'none' : `opacity ${FADE_MS}ms cubic-bezier(0.23, 1, 0.32, 1)`;

    return (
        <div
            className="absolute frame-fan-shadow rounded-full"
            style={{
                width: circle,
                height: circle,
                left: placement.x,
                top: placement.y,
                zIndex: placement.z,
                transform: `rotate(${placement.rotate}deg)`,
                background: SLOT_TINT[slot],
            }}
        >
            <canvas
                ref={aRef}
                aria-hidden
                className="hero-fan-layer absolute inset-0 text-paper rounded-full"
                style={{ width: circle, height: circle, opacity: layer === 'a' ? 1 : 0, transition: fade }}
            />
            <canvas
                ref={bRef}
                aria-hidden
                className="hero-fan-layer absolute inset-0 text-paper rounded-full"
                style={{ width: circle, height: circle, opacity: layer === 'b' ? 1 : 0, transition: fade }}
            />
        </div>
    );
}

function nextPhoto(shown: (number | null)[], poolLength: number, pointer: { current: number }): number | null {
    const used = new Set(shown.filter((n): n is number => n !== null));
    if (used.size >= poolLength) return null;
    for (let i = 0; i < poolLength; i++) {
        const candidate = (pointer.current + i) % poolLength;
        if (!used.has(candidate)) {
            pointer.current = (candidate + 1) % poolLength;
            return candidate;
        }
    }
    return null;
}

export function HeroFrameFan({ label, emptyLabel }: { label: string; emptyLabel: string }) {
    const [pool, setPool] = useState<HTMLImageElement[] | null>(null);
    const [shown, setShown] = useState<(number | null)[]>([null, null, null]);
    const [reduce, setReduce] = useState(false);
    const [metrics, setMetrics] = useState<FanMetrics>(MOBILE_FAN);
    const pointer = useRef(0);
    const slotTurn = useRef(0);
    const poolRef = useRef<HTMLImageElement[]>([]);
    const shownRef = useRef<(number | null)[]>([null, null, null]);

    useEffect(() => {
        const wide = window.matchMedia('(min-width: 768px)');
        const apply = () => setMetrics(wide.matches ? DESKTOP_FAN : MOBILE_FAN);
        apply();
        wide.addEventListener('change', apply);
        return () => wide.removeEventListener('change', apply);
    }, []);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const apply = () => setReduce(media.matches);
        apply();
        media.addEventListener('change', apply);
        return () => media.removeEventListener('change', apply);
    }, []);

    useEffect(() => {
        prefetchFrameOverlays(FAN_FRAMES.map((frame) => frame.imageUrl));
        let cancelled = false;
        const slots: (HTMLImageElement | null)[] = Array.from({ length: PHOTO_COUNT }, () => null);
        let left = PHOTO_COUNT;

        const finish = () => {
            left -= 1;
            if (left > 0 || cancelled) return;
            const loaded = slots.filter((img): img is HTMLImageElement => img !== null);
            poolRef.current = loaded;
            const initial = [0, 1, 2].map((i) => (i < loaded.length ? i : null));
            shownRef.current = initial;
            setPool(loaded);
            setShown(initial);
            pointer.current = Math.min(3, loaded.length);
            slotTurn.current = 0;
        };

        for (let i = 0; i < PHOTO_COUNT; i++) {
            const img = new Image();
            img.decoding = 'async';
            if (i < 3) img.fetchPriority = 'high';
            img.onload = () => {
                const ready = () => {
                    slots[i] = img;
                    finish();
                };
                if (typeof img.decode === 'function') img.decode().then(ready).catch(ready);
                else ready();
            };
            img.onerror = () => finish();
            img.src = photoSrc(i);
        }

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (reduce || !pool || pool.length < 4) return;

        let timer = 0;
        const stop = () => {
            if (timer) window.clearInterval(timer);
            timer = 0;
        };
        const tick = () => {
            if (document.hidden) return;
            const prev = shownRef.current;
            const incoming = nextPhoto(prev, poolRef.current.length, pointer);
            if (incoming === null) return;
            const slot = slotTurn.current % prev.length;
            slotTurn.current += 1;
            const copy = prev.slice();
            copy[slot] = incoming;
            shownRef.current = copy;
            setShown(copy);
        };
        const start = () => {
            stop();
            timer = window.setInterval(tick, SWAP_MS);
        };
        const onVis = () => {
            if (document.hidden) stop();
            else start();
        };

        if (!document.hidden) start();
        document.addEventListener('visibilitychange', onVis);
        return () => {
            stop();
            document.removeEventListener('visibilitychange', onVis);
        };
    }, [reduce, pool]);

    const hasPhoto = shown.some((index) => index !== null);
    const photos = pool ?? [];
    const box = fanSize(metrics);
    const slots = placements(metrics);

    return (
        <div
            role="img"
            aria-label={hasPhoto ? label : emptyLabel}
            className="relative mx-auto"
            style={{ width: box.w, height: box.h }}
        >
            {slots.map((placement, slot) => {
                const index = shown[slot];
                const photo = index === null ? null : photos[index] ?? null;
                return (
                    <FanSlot
                        key={FAN_FRAMES[slot].id}
                        frame={FAN_FRAMES[slot]}
                        photo={photo}
                        reduce={reduce}
                        placement={placement}
                        circle={metrics.circle}
                        slot={slot}
                    />
                );
            })}
        </div>
    );
}
