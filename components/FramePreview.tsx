"use client";
import React, { useEffect, useRef, useState } from 'react';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { FrameConfig, FrameType } from '@/lib/types';

const CANVAS = 512;

// Renders a frame config over a neutral avatar silhouette, used wherever we need to
// show "what this frame looks like" without a real photo (publish modal, home examples).
//
// `size` is the backing-store resolution, not the display size — the canvas is always
// laid out by className. It defaults to 512 so every existing caller is unchanged, but
// a grid of thumbnails should pass something smaller: each 512px canvas is about a
// megabyte of memory, and Explore mounts up to sixty of them.
export const FramePreview: React.FC<{ frame: FrameConfig; className?: string; size?: number }> = ({ frame, className, size = CANVAS }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const cx = size / 2, cy = size / 2, radius = size / 2;

        const draw = () => {
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
                console.error('frame preview render failed', e);
            }
        };

        draw();
    }, [frame, tick, size]);

    return <canvas ref={ref} width={size} height={size} className={className} />;
};
