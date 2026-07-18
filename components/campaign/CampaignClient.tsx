"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { FrameConfig, FrameType } from '@/lib/types';
import { Upload, Download, Share2, Check, Loader2 } from 'lucide-react';

const CANVAS = 1024;

interface CampaignClientProps {
    slug: string;
    title: string;
    description?: string | null;
    creatorName?: string | null;
    initialCount: number;
    frame: FrameConfig;
}

export const CampaignClient: React.FC<CampaignClientProps> = ({ slug, title, description, initialCount, frame }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const countedRef = useRef(false);

    const [hasImage, setHasImage] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [count, setCount] = useState(initialCount);
    const [downloading, setDownloading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [imgTick, setImgTick] = useState(0);
    const [dragOver, setDragOver] = useState(false);

    const drag = useRef<{ active: boolean; startX: number; startY: number; baseX: number; baseY: number }>({
        active: false, startX: 0, startY: 0, baseX: 0, baseY: 0,
    });

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cx = CANVAS / 2, cy = CANVAS / 2, radius = CANVAS / 2;
        ctx.clearRect(0, 0, CANVAS, CANVAS);

        const img = imgRef.current;
        if (img) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            const ratio = Math.max((radius * 2) / img.width, (radius * 2) / img.height);
            const w = img.width * ratio * zoom;
            const h = img.height * ratio * zoom;
            ctx.drawImage(img, cx - w / 2 + pos.x, cy - h / 2 + pos.y, w, h);
            ctx.restore();
        } else {
            ctx.fillStyle = '#EAE6DC';
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        try {
            FrameRendererFactory.getRenderer(frame.type as FrameType).drawFrame({ ctx, centerX: cx, centerY: cy, radius, frame, onImageLoad: () => setImgTick((t) => t + 1) });
        } catch (e) {
            console.error('frame render failed', e);
        }
    }, [zoom, pos, frame]);

    useEffect(() => { draw(); }, [draw, imgTick]);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                imgRef.current = img;
                setHasImage(true);
                setZoom(1);
                setPos({ x: 0, y: 0 });
                draw();
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
    const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); };
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f && f.type.startsWith('image/')) handleFile(f);
    };

    const canvasToDisplayRatio = () => {
        const canvas = canvasRef.current;
        if (!canvas) return 1;
        const rect = canvas.getBoundingClientRect();
        return CANVAS / (rect.width || 1);
    };

    const onPointerDown = (e: React.PointerEvent) => {
        if (!hasImage) return;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        drag.current = { active: true, startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y };
    };
    const onPointerMove = (e: React.PointerEvent) => {
        if (!drag.current.active) return;
        const r = canvasToDisplayRatio();
        setPos({
            x: drag.current.baseX + (e.clientX - drag.current.startX) * r,
            y: drag.current.baseY + (e.clientY - drag.current.startY) * r,
        });
    };
    const onPointerUp = () => { drag.current.active = false; };

    const bumpCount = () => {
        if (countedRef.current) return;
        countedRef.current = true;
        fetch(`/api/campaigns/${slug}/use`, { method: 'POST' })
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d && typeof d.supporter_count === 'number') setCount(d.supporter_count); })
            .catch(() => { countedRef.current = false; });
    };

    const handleDownload = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasImage) return;
        setDownloading(true);
        try {
            const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png', 1));
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ollabs-${slug}.png`;
                a.click();
                URL.revokeObjectURL(url);
                bumpCount();
            }
        } finally {
            setDownloading(false);
        }
    };

    const handleShare = async () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        if (navigator.share) {
            try { await navigator.share({ title, url }); return; } catch { /* cancelled */ }
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { /* clipboard unavailable */ }
    };

    return (
        <div className="min-h-screen bg-paper text-ink flex flex-col items-center px-4 py-6">
            <a href="/" className="mb-6">
                <img src="/Ollabs Logo Black.png" alt="Ollabs" className="h-7 w-auto" />
            </a>

            <div className="w-full max-w-sm flex flex-col items-center gap-4">
                <div className="text-center">
                    <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted">Ollabs campaign</p>
                    <h1 className="font-display text-2xl font-extrabold mt-1">{title}</h1>
                    {description && <p className="text-sm text-ink/70 mt-1">{description}</p>}
                </div>

                <canvas
                    ref={canvasRef}
                    width={CANVAS}
                    height={CANVAS}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => { if (!hasImage) fileRef.current?.click(); }}
                    className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full touch-none transition-all ${hasImage ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} ${dragOver ? 'ring-4 ring-brand/70 scale-[1.03]' : ''}`}
                    style={{ background: 'transparent' }}
                />

                {hasImage ? (
                    <div className="w-full flex items-center gap-3 px-2">
                        <span className="text-xs font-semibold text-muted">Size</span>
                        <input type="range" min={0.3} max={3} step={0.01} value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="flex-1 accent-brand" />
                    </div>
                ) : (
                    <p className="text-sm text-muted">Tap the circle or drag a photo onto it.</p>
                )}

                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

                {!hasImage ? (
                    <button onClick={() => fileRef.current?.click()}
                        className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-brand hover:brightness-105 text-ink transition-all">
                        <Upload size={18} /> Upload your photo
                    </button>
                ) : (
                    <>
                        <button onClick={handleDownload} disabled={downloading}
                            className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-brand hover:brightness-105 text-ink transition-all disabled:opacity-50">
                            {downloading ? <Loader2 size={18} className="animate-spin" /> : <><Download size={18} /> Download</>}
                        </button>
                        <div className="w-full flex gap-3">
                            <button onClick={() => fileRef.current?.click()}
                                className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-cream border border-ink/10 hover:bg-ink/5 text-ink transition-colors">
                                <Upload size={16} /> New photo
                            </button>
                            <button onClick={handleShare}
                                className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-cream border border-ink/10 hover:bg-ink/5 text-ink transition-colors">
                                {copied ? <><Check size={16} className="text-brand-deep" /> Copied</> : <><Share2 size={16} /> Share</>}
                            </button>
                        </div>
                    </>
                )}

                <div className="w-full bg-cream border border-ink/10 rounded-xl py-4 text-center mt-1">
                    <div className="font-display flex items-center justify-center gap-2 text-2xl font-extrabold">
                        <span className="w-2.5 h-2.5 rounded-full bg-coral" /> {count.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted mt-0.5">people supporting</p>
                </div>

                <a href="/create" className="text-xs text-muted hover:text-brand-deep transition-colors mt-1">Make your own with Ollabs</a>
            </div>
        </div>
    );
};
