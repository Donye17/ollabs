"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { FrameConfig, FrameType } from '@/lib/types';

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

    return <canvas ref={ref} width={CANVAS} height={CANVAS} className="w-32 h-32 sm:w-36 sm:h-36 rounded-full" />;
}

export const HomeExamples: React.FC<{ campaigns: HomeCampaign[] }> = ({ campaigns }) => {
    if (!campaigns || campaigns.length === 0) return null;
    return (
        <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-10">
            {campaigns.map((c) => (
                <Link key={c.slug} href={`/c/${c.slug}`} className="group flex flex-col items-center gap-3 transition-transform hover:-translate-y-1">
                    <ExampleCanvas frame={c.frame} />
                    <div className="text-center">
                        <p className="text-sm font-semibold text-ink group-hover:text-brand-deep transition-colors">{c.title}</p>
                        <p className="text-xs text-muted">{c.supporterCount.toLocaleString()} supporting</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};
