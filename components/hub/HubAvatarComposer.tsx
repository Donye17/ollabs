"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { FrameConfig } from '@/lib/types';
import { fileToDisplayDataUrl } from '@/lib/imageLoad';
import { Loader2, Upload, X } from 'lucide-react';

const CANVAS = 768;

export type HubFrameCampaign = {
    id: string;
    slug: string;
    title: string;
    preview_url: string | null;
    frame: FrameConfig;
};

type Props = {
    open: boolean;
    campaigns: HubFrameCampaign[];
    onClose: () => void;
    /** Called with the public blob URL of the composed circular PNG. */
    onDone: (avatarUrl: string) => void;
};

/**
 * Build a hub avatar the same way supporters build a framed PF: pick one of
 * your campaigns, drop a photo in, export the circle. Result uploads to Blob
 * and becomes organizers.avatar_url.
 */
export function HubAvatarComposer({ open, campaigns, onClose, onDone }: Props) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const [campaignId, setCampaignId] = useState(campaigns[0]?.id || '');
    const [hasImage, setHasImage] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [tick, setTick] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const drag = useRef({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

    const frame = campaigns.find((c) => c.id === campaignId)?.frame || campaigns[0]?.frame;

    useEffect(() => {
        if (!open) return;
        setCampaignId((prev) => {
            if (prev && campaigns.some((c) => c.id === prev)) return prev;
            return campaigns[0]?.id || '';
        });
        setHasImage(false);
        imgRef.current = null;
        setZoom(1);
        setPos({ x: 0, y: 0 });
        setError(null);
        setBusy(false);
    }, [open, campaigns]);

    // Body scroll lock + Escape (same pattern as PublishTemplateModal).
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !busy) onClose();
        };
        document.addEventListener('keydown', onKey);
        const body = document.body;
        const scrollY = window.scrollY;
        const prev = {
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
            overflow: body.style.overflow,
        };
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            body.style.position = prev.position;
            body.style.top = prev.top;
            body.style.width = prev.width;
            body.style.overflow = prev.overflow;
            window.scrollTo(0, scrollY);
        };
    }, [open, busy, onClose]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !frame) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const cx = CANVAS / 2;
        const cy = CANVAS / 2;
        const radius = CANVAS / 2;
        ctx.clearRect(0, 0, CANVAS, CANVAS);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const img = imgRef.current;
        if (img) {
            ctx.save();
            const ratio = Math.max((radius * 2) / img.width, (radius * 2) / img.height);
            const w = img.width * ratio * zoom;
            const h = img.height * ratio * zoom;
            ctx.drawImage(img, cx - w / 2 + pos.x, cy - h / 2 + pos.y, w, h);
            ctx.globalCompositeOperation = 'destination-in';
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else {
            ctx.fillStyle = '#EAE6DC';
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
        }

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
            console.error('hub avatar frame render failed', e);
        }
    }, [frame, zoom, pos]);

    useEffect(() => {
        if (open) draw();
    }, [open, draw, tick, campaignId]);

    const handleFile = async (file: File) => {
        setError(null);
        try {
            const dataUrl = await fileToDisplayDataUrl(file);
            const img = new Image();
            img.onload = () => {
                imgRef.current = img;
                setHasImage(true);
                setZoom(1);
                setPos({ x: 0, y: 0 });
                setError(null);
                draw();
            };
            img.onerror = () => setError('That image could not be opened. Try a JPG or PNG.');
            img.src = dataUrl;
        } catch {
            setError('That image could not be opened. Try a JPG or PNG.');
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
    const end = () => {
        drag.current.active = false;
    };

    const usePhoto = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasImage || !frame) return;
        setBusy(true);
        setError(null);
        try {
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob((b) => resolve(b), 'image/png', 1)
            );
            if (!blob) {
                setError('Could not export that photo. Try again.');
                return;
            }
            const file = new File([blob], `hub-avatar-${Date.now()}.png`, { type: 'image/png' });
            const result = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });
            onDone(result.url);
            onClose();
        } catch {
            setError('Could not upload that photo. Try again.');
        } finally {
            setBusy(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 p-0 sm:p-4">
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label="Make hub photo with a campaign frame"
                className="w-full max-w-md bg-paper text-ink rounded-t-2xl sm:rounded-2xl max-h-[92dvh] overflow-y-auto overscroll-contain shadow-xl"
            >
                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 border-b border-ink/10 bg-paper/95 backdrop-blur-xl">
                    <p className="font-display font-extrabold text-lg">Hub photo</p>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        className="h-10 w-10 rounded-xl border border-ink/10 flex items-center justify-center hover:bg-ink/5 disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-4 py-4 space-y-4">
                    <p className="text-sm text-ink/70 leading-relaxed">
                        Pick one of your campaign frames, add a photo, then use it on your hub.
                    </p>

                    {campaigns.length === 0 ? (
                        <p role="alert" className="text-sm text-coral bg-coral/10 border border-coral/25 rounded-xl px-3 py-2.5">
                            Create a campaign first so you have a frame to put around the photo.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted">Frame</p>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto overscroll-contain">
                                {campaigns.map((c) => {
                                    const active = c.id === campaignId;
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setCampaignId(c.id)}
                                            className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors ${
                                                active
                                                    ? 'border-brand bg-brand/15'
                                                    : 'border-ink/10 bg-cream hover:bg-ink/5'
                                            }`}
                                        >
                                            {c.preview_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={c.preview_url}
                                                    alt=""
                                                    className="h-10 w-10 rounded-full object-cover border border-ink/10 shrink-0"
                                                />
                                            ) : (
                                                <span className="h-10 w-10 rounded-full bg-brand/20 border border-ink/10 shrink-0" />
                                            )}
                                            <span className="min-w-0">
                                                <span className="block text-xs font-bold truncate">{c.title}</span>
                                                <span className="block text-[10px] text-muted truncate">/c/{c.slug}</span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-3">
                        <canvas
                            ref={canvasRef}
                            width={CANVAS}
                            height={CANVAS}
                            onPointerDown={(e) => {
                                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                                start(e.clientX, e.clientY);
                            }}
                            onPointerMove={(e) => move(e.clientX, e.clientY)}
                            onPointerUp={end}
                            onPointerCancel={end}
                            onClick={() => {
                                if (!hasImage) fileRef.current?.click();
                            }}
                            className={`w-[72vw] h-[72vw] max-w-[280px] max-h-[280px] rounded-full touch-none ${
                                hasImage ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                            }`}
                            style={{ touchAction: 'none', background: 'transparent' }}
                        />
                        {!hasImage && (
                            <p className="text-sm text-muted text-center">Tap the circle to add a photo</p>
                        )}
                        {hasImage && (
                            <div className="w-full flex items-center gap-3 px-1">
                                <span className="text-xs font-semibold text-muted">Size</span>
                                <input
                                    type="range"
                                    min={0.3}
                                    max={3}
                                    step={0.01}
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    aria-label="Photo size"
                                    className="flex-1 h-8 accent-brand cursor-pointer"
                                />
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void handleFile(f);
                            e.target.value = '';
                        }}
                    />

                    {error && (
                        <p role="alert" className="text-sm text-coral bg-coral/10 border border-coral/25 rounded-xl px-3 py-2.5 text-center">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col gap-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="w-full min-h-[48px] rounded-xl border border-ink/15 bg-cream font-semibold flex items-center justify-center gap-2 hover:bg-ink/5"
                        >
                            <Upload size={16} /> {hasImage ? 'Change photo' : 'Upload photo'}
                        </button>
                        <button
                            type="button"
                            onClick={() => void usePhoto()}
                            disabled={!hasImage || !frame || busy || campaigns.length === 0}
                            className="w-full min-h-[52px] rounded-xl bg-brand text-ink font-bold flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-50"
                        >
                            {busy ? <Loader2 size={18} className="animate-spin" /> : 'Use as hub photo'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
