"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FrameRendererFactory } from '@/components/renderer/FrameRendererFactory';
import { FrameConfig, FrameType } from '@/lib/types';
import { QRCode } from '@/components/QRCode';
import { fileToDisplayDataUrl } from '@/lib/imageLoad';
import { addPngMetadata } from '@/lib/pngMeta';
import { track, withUtm } from '@/lib/analytics';
import { XGlyph, WhatsAppGlyph, FacebookGlyph, WHATSAPP_GREEN } from '@/components/ShareGlyphs';
import { supporterShareText, whatsappUrl, messengerShareUrl, prefersTagalog } from '@/lib/share';
import { saveFramedPhoto, preferShareSheetForSave, isIOS, type SavePhotoOutcome } from '@/lib/savePhoto';
import { framedCircleToStoryBlob } from '@/lib/storyExport';
import { uploadExploreThumb } from '@/lib/exploreThumb';
import { AdSlot } from '@/components/AdSlot';
import { BrandMark } from '@/components/BrandMark';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { Upload, Download, Share2, Check, Loader2, Copy, QrCode, ImageDown, Sparkles, ArrowRight } from 'lucide-react';

const CANVAS = 1024;

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
    const { messages, locale } = useLocale();
    const t = messages.campaign;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const countedRef = useRef(false);

    const [hasImage, setHasImage] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [count, setCount] = useState(initialCount);
    const [downloading, setDownloading] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [imgTick, setImgTick] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    // An alert() covers the page and, in an in-app browser, can be dismissed by
    // a stray tap before it is read. The message belongs under the circle the
    // photo was supposed to land in.
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [justDownloaded, setJustDownloaded] = useState(false);
    const [canNativeShare, setCanNativeShare] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [pageUrl, setPageUrl] = useState(`https://ollabs.studio/c/${slug}`);
    const [reportOpen, setReportOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDone, setReportDone] = useState(false);
    const [canCopyImage, setCanCopyImage] = useState(false);
    const [imageCopied, setImageCopied] = useState(false);
    const [canSharePhoto, setCanSharePhoto] = useState(false);
    const [sharingPhoto, setSharingPhoto] = useState(false);
    const [sharingStory, setSharingStory] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        setCanCopyImage(
            typeof window !== 'undefined' &&
            typeof window.ClipboardItem !== 'undefined' &&
            !!navigator.clipboard && typeof navigator.clipboard.write === 'function'
        );
        setCanSharePhoto(preferShareSheetForSave());
    }, []);

    const handleCopyImage = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasImage) return;
        try {
            const blob = await taggedBlob();
            if (!blob) return;
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            setImageCopied(true);
            setTimeout(() => setImageCopied(false), 1500);
            recordSupporterUse();
            setJustDownloaded(true);
            track('frame_copy_image', { campaign: slug });
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
        if (typeof window !== 'undefined') setPageUrl(`${window.location.origin}/c/${slug}`);
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

    // Canonical clean URL for this campaign (avoids leaking inbound utm params).
    const shareUrl = () => (typeof window !== 'undefined' ? `${window.location.origin}/c/${slug}` : `https://ollabs.studio/c/${slug}`);

    // A function rather than a value: it reads navigator.language, which differs
    // between the server render and the browser, so it must not touch render.
    // Spanish and Tagalog share copy is browser-detected until those languages
    // have full client UI dictionaries.
    const shareText = () => supporterShareText(title, locale === 'en' ? undefined : locale);

    const openShare = (platform: 'x' | 'whatsapp' | 'facebook' | 'messenger') => {
        const url = withUtm(shareUrl(), platform === 'messenger' ? 'messenger' : platform);
        const text = shareText();
        const map: Record<string, string> = {
            x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            whatsapp: whatsappUrl(text, url),
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            messenger: messengerShareUrl(url),
        };
        if (platform === 'messenger') {
            window.location.href = map.messenger;
        } else {
            window.open(map[platform], '_blank', 'noopener,noreferrer');
        }
        track('frame_share', { campaign: slug, platform });
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl());
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 1500);
            track('copy_link', { campaign: slug });
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
        setUploadError(null);
        try {
            const dataUrl = await fileToDisplayDataUrl(file);
            const img = new Image();
            img.onload = () => {
                imgRef.current = img;
                setHasImage(true);
                setZoom(1);
                setPos({ x: 0, y: 0 });
                setJustDownloaded(false);
                setUploadError(null);
                track('photo_uploaded', { campaign: slug });
                draw();
            };
            img.onerror = () => { track('photo_upload_failed', { campaign: slug }); setUploadError('That image could not be opened. Try a JPG or PNG.'); };
            img.src = dataUrl;
        } catch {
            setUploadError('That image could not be opened. Try a JPG or PNG.');
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

    const recordSupporterUse = () => {
        if (countedRef.current) return;
        countedRef.current = true;

        void (async () => {
            let imageUrl: string | null = null;
            const canvas = canvasRef.current;
            // Wait two frames so the last drag/zoom paint is on the canvas before
            // we snapshot. Failures stay silent; the join still counts.
            if (canvas && imgRef.current) {
                await new Promise<void>((resolve) => {
                    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
                });
                imageUrl = await uploadExploreThumb(canvas);
                track('explore_thumb', { campaign: slug, ok: imageUrl ? 1 : 0 });
            }

            try {
                const res = await fetch(`/api/campaigns/${slug}/use`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(imageUrl ? { imageUrl } : {}),
                });
                const d = res.ok ? await res.json() : null;
                if (d && typeof d.supporter_count === 'number') {
                    setCount(d.supporter_count);
                    track('supporter_joined', { campaign: slug, count: d.supporter_count });
                }
            } catch {
                countedRef.current = false;
            }
        })();
    };

    const pngEntries = (): Record<string, string> => ({
        Software: 'Ollabs (ollabs.studio)',
        Title: title,
        Source: shareUrl(),
        Comment: `Made with Ollabs. Campaign "${title}" at ${shareUrl()}`,
        'Creation Time': new Date().toISOString(),
    });

    // Render the canvas to a PNG blob with provenance metadata embedded.
    const taggedBlob = async (): Promise<Blob | null> => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png', 1));
        if (!blob) return null;
        try {
            const tagged = addPngMetadata(new Uint8Array(await blob.arrayBuffer()), pngEntries());
            return new Blob([tagged as unknown as BlobPart], { type: 'image/png' });
        } catch {
            return blob;
        }
    };

    const applySaveOutcome = (outcome: SavePhotoOutcome) => {
        if (outcome === 'shared' || outcome === 'downloaded') {
            recordSupporterUse();
            setJustDownloaded(true);
            setSaveError(null);
            return true;
        }
        if (outcome === 'unavailable') {
            setSaveError(t.savePhotoUnavailable);
        }
        return false;
    };

    const handleDownload = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasImage) return;
        setDownloading(true);
        setSaveError(null);
        try {
            const blob = await taggedBlob();
            if (!blob) return;
            const outcome = await saveFramedPhoto({
                blob,
                filename: `ollabs-${slug}.png`,
                title,
                forceDownload: true,
            });
            if (applySaveOutcome(outcome)) {
                track('frame_download', { campaign: slug });
            }
        } finally {
            setDownloading(false);
        }
    };

    /**
     * Hand the finished PNG to the OS share sheet.
     *
     * This is the reliable path on a phone. Inside the WhatsApp and Instagram
     * in-app browsers on iOS, an <a download> is ignored, so Download can look
     * like it worked and leave the person with nothing. The share sheet gives
     * them Save Image, or sends the picture straight into a chat, and it is
     * what most people wanted from the button anyway.
     */
    const handleSharePhoto = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasImage) return;
        setSharingPhoto(true);
        setSaveError(null);
        try {
            const blob = await taggedBlob();
            if (!blob) return;
            const outcome = await saveFramedPhoto({
                blob,
                filename: `ollabs-${slug}.png`,
                title,
            });
            if (outcome === 'shared' && applySaveOutcome(outcome)) {
                track('frame_share_photo', { campaign: slug });
            } else if (outcome === 'downloaded' && applySaveOutcome(outcome)) {
                track('frame_download', { campaign: slug });
            } else {
                applySaveOutcome(outcome);
            }
        } finally {
            setSharingPhoto(false);
        }
    };

    /** 9:16 story PNG for Instagram / WhatsApp status. Square PF save stays primary. */
    const handleShareStory = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasImage) return;
        setSharingStory(true);
        setSaveError(null);
        try {
            const story = await framedCircleToStoryBlob(canvas);
            if (!story) return;
            const outcome = await saveFramedPhoto({
                blob: story,
                filename: `ollabs-${slug}-story.png`,
                title,
            });
            if (outcome === 'shared' || outcome === 'downloaded') {
                recordSupporterUse();
                setJustDownloaded(true);
                setSaveError(null);
                track('frame_share_story', { campaign: slug, outcome });
            } else if (outcome === 'unavailable') {
                setSaveError(t.savePhotoUnavailable);
            }
        } finally {
            setSharingStory(false);
        }
    };

    const handleShare = async () => {
        const url = withUtm(shareUrl(), 'native');
        if (navigator.share) {
            try {
                await navigator.share({ title, text: shareText(), url });
                track('frame_share', { campaign: slug, platform: 'native' });
                return;
            } catch { /* cancelled */ }
        }
        try {
            await navigator.clipboard.writeText(shareUrl());
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 1500);
        } catch { /* clipboard unavailable */ }
    };

    // Adjust = photo loaded, not yet saved. Post-save = viral share screen.
    // Empty = upload. Chrome stays out of the way once they are fitting a face.
    const adjusting = hasImage && !justDownloaded;
    // Fixed save bar is primary + optional Download + hint + error. Undersizing
    // this parks Copy image / ads under the thumb zone on Android.
    const bottomPad = adjusting
        ? 'pb-[calc(12rem+env(safe-area-inset-bottom,0px))]'
        : 'pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]';

    return (
        <div className={`min-h-screen bg-paper text-ink flex flex-col items-center px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] ${bottomPad}`}>
            {/* A3: mark only on empty / post-save. During adjust the frame is the UI. */}
            {!adjusting && <BrandMark className="mb-4 mt-2" size={24} />}

            <div className="w-full max-w-sm flex flex-col items-center gap-3">
                {justDownloaded ? (
                    <div className="text-center animate-fade-in px-1">
                        <p className="font-display text-xl font-bold leading-tight">{t.youreIn}</p>
                        <p className="text-sm text-muted mt-1.5 leading-relaxed">{t.bringPeople}</p>
                    </div>
                ) : (
                    <div className="text-center">
                        {!hasImage && (
                            <p className="text-sm font-semibold text-muted">{t.eyebrow}</p>
                        )}
                        <h1 className={`font-display font-bold text-balance ${hasImage ? 'text-lg mt-0' : 'text-2xl mt-1'}`}>
                            {title}
                        </h1>
                        {!hasImage && description && (
                            <p className="text-sm text-ink/70 mt-1">{description}</p>
                        )}
                    </div>
                )}

                {/* A1: canvas ~60dvh on phones so the face fills the first viewport.
                    Cap for desktop so the circle does not dominate a wide screen. */}
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
                    className={`rounded-full touch-none frame-shadow ${
                        hasImage
                            ? 'w-[min(88vw,58dvh)] h-[min(88vw,58dvh)] max-w-[400px] max-h-[400px] cursor-grab active:cursor-grabbing'
                            : 'w-[min(82vw,52dvh)] h-[min(82vw,52dvh)] max-w-[320px] max-h-[320px] cursor-pointer'
                    } ${dragOver ? 'ring-4 ring-brand/70' : ''}`}
                    style={{ background: 'transparent' }}
                />

                {adjusting && (
                    <div className="w-full space-y-2 animate-fade-in">
                        <p className="text-sm text-muted text-center">{t.dragHint}</p>
                        <div className="flex items-center gap-3 px-1">
                            <span className="text-xs font-semibold text-muted shrink-0">{t.size}</span>
                            <input
                                type="range"
                                min={0.3}
                                max={3}
                                step={0.01}
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                aria-label={t.size}
                                className="flex-1 h-8 accent-brand cursor-pointer"
                            />
                        </div>
                    </div>
                )}

                {!hasImage && <p className="text-sm text-muted">{t.tapHint}</p>}

                {uploadError && (
                    <p role="alert" className="w-full text-sm text-coral bg-coral/10 border border-coral/25 rounded-xl px-3 py-2.5 text-center">
                        {uploadError}
                    </p>
                )}

                {/* Before save only: under fit controls, above sticky bar. Never on photo. */}
                {adjusting && <AdSlot surface="campaign" className="w-full mt-1" />}

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                    }}
                />

                {!hasImage && (
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="w-full min-h-[56px] py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-brand hover:brightness-105 active:brightness-95 text-ink transition-all"
                    >
                        <Upload size={18} /> {t.uploadPhoto}
                    </button>
                )}

                {/* Post-save: framed result stays above. Share sheet leads when
                    available (iOS in-app); WhatsApp link is the explicit chat path. */}
                {justDownloaded && (
                    <div className="w-full space-y-3 animate-fade-in">
                        {saveError && (
                            <div role="alert" className="text-sm text-coral bg-coral/10 border border-coral/25 rounded-xl px-3 py-2.5 text-center space-y-2">
                                <p>{saveError}</p>
                                {isIOS() && (
                                    <a
                                        href={pageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex min-h-[40px] items-center rounded-lg bg-ink px-4 text-sm font-semibold text-paper"
                                    >
                                        {t.openInSafari}
                                    </a>
                                )}
                            </div>
                        )}
                        {canSharePhoto ? (
                            <button
                                onClick={handleSharePhoto}
                                disabled={sharingPhoto}
                                className="w-full min-h-[52px] py-3.5 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2.5 bg-ink text-paper hover:bg-ink/90 active:bg-ink/80 transition-colors disabled:opacity-50"
                            >
                                {sharingPhoto
                                    ? <Loader2 size={20} className="animate-spin" />
                                    : <><ImageDown size={20} /> {t.sharePhoto}</>}
                            </button>
                        ) : (
                            <button
                                onClick={() => openShare('whatsapp')}
                                className="w-full min-h-[52px] py-3.5 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2.5 text-white hover:brightness-105 active:brightness-95 transition-all"
                                style={{ backgroundColor: WHATSAPP_GREEN }}
                            >
                                <WhatsAppGlyph size={20} /> {t.shareWhatsApp}
                            </button>
                        )}

                        <button
                            onClick={handleShareStory}
                            disabled={sharingStory}
                            className="w-full min-h-[48px] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border border-ink/15 bg-cream hover:bg-ink/5 text-ink transition-colors disabled:opacity-50"
                        >
                            {sharingStory
                                ? <Loader2 size={16} className="animate-spin" />
                                : t.shareStory}
                        </button>

                        {canSharePhoto && (
                            <button
                                onClick={() => openShare('whatsapp')}
                                className="w-full min-h-[48px] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border border-ink/15 bg-cream hover:bg-ink/5 text-ink transition-colors"
                            >
                                <WhatsAppGlyph size={16} /> {t.shareLinkWhatsApp}
                            </button>
                        )}

                        {(prefersTagalog() || locale === 'id') && (
                            <button
                                onClick={() => openShare('messenger')}
                                className="w-full min-h-[48px] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border border-[#0084FF]/40 bg-[#0084FF]/10 text-ink hover:bg-[#0084FF]/15 transition-colors"
                            >
                                {t.shareMessenger}
                            </button>
                        )}

                        <div className="flex gap-2">
                            {canNativeShare && (
                                <button
                                    onClick={handleShare}
                                    className="flex-1 min-h-[48px] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-ink text-paper hover:bg-ink/90 transition-colors"
                                >
                                    <Share2 size={15} /> {t.shareAnother}
                                </button>
                            )}
                            <button
                                onClick={copyLink}
                                className="flex-1 min-h-[48px] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border border-ink/15 bg-cream hover:bg-ink/5 text-ink transition-colors"
                            >
                                {linkCopied
                                    ? <><Check size={15} className="text-brand-deep" /> {t.copied}</>
                                    : <><Copy size={15} /> {t.copyLink}</>}
                            </button>
                            <button
                                onClick={() => setShowQR((v) => !v)}
                                className="min-h-[48px] py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border border-ink/15 bg-cream hover:bg-ink/5 text-ink transition-colors"
                            >
                                <QrCode size={15} /> QR
                            </button>
                        </div>

                        {showQR && (
                            <div className="flex flex-col items-center gap-2 pt-1">
                                <QRCode value={pageUrl} size={168} className="border border-ink/10" />
                                <p className="text-[11px] text-muted">{t.scanCampaign}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => openShare('x')}
                                className="min-h-[44px] py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 bg-ink text-white hover:brightness-125 transition-all"
                            >
                                <XGlyph size={14} /> X
                            </button>
                            <button
                                onClick={() => openShare('facebook')}
                                className="min-h-[44px] py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 text-white hover:brightness-105 transition-all"
                                style={{ backgroundColor: '#1877F2' }}
                            >
                                <FacebookGlyph size={14} /> Facebook
                            </button>
                        </div>

                        <AdSlot surface="campaign" className="mt-1" />

                        <div className="w-full text-center space-y-3 pt-2">
                            <p className="font-display font-bold text-lg leading-tight flex items-center justify-center gap-1.5">
                                <Sparkles size={17} className="text-brand-deep" /> {t.wantOwn}
                            </p>
                            <p className="text-sm text-ink/70 leading-relaxed px-1">{t.wantOwnBody}</p>
                            <a
                                href={withUtm(`/create?from=${encodeURIComponent(slug)}`, 'campaign_page')}
                                onClick={() => track('create_from_campaign', { campaign: slug })}
                                className="w-full min-h-[52px] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-ink text-paper hover:brightness-125 active:brightness-110 transition-all"
                            >
                                {t.makeOwn} <ArrowRight size={17} />
                            </a>
                            <a
                                href={withUtm('/hub', 'campaign_post_save')}
                                onClick={() => track('hub_from_campaign', { campaign: slug })}
                                className="w-full min-h-[48px] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border border-brand/30 bg-brand/10 text-brand-deep hover:bg-brand/15 transition-all"
                            >
                                {t.setupHub}
                            </a>
                        </div>

                        <button
                            onClick={() => {
                                setJustDownloaded(false);
                                fileRef.current?.click();
                            }}
                            className="w-full min-h-[48px] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border border-ink/15 bg-cream hover:bg-ink/5 text-ink transition-colors"
                        >
                            <Upload size={16} /> {t.newPhoto}
                        </button>
                    </div>
                )}

                {adjusting && canCopyImage && (
                    <button
                        onClick={handleCopyImage}
                        className="w-full min-h-[44px] py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border border-ink/15 bg-cream hover:bg-ink/5 text-ink transition-colors"
                    >
                        {imageCopied
                            ? <><Check size={16} className="text-brand-deep" /> {t.imageCopied}</>
                            : <><Copy size={16} /> {t.copyImage}</>}
                    </button>
                )}

                {/* Count stays below the fold while adjusting so the save bar leads. */}
                {!adjusting && (
                    <div className="w-full border-t border-ink/10 pt-5 mt-2 text-center">
                        <div className="font-display flex items-center justify-center gap-2 text-2xl font-bold">
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
                                    {count.toLocaleString()} {t.of} {goal.toLocaleString()} {t.ofSupporters}
                                    {count >= goal ? ` · ${t.goalReached}` : ''}
                                </p>
                            </>
                        ) : (
                            <p className="text-xs text-muted mt-0.5">{t.peopleSupporting}</p>
                        )}
                    </div>
                )}

                {!hasImage && (
                    <a
                        href={`/create?from=${encodeURIComponent(slug)}`}
                        onClick={() => track('create_from_campaign', { campaign: slug, from: 'footer' })}
                        className="text-xs text-muted hover:text-brand-deep transition-colors mt-1"
                    >
                        {t.makeOwnFooter}
                    </a>
                )}

                {justDownloaded && <AdSlot surface="campaign" className="mt-2" />}

                {!adjusting && (
                    reportDone ? (
                        <p className="text-[11px] text-muted/70">{t.reportThanks}</p>
                    ) : reportOpen ? (
                        <div className="w-full max-w-xs bg-cream border border-ink/10 rounded-xl p-3 space-y-2">
                            <p className="text-xs font-semibold text-ink">{t.reportTitle}</p>
                            <textarea
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                placeholder={t.reportPlaceholder}
                                className="w-full bg-paper border border-ink/10 rounded-lg px-2.5 py-2 text-sm text-ink placeholder-muted outline-none focus:ring-2 focus:ring-brand/40 resize-none min-h-[56px]"
                            />
                            <div className="flex gap-2">
                                <button onClick={submitReport} className="flex-1 py-2 rounded-lg text-xs font-bold bg-coral text-white hover:brightness-105 transition-all">{t.submitReport}</button>
                                <button onClick={() => setReportOpen(false)} className="py-2 px-3 rounded-lg text-xs font-semibold bg-paper border border-ink/10 text-ink hover:bg-ink/5 transition-colors">{t.cancel}</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setReportOpen(true)} className="text-[11px] text-muted/70 hover:text-coral transition-colors">{t.report}</button>
                    )
                )}
            </div>

            {/* A3: thumb-zone only while adjusting. After save, share CTAs above lead. */}
            {adjusting && (
                <div className="fixed bottom-0 inset-x-0 z-40 border-t border-ink/10 bg-paper/95 backdrop-blur-xl px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
                    <div className="w-full max-w-sm mx-auto flex flex-col gap-2">
                        {saveError && (
                            <div role="alert" className="text-xs text-coral bg-coral/10 border border-coral/25 rounded-xl px-3 py-2.5 text-center space-y-2">
                                <p>{saveError}</p>
                                {isIOS() && (
                                    <a
                                        href={pageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex min-h-[40px] items-center rounded-lg bg-ink px-4 font-semibold text-paper"
                                    >
                                        {t.openInSafari}
                                    </a>
                                )}
                            </div>
                        )}
                        {canSharePhoto ? (
                            <>
                                <button
                                    onClick={handleSharePhoto}
                                    disabled={sharingPhoto}
                                    className="w-full min-h-[52px] py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 bg-brand hover:brightness-105 active:brightness-95 text-ink transition-all disabled:opacity-50"
                                >
                                    {sharingPhoto
                                        ? <Loader2 size={20} className="animate-spin" />
                                        : <><ImageDown size={20} /> {t.saveOrShare}</>}
                                </button>
                                {!isIOS() && (
                                    <button
                                        onClick={handleDownload}
                                        disabled={downloading}
                                        className="w-full min-h-[44px] py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border border-ink/15 bg-cream hover:bg-ink/5 text-ink transition-colors disabled:opacity-50"
                                    >
                                        {downloading
                                            ? <Loader2 size={16} className="animate-spin" />
                                            : <><Download size={16} /> {t.download}</>}
                                    </button>
                                )}
                                <p className="text-[11px] text-muted text-center leading-snug px-1">{t.savePhotoHint}</p>
                            </>
                        ) : (
                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                className="w-full min-h-[52px] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-brand hover:brightness-105 text-ink transition-all disabled:opacity-50"
                            >
                                {downloading
                                    ? <Loader2 size={18} className="animate-spin" />
                                    : <><Download size={18} /> {t.download}</>}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
