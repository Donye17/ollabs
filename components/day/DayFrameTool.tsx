"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { FrameConfig } from '@/lib/types';
import { fileToDisplayDataUrl } from '@/lib/imageLoad';
import { addPngMetadata } from '@/lib/pngMeta';
import { track } from '@/lib/analytics';
import { Upload, Download, Loader2, ArrowRight } from 'lucide-react';

const CANVAS = 1024;

/**
 * The inline frame tool on a /day page.
 *
 * Deliberately lighter than CampaignClient: there is no campaign behind this,
 * so no supporter counter, no /use call, and no reporting. The job is to let a
 * visitor act on the day immediately, then hand them to /create if they want to
 * run one properly for their own organisation.
 */
export const DayFrameTool: React.FC<{ frame: FrameConfig; dayName: string; daySlug: string }> = ({
    frame, dayName, daySlug,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const [hasImage, setHasImage] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [downloading, setDownloading] = useState(false);
    const [done, setDone] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [tick, setTick] = useState(0);

    const drag = useRef({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        const c = CANVAS / 2, radius = CANVAS / 2;
        ctx.clearRect(0, 0, CANVAS, CANVAS);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const img = imgRef.current;
        if (img) {
            ctx.save();
            const ratio = Math.max((radius * 2) / img.width, (radius * 2) / img.height);
            const w = img.width * ratio * zoom;
            const h = img.height * ratio * zoom;
            ctx.drawImage(img, c - w / 2 + pos.x, c - h / 2 + pos.y, w, h);
            // circular mask via destination-in, for an anti-aliased edge
            ctx.globalCompositeOperation = 'destination-in';
            ctx.beginPath();
            ctx.arc(c, c, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            ctx.fillStyle = '#EAE6DC';
            ctx.beginPath();
            ctx.arc(c, c, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        try {
            FrameRendererFactory.render({
                ctx, centerX: c, centerY: c, radius, frame,
                onImageLoad: () => setTick((t) => t + 1),
            });
        } catch (e) {
            console.error('frame render failed', e);
        }
    }, [zoom, pos, frame]);

    useEffect(() => { draw(); }, [draw, tick]);

    const handleFile = async (file: File) => {
        try {
            const dataUrl = await fileToDisplayDataUrl(file);
            const img = new Image();
            img.onload = () => {
                imgRef.current = img;
                setHasImage(true);
                setZoom(1);
                setPos({ x: 0, y: 0 });
                setDone(false);
                track('photo_uploaded', { day: daySlug });
                draw();
            };
            img.onerror = () => alert('That image could not be opened. Try a JPG or PNG.');
            img.src = dataUrl;
        } catch {
            alert('That image could not be opened. Try a JPG or PNG.');
        }
    };

    const download = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasImage) return;
        setDownloading(true);
        try {
            const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/png', 1));
            if (!blob) return;
            // Same provenance tagging the campaign download uses.
            let out = blob;
            try {
                const tagged = addPngMetadata(new Uint8Array(await blob.arrayBuffer()), {
                    Software: 'Ollabs (ollabs.studio)',
                    Title: dayName,
                    Source: `https://ollabs.studio/day/${daySlug}`,
                });
                out = new Blob([tagged as unknown as BlobPart], { type: 'image/png' });
            } catch { /* fall back to the untagged blob */ }
            const url = URL.createObjectURL(out);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${daySlug}-ollabs.png`;
            a.click();
            URL.revokeObjectURL(url);
            setDone(true);
            track('frame_download', { day: daySlug });
        } finally {
            setDownloading(false);
        }
    };

    const start = (x: number, y: number) => {
        if (!hasImage) return;
        drag.current = { active: true, startX: x, startY: y, baseX: pos.x, baseY: pos.y };
    };
    const move = (x: number, y: number) => {
        if (!drag.current.active) return;
        const el = canvasRef.current;
        if (!el) return;
        const scale = CANVAS / el.getBoundingClientRect().width;
        setPos({
            x: drag.current.baseX + (x - drag.current.startX) * scale,
            y: drag.current.baseY + (y - drag.current.startY) * scale,
        });
    };
    const end = () => { drag.current.active = false; };

    return (
        <div className="max-w-md mx-auto">
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                onDrop={(e) => {
                    e.preventDefault(); setDragOver(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f && f.type.startsWith('image/')) handleFile(f);
                }}
                onMouseDown={(e) => start(e.clientX, e.clientY)}
                onMouseMove={(e) => move(e.clientX, e.clientY)}
                onMouseUp={end}
                onMouseLeave={end}
                onTouchStart={(e) => start(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => { if (drag.current.active && e.cancelable) e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY); }}
                onTouchEnd={end}
                className={`relative rounded-full overflow-hidden select-none touch-none transition-shadow ${dragOver ? 'ring-4 ring-brand' : ''} ${hasImage ? 'cursor-move' : 'cursor-pointer'}`}
                onClick={() => { if (!hasImage) fileRef.current?.click(); }}
            >
                <canvas ref={canvasRef} width={CANVAS} height={CANVAS} className="w-full h-auto block" />
                {!hasImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <Upload className="w-7 h-7 text-ink/40 mb-2" />
                        <p className="text-sm font-semibold text-ink/60">Tap to add your photo</p>
                    </div>
                )}
            </div>

            <input
                ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />

            {hasImage && (
                <div className="mt-5 space-y-4">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">Zoom</label>
                        <input
                            type="range" min={1} max={3} step={0.01} value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full accent-brand-deep"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={download} disabled={downloading}
                            className="flex-1 h-12 rounded-xl bg-brand text-ink font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all disabled:opacity-60"
                        >
                            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download size={18} />}
                            Download
                        </button>
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="h-12 px-5 rounded-xl border border-ink/15 font-bold hover:bg-ink/5 transition-colors"
                        >
                            Change
                        </button>
                    </div>
                </div>
            )}

            {done && (
                <div className="mt-5 bg-cream border border-ink/10 rounded-2xl p-5 text-center">
                    <p className="font-display font-bold mb-1">Saved. Go set it as your profile picture.</p>
                    <p className="text-sm text-ink/70 mb-4">
                        Running {dayName} for your own organisation? Make a campaign and share one link, so everyone
                        gets the same frame and you can see how many joined.
                    </p>
                    <Link
                        href="/create"
                        onClick={() => track('day_to_create', { day: daySlug })}
                        className="inline-flex h-11 px-6 rounded-xl bg-ink text-paper font-bold items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        Create a campaign <ArrowRight size={16} />
                    </Link>
                </div>
            )}
        </div>
    );
};
