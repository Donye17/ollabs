'use client';

import { useEffect, useRef, useState } from 'react';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { AVAILABLE_FRAMES } from '@/lib/constants';
import type { FrameConfig } from '@/lib/types';

/**
 * Homepage hero only. The supporter canvas stays still: that preview is the
 * product, and motion there reads as the photo slipping. Here the fan is the
 * pitch, so one photo may crossfade while the other two hold.
 *
 * Photos come only from /hero/photo-01.jpg … photo-10.jpg. A missing file is
 * skipped. Nothing else is substituted: no generated faces, no stock, no
 * supporter uploads.
 */

const CIRCLE = 112;
const PAD = 12;
const STEP = 64;
const DROP = 26;
const FAN_W = PAD + STEP * 2 + CIRCLE + PAD;
const FAN_H = PAD + DROP + CIRCLE + PAD;
const SWAP_MS = 3500;
const FADE_MS = 250;
const PHOTO_COUNT = 10;

const PLACEMENTS = [
    { x: PAD, y: PAD + DROP, rotate: -16, z: 1 },
    { x: PAD + STEP, y: PAD, rotate: 0, z: 3 },
    { x: PAD + STEP * 2, y: PAD + DROP, rotate: 16, z: 2 },
] as const;

/** Left: green ring. Center: brand cyan. Right: sunset gradient. Center sits in front. */
const FAN_FRAME_IDS = ['frame-emerald', 'frame-ollabs-blue', 'frame-sunset-gradient'] as const;

const FAN_FRAMES: FrameConfig[] = FAN_FRAME_IDS.map(
    (id) => AVAILABLE_FRAMES.find((frame) => frame.id === id) ?? AVAILABLE_FRAMES[0],
);

function photoSrc(index: number): string {
    return `/hero/photo-${String(index + 1).padStart(2, '0')}.jpg`;
}

function paperColor(canvas: HTMLCanvasElement): string {
    return getComputedStyle(canvas).color || 'rgb(247, 248, 246)';
}

/** Cover-crop into the circle, then stroke the real frame. Same pipeline as a campaign. */
function drawFramed(
    canvas: HTMLCanvasElement,
    photo: HTMLImageElement | null,
    frame: FrameConfig,
    size: number,
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
        ctx.fillStyle = paperColor(canvas);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();

    FrameRendererFactory.render({ ctx, centerX: cx, centerY: cy, radius, frame });
}

function FanSlot({
    frame,
    photo,
    reduce,
    placement,
}: {
    frame: FrameConfig;
    photo: HTMLImageElement | null;
    reduce: boolean;
    placement: (typeof PLACEMENTS)[number];
}) {
    const aRef = useRef<HTMLCanvasElement>(null);
    const bRef = useRef<HTMLCanvasElement>(null);
    const layerRef = useRef<'a' | 'b'>('a');
    const painted = useRef<HTMLImageElement | null | undefined>(undefined);
    const [layer, setLayer] = useState<'a' | 'b'>('a');

    useEffect(() => {
        const a = aRef.current;
        const b = bRef.current;
        if (!a || !b) return;
        if (painted.current === photo) return;

        const first = painted.current === undefined;
        painted.current = photo;

        if (first) {
            drawFramed(a, photo, frame, CIRCLE);
            drawFramed(b, photo, frame, CIRCLE);
            return;
        }

        const incoming = layerRef.current === 'a' ? 'b' : 'a';
        drawFramed(incoming === 'a' ? a : b, photo, frame, CIRCLE);
        layerRef.current = incoming;
        setLayer(incoming);
    }, [photo, frame]);

    const fade = reduce ? 'none' : `opacity ${FADE_MS}ms cubic-bezier(0.23, 1, 0.32, 1)`;

    return (
        <div
            className="absolute frame-fan-shadow rounded-full"
            style={{
                width: CIRCLE,
                height: CIRCLE,
                left: placement.x,
                top: placement.y,
                zIndex: placement.z,
                transform: `rotate(${placement.rotate}deg)`,
            }}
        >
            <canvas
                ref={aRef}
                aria-hidden
                className="hero-fan-layer absolute inset-0 text-paper rounded-full"
                style={{ width: CIRCLE, height: CIRCLE, opacity: layer === 'a' ? 1 : 0, transition: fade }}
            />
            <canvas
                ref={bRef}
                aria-hidden
                className="hero-fan-layer absolute inset-0 text-paper rounded-full"
                style={{ width: CIRCLE, height: CIRCLE, opacity: layer === 'b' ? 1 : 0, transition: fade }}
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
    const pointer = useRef(0);
    const slotTurn = useRef(0);
    const poolRef = useRef<HTMLImageElement[]>([]);
    const shownRef = useRef<(number | null)[]>([null, null, null]);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const apply = () => setReduce(media.matches);
        apply();
        media.addEventListener('change', apply);
        return () => media.removeEventListener('change', apply);
    }, []);

    useEffect(() => {
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

    return (
        <div
            role="img"
            aria-label={hasPhoto ? label : emptyLabel}
            className="relative mx-auto"
            style={{ width: FAN_W, height: FAN_H }}
        >
            {PLACEMENTS.map((placement, slot) => {
                const index = shown[slot];
                const photo = index === null ? null : photos[index] ?? null;
                return (
                    <FanSlot
                        key={FAN_FRAMES[slot].id}
                        frame={FAN_FRAMES[slot]}
                        photo={photo}
                        reduce={reduce}
                        placement={placement}
                    />
                );
            })}
        </div>
    );
}
