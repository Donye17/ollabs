"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { FrameConfig } from '@/lib/types';
import { fileToDisplayDataUrl } from '@/lib/imageLoad';
import { addPngMetadata } from '@/lib/pngMeta';
import { track } from '@/lib/analytics';
import { canShareFiles } from '@/lib/share';
import { downloadBlob } from '@/lib/download';
import { Upload, Download, Loader2, ArrowRight, ImageDown, AlertCircle } from 'lucide-react';

const CANVAS = 1024;

/**
 * The inline frame tool on a /day page.
 *
 * Deliberately lighter than CampaignClient: there is no campaign behind this,
 * so no supporter counter, no /use call, and no reporting. The job is to let a
 * visitor act on the day immediately, then hand them to /create if they want to
 * run one properly for their own organisation.
 */
export const DayFrameTool: React.FC<{
    frame: FrameConfig;
    dayName: string;
    daySlug: string;
    /**
     * Which section the tool is embedded in. Controls the provenance URL, the
     * download filename, the analytics dimension, and the closing prompt.
     * Defaults to 'day' so the existing day pages behave exactly as before.
     */
    section?: 'day' | 'flags';
}> = ({ frame, dayName, daySlug, section = 'day' }) => {
    const isFlag = section === 'flags';
    // Keep the day dimension clean: flag downloads report under their own key
    // rather than masquerading as an awareness day in GA.
    const dimension = isFlag ? { flag: daySlug } : { day: daySlug };
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
    const [canSharePhoto, setCanSharePhoto] = useState(false);
    const [sharingPhoto, setSharingPhoto] = useState(false);
    // An alert() is the wrong thing on a phone: it covers the page, and inside
    // an in-app browser it can be dismissed before it is read. The message
    // belongs next to the control that failed.
    const [error, setError] = useState<string | null>(null);

    const drag = useRef({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

    // Probe with a throwaway PNG: canShare inspects the file's type rather than
    // its contents, so a one byte file answers the question honestly.
    useEffect(() => {
        try {
            const probe = new File([new Uint8Array([0])], 'probe.png', { type: 'image/png' });
            setCanSharePhoto(canShareFiles([probe]));
        } catch {
            setCanSharePhoto(false);
        }
    }, []);

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
        setError(null);
        try {
            const dataUrl = await fileToDisplayDataUrl(file);
            const img = new Image();
            img.onload = () => {
                imgRef.current = img;
                setHasImage(true);
                setZoom(1);
                setPos({ x: 0, y: 0 });
                setDone(false);
                setError(null);
                track('photo_uploaded', dimension);
                draw();
            };
            img.onerror = () => setError('That image could not be opened. Try a JPG or PNG.');
            img.src = dataUrl;
        } catch {
            setError('That image could not be opened. Try a JPG or PNG.');
        }
    };

    /** The finished PNG, tagged with the same provenance the campaign download uses. */
    const taggedBlob = async (): Promise<Blob | null> => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/png', 1));
        if (!blob) return null;
        try {
            const tagged = addPngMetadata(new Uint8Array(await blob.arrayBuffer()), {
                Software: 'Ollabs (ollabs.studio)',
                Title: dayName,
                Source: `https://ollabs.studio/${section}/${daySlug}`,
            });
            return new Blob([tagged as unknown as BlobPart], { type: 'image/png' });
        } catch {
            return blob; // fall back to the untagged blob
        }
    };

    const download = async () => {
        if (!canvasRef.current || !hasImage) return;
        setDownloading(true);
        setError(null);
        try {
            const blob = await taggedBlob();
            if (!blob) {
                setError('That image could not be saved. Try again.');
                return;
            }
            downloadBlob(blob, `${daySlug}-ollabs.png`);
            setDone(true);
            track('frame_download', dimension);
        } finally {
            setDownloading(false);
        }
    };

    /**
     * Hand the finished PNG to the OS share sheet.
     *
     * The reliable path on a phone. Inside the WhatsApp and Instagram in-app
     * browsers on iOS an <a download> is ignored, so Download can look like it
     * worked and leave the person with nothing. The sheet gives them Save
     * Image, or sends the picture straight into a chat.
     */
    const sharePhoto = async () => {
        if (!canvasRef.current || !hasImage) return;
        setSharingPhoto(true);
        setError(null);
        try {
            const blob = await taggedBlob();
            if (!blob) return;
            const file = new File([blob], `${daySlug}-ollabs.png`, { type: 'image/png' });
            if (!canShareFiles([file])) return;
            await navigator.share({ files: [file], title: dayName });
            setDone(true);
            track('frame_share_photo', dimension);
        } catch {
            // Cancelled from the sheet, or the OS refused the payload.
        } finally {
            setSharingPhoto(false);
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
        <div className={`max-w-md mx-auto ${hasImage ? 'pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))]' : ''}`}>
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
                            aria-label="Photo zoom"
                            className="w-full h-8 accent-brand-deep"
                        />
                    </div>
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="w-full h-12 rounded-xl border border-ink/15 font-bold hover:bg-ink/5 transition-colors"
                    >
                        Change photo
                    </button>
                </div>
            )}

            {error && (
                <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-coral bg-coral/10 border border-coral/25 rounded-xl px-3 py-2.5">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
                </p>
            )}

            {done && (
                <div className="mt-5 bg-cream border border-ink/10 rounded-2xl p-5 text-center">
                    <p className="font-display font-bold mb-1">Saved. Go set it as your profile picture.</p>
                    <p className="text-sm text-ink/70 mb-4">
                        {isFlag
                            ? `Want everyone in your group behind the same ${dayName} frame? Make a campaign and share one link, so you can see how many joined.`
                            : `Running ${dayName} for your own organisation? Make a campaign and share one link, so everyone gets the same frame and you can see how many joined.`}
                    </p>
                    <Link
                        href={isFlag ? `/create?flag=${daySlug}` : `/create?day=${daySlug}`}
                        onClick={() => track(isFlag ? 'flag_to_create' : 'day_to_create', dimension)}
                        className="inline-flex h-11 px-6 rounded-xl bg-ink text-paper font-bold items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        Create a campaign <ArrowRight size={16} />
                    </Link>
                </div>
            )}

            {hasImage && (
                <div className="fixed bottom-0 inset-x-0 z-40 border-t border-ink/10 bg-paper/95 backdrop-blur-xl px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
                    <div className="w-full max-w-md mx-auto flex flex-col gap-2">
                        {canSharePhoto && (
                            <button
                                onClick={sharePhoto} disabled={sharingPhoto}
                                className="w-full h-12 rounded-xl bg-brand text-ink font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all disabled:opacity-60"
                            >
                                {sharingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageDown size={18} />}
                                Save or share photo
                            </button>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={download} disabled={downloading}
                                className={`flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 ${canSharePhoto ? 'bg-cream border border-ink/10 text-ink hover:bg-ink/5' : 'bg-brand text-ink hover:brightness-105'}`}
                            >
                                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download size={18} />}
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
