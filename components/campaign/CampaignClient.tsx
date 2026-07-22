"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { FrameConfig, FrameType } from '@/lib/types';
import { QRCode } from '@/components/QRCode';
import { fileToDisplayDataUrl } from '@/lib/imageLoad';
import { Upload, Download, Share2, Check, Loader2, Copy, QrCode } from 'lucide-react';

const CANVAS = 1024;

// Brand glyphs for share targets (inline so we stay self-contained).
const XGlyph = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
const WhatsAppGlyph = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);
const FacebookGlyph = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

interface CampaignClientProps {
    slug: string;
    title: string;
    description?: string | null;
    creatorName?: string | null;
    initialCount: number;
    goal?: number | null;
    frame: FrameConfig;
}

export const CampaignClient: React.FC<CampaignClientProps> = ({ slug, title, description, initialCount, goal, frame }) => {
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
    const [justDownloaded, setJustDownloaded] = useState(false);
    const [canNativeShare, setCanNativeShare] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [pageUrl, setPageUrl] = useState(`https://ollabs.studio/c/${slug}`);
    const [reportOpen, setReportOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDone, setReportDone] = useState(false);
    const [canCopyImage, setCanCopyImage] = useState(false);
    const [imageCopied, setImageCopied] = useState(false);

    useEffect(() => {
        setCanCopyImage(
            typeof window !== 'undefined' &&
            typeof window.ClipboardItem !== 'undefined' &&
            !!navigator.clipboard && typeof navigator.clipboard.write === 'function'
        );
    }, []);

    const handleCopyImage = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasImage) return;
        try {
            const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png', 1));
            if (!blob) return;
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            setImageCopied(true);
            setTimeout(() => setImageCopied(false), 1500);
            bumpCount();
            setJustDownloaded(true);
        } catch { /* clipboard image unavailable */ }
    };

    const submitReport = async () => {
        try {
            await fetch(`/api/campaigns/${slug}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: reportReason }),
            });
        } catch { /* ignore */ }
        setReportDone(true);
        setReportOpen(false);
    };

    useEffect(() => {
        setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
        if (typeof window !== 'undefined') setPageUrl(window.location.href);
    }, []);

    // Record a real view once per browser session (no inflation on reload).
    useEffect(() => {
        try {
            const key = `ollabs_viewed_${slug}`;
            if (!sessionStorage.getItem(key)) {
                sessionStorage.setItem(key, '1');
                fetch(`/api/campaigns/${slug}/view`, { method: 'POST' }).catch(() => { });
            }
        } catch { /* ignore */ }
    }, [slug]);

    const shareUrl = () => (typeof window !== 'undefined' ? window.location.href : `https://ollabs.studio/c/${slug}`);
    const shareText = `I just added the "${title}" frame to my photo on Ollabs. Add yours:`;

    const openShare = (platform: 'x' | 'whatsapp' | 'facebook') => {
        const url = shareUrl();
        const map: Record<string, string> = {
            x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        };
        window.open(map[platform], '_blank', 'noopener,noreferrer');
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl());
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 1500);
        } catch { /* clipboard unavailable */ }
    };

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
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const img = imgRef.current;
        if (img) {
            // Draw the photo, then mask to a circle with an anti-aliased arc fill
            // (destination-in). This gives a smooth edge, unlike a hard clip().
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
            FrameRendererFactory.render({ ctx, centerX: cx, centerY: cy, radius, frame, onImageLoad: () => setImgTick((t) => t + 1) });
        } catch (e) {
            console.error('frame render failed', e);
        }
    }, [zoom, pos, frame]);

    useEffect(() => { draw(); }, [draw, imgTick]);

    const handleFile = async (file: File) => {
        try {
            const dataUrl = await fileToDisplayDataUrl(file);
            const img = new Image();
            img.onload = () => {
                imgRef.current = img;
                setHasImage(true);
                setZoom(1);
                setPos({ x: 0, y: 0 });
                setJustDownloaded(false);
                draw();
            };
            img.onerror = () => alert('That image could not be opened. Try a JPG or PNG.');
            img.src = dataUrl;
        } catch {
            alert('That image could not be opened. Try a JPG or PNG.');
        }
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
                setJustDownloaded(true);
            }
        } finally {
            setDownloading(false);
        }
    };

    const handleShare = async () => {
        const url = shareUrl();
        if (navigator.share) {
            try { await navigator.share({ title, text: shareText, url }); return; } catch { /* cancelled */ }
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
                    <>
                        <button onClick={() => fileRef.current?.click()}
                            className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-brand hover:brightness-105 text-ink transition-all">
                            <Upload size={18} /> Upload your photo
                        </button>
                        <div className="w-full grid grid-cols-3 gap-2 mt-1">
                            {[
                                { n: 1, label: 'Add your photo' },
                                { n: 2, label: 'Adjust the fit' },
                                { n: 3, label: 'Download & share' },
                            ].map((s) => (
                                <div key={s.n} className="flex flex-col items-center text-center gap-1.5 bg-cream border border-ink/10 rounded-xl py-3 px-1">
                                    <span className="w-6 h-6 rounded-full bg-brand text-ink font-display font-extrabold text-xs flex items-center justify-center">{s.n}</span>
                                    <span className="text-[11px] leading-tight text-ink/70 font-medium">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <button onClick={handleDownload} disabled={downloading}
                            className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-brand hover:brightness-105 text-ink transition-all disabled:opacity-50">
                            {downloading ? <Loader2 size={18} className="animate-spin" /> : <>{justDownloaded ? <><Check size={18} /> Downloaded, download again</> : <><Download size={18} /> Download</>}</>}
                        </button>

                        {canCopyImage && (
                            <button onClick={handleCopyImage}
                                className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-cream border border-ink/10 hover:bg-ink/5 text-ink transition-colors">
                                {imageCopied ? <><Check size={16} className="text-brand-deep" /> Image copied</> : <><Copy size={16} /> Copy image</>}
                            </button>
                        )}

                        {justDownloaded && (
                            <div className="w-full bg-cream border border-ink/10 rounded-2xl p-4 space-y-3 animate-fade-in">
                                <div className="text-center">
                                    <p className="font-display font-extrabold text-lg leading-tight">You&apos;re in. Now bring your people.</p>
                                    <p className="text-xs text-muted mt-1">Post your framed photo, and share the link so others can add it too.</p>
                                </div>

                                {canNativeShare && (
                                    <button onClick={handleShare}
                                        className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-ink text-paper hover:brightness-125 transition-all">
                                        <Share2 size={16} /> Share the link
                                    </button>
                                )}

                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => openShare('x')}
                                        className="py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 bg-ink text-white hover:brightness-125 transition-all">
                                        <XGlyph size={15} /> X
                                    </button>
                                    <button onClick={() => openShare('whatsapp')}
                                        className="py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 text-white hover:brightness-105 transition-all"
                                        style={{ backgroundColor: '#25D366' }}>
                                        <WhatsAppGlyph size={15} /> WhatsApp
                                    </button>
                                    <button onClick={() => openShare('facebook')}
                                        className="py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 text-white hover:brightness-105 transition-all"
                                        style={{ backgroundColor: '#1877F2' }}>
                                        <FacebookGlyph size={15} /> Facebook
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={copyLink}
                                        className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-paper border border-ink/10 hover:bg-ink/5 text-ink transition-colors">
                                        {linkCopied ? <><Check size={15} className="text-brand-deep" /> Link copied</> : <><Copy size={15} /> Copy link</>}
                                    </button>
                                    <button onClick={() => setShowQR((v) => !v)}
                                        className="py-2.5 px-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-paper border border-ink/10 hover:bg-ink/5 text-ink transition-colors">
                                        <QrCode size={15} /> QR
                                    </button>
                                </div>

                                {showQR && (
                                    <div className="flex flex-col items-center gap-2 pt-1">
                                        <QRCode value={pageUrl} size={168} className="border border-ink/10" />
                                        <p className="text-[11px] text-muted">Scan to open this campaign</p>
                                    </div>
                                )}
                            </div>
                        )}

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

                <div className="w-full bg-cream border border-ink/10 rounded-xl py-4 px-4 text-center mt-1">
                    <div className="font-display flex items-center justify-center gap-2 text-2xl font-extrabold">
                        <span className="w-2.5 h-2.5 rounded-full bg-coral" /> {count.toLocaleString()}
                    </div>
                    {goal && goal > 0 ? (
                        <>
                            <div className="mt-2 h-2 w-full rounded-full bg-paper2 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-brand transition-all"
                                    style={{ width: `${Math.min(100, Math.round((count / goal) * 100))}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted mt-1.5">
                                {count.toLocaleString()} of {goal.toLocaleString()} supporters
                                {count >= goal ? ' · goal reached' : ''}
                            </p>
                        </>
                    ) : (
                        <p className="text-xs text-muted mt-0.5">people supporting</p>
                    )}
                </div>

                <a href="/create" className="text-xs text-muted hover:text-brand-deep transition-colors mt-1">Make your own with Ollabs</a>

                {reportDone ? (
                    <p className="text-[11px] text-muted/70">Thanks, we will review this campaign.</p>
                ) : reportOpen ? (
                    <div className="w-full max-w-xs bg-cream border border-ink/10 rounded-xl p-3 space-y-2">
                        <p className="text-xs font-semibold text-ink">Report this campaign</p>
                        <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="What's wrong with it? (optional)"
                            className="w-full bg-paper border border-ink/10 rounded-lg px-2.5 py-2 text-sm text-ink placeholder-muted outline-none focus:ring-2 focus:ring-brand/40 resize-none min-h-[56px]"
                        />
                        <div className="flex gap-2">
                            <button onClick={submitReport} className="flex-1 py-2 rounded-lg text-xs font-bold bg-coral text-white hover:brightness-105 transition-all">Submit report</button>
                            <button onClick={() => setReportOpen(false)} className="py-2 px-3 rounded-lg text-xs font-semibold bg-paper border border-ink/10 text-ink hover:bg-ink/5 transition-colors">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setReportOpen(true)} className="text-[11px] text-muted/70 hover:text-coral transition-colors">Report this campaign</button>
                )}
            </div>
        </div>
    );
};
