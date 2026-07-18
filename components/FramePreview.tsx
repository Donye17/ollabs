"use client";
import React, { useEffect, useRef, useState } from 'react';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { FrameConfig, FrameType } from '@/lib/types';

const CANVAS = 512;

// Renders a frame config over a neutral avatar silhouette — used wherever we need to
// show "what this frame looks like" without a real photo (publish modal, home examples).
export const FramePreview: React.FC<{ frame: FrameConfig; className?: string }> = ({ frame, className }) => {
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
                FrameRendererFactory.getRenderer(frame.type as FrameType).drawFrame({ ctx, centerX: cx, centerY: cy, radius, frame, onImageLoad: () => setTick((t) => t + 1) });
            } catch (e) {
                console.error('frame preview render failed', e);
            }
        };

        draw();
    }, [frame, tick]);

    return <canvas ref={ref} width={CANVAS} height={CANVAS} className={className} />;
};
