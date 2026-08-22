"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import type { FrameConfig } from '@/lib/types';

export type TopCampaign = {
    slug: string;
    title: string;
    supporterCount: number;
    frame: FrameConfig;
};

function PodiumFrame({ frame, size }: { frame: FrameConfig; size: number }) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const cx = size / 2;
        const cy = size / 2;
        const radius = size / 2;

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
            FrameRendererFactory.render({
                ctx,
                centerX: cx,
                centerY: cy,
                radius,
                frame,
                onImageLoad: () => setTick((t) => t + 1),
            });
        } catch (e) {
            console.error('podium frame render failed', e);
        }
    }, [frame, size, tick]);

    return (
        <canvas
            ref={ref}
            width={size}
            height={size}
            className="w-full h-full rounded-full"
            aria-hidden
        />
    );
}

type Slot = { rank: 1 | 2 | 3; campaign: TopCampaign };

/**
 * Top three campaigns by supporters. Rank 1 sits in the middle and taller,
 * like a podium, so traction is obvious without a sliding carousel.
 */
export function TopCampaignsPodium({ campaigns }: { campaigns: TopCampaign[] }) {
    const slots: Slot[] = [];
    if (campaigns[1]) slots.push({ rank: 2, campaign: campaigns[1] });
    if (campaigns[0]) slots.push({ rank: 1, campaign: campaigns[0] });
    if (campaigns[2]) slots.push({ rank: 3, campaign: campaigns[2] });

    if (slots.length === 0) return null;

    return (
        <div className="w-full max-w-lg mx-auto">
            <ol className="flex items-end justify-center gap-2 sm:gap-4 px-1 list-none">
                {slots.map(({ rank, campaign }) => {
                    const first = rank === 1;
                    const framePx = first ? 128 : 88;
                    const canvasPx = first ? 256 : 176;

                    return (
                        <li
                            key={campaign.slug}
                            className={`flex-1 min-w-0 max-w-[140px] sm:max-w-[160px] ${first ? 'z-10' : ''}`}
                        >
                            <Link
                                href={`/c/${campaign.slug}`}
                                className={`group flex flex-col items-center text-center outline-none ${
                                    first ? 'pt-0' : 'pt-6'
                                }`}
                            >
                                <span
                                    className={`mb-2 inline-flex items-center justify-center rounded-full font-display font-extrabold tabular-nums ${
                                        first
                                            ? 'h-8 min-w-8 px-2.5 text-sm bg-brand text-ink ring-4 ring-brand/25'
                                            : 'h-7 min-w-7 px-2 text-xs bg-ink/10 text-ink'
                                    }`}
                                    aria-label={`Rank ${rank}`}
                                >
                                    {rank}
                                </span>
                                <div
                                    className={`rounded-full overflow-hidden bg-ink/5 transition-transform duration-300 group-hover:scale-[1.03] group-active:scale-[0.98] ${
                                        first
                                            ? 'ring-2 ring-brand/40 shadow-md shadow-brand/10'
                                            : 'ring-1 ring-ink/10'
                                    }`}
                                    style={{ width: framePx, height: framePx }}
                                >
                                    <PodiumFrame frame={campaign.frame} size={canvasPx} />
                                </div>
                                <p
                                    className={`mt-3 font-display font-bold leading-snug line-clamp-2 text-balance group-hover:text-brand-deep transition-colors ${
                                        first ? 'text-[15px] sm:text-base' : 'text-sm'
                                    }`}
                                >
                                    {campaign.title}
                                </p>
                                <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted tabular-nums">
                                    <Users size={12} className="shrink-0" aria-hidden />
                                    {campaign.supporterCount.toLocaleString()}
                                </p>
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
