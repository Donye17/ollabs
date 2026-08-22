"use client";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Editor } from './Editor';
import { FrameSelector } from './FrameSelector';
import { CustomFramePanel } from './CustomFramePanel';
import { NavBar } from '@/components/NavBar';
import { DEFAULT_FRAME } from '@/lib/constants';
import { fileToDisplayDataUrl } from '@/lib/imageLoad';
import { FrameConfig } from '@/lib/types';
import { getFlag, resolveFlagFrame } from '@/lib/flags';
import { AlertCircle, ChevronDown, Loader2, Save, Upload } from 'lucide-react';
import { PublishTemplateModal } from './PublishTemplateModal';
import { useLocale } from '@/components/i18n/LocaleProvider';
// Loaded on demand (see handleRemoveBackground). This library is ~5.5MB of WASM;
// importing it statically made every visitor to /create download it whether or
// not they ever removed a background.

/** Set when /create is opened as ?edit=<slug>&k=<owner token>. */
export interface EditTarget {
    slug: string;
    token: string;
    title: string;
}

export const EditorPage: React.FC<{ remixId?: string }> = ({ remixId }) => {
    const { messages } = useLocale();
    const t = messages.create;
    // History State (Frame Config)
    const [history, setHistory] = useState<FrameConfig[]>([DEFAULT_FRAME]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);
    const selectedFrame = history[historyIndex];

    // Editing an existing campaign's frame rather than building a new one.
    // Organizers were rebuilding whole campaigns to change a frame, abandoning
    // the link they had already shared, because there was no way back in here.
    const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    // Refs
    const editorRef = useRef<{ getDominantColors: () => Promise<string[]> }>(null);

    // Things that went wrong surface under the canvas rather than through
    // alert(). On a phone an alert covers the whole page, and inside an in-app
    // browser it can be dismissed by a stray tap before it is read.
    const [notice, setNotice] = useState<string | null>(null);

    const [isPublishOpen, setIsPublishOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [imageSrc, setImageSrc] = useState<string | null>(null);

    // Editing an existing campaign: load its saved frame into the editor.
    useEffect(() => {
        let slug: string | null = null;
        let token: string | null = null;
        try {
            const params = new URLSearchParams(window.location.search);
            slug = params.get('edit');
            token = params.get('k');
        } catch { /* ignore */ }
        if (!slug || !token) return;

        const key = token;
        setEditLoading(true);
        fetch(`/api/campaigns/${slug}/manage?token=${encodeURIComponent(key)}`)
            .then(async (r) => {
                if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Could not open this campaign');
                return r.json();
            })
            .then((d) => {
                const raw = d.frame_config;
                const config = typeof raw === 'string' ? JSON.parse(raw) : raw;
                if (!config) throw new Error('This campaign has no frame saved on it.');
                setHistory([config]);
                setHistoryIndex(0);
                setEditTarget({ slug: d.slug, token: key, title: d.title });
            })
            .catch((e) => setEditError(e.message || 'Could not open this campaign'))
            .finally(() => setEditLoading(false));
    }, []);

    // Arriving from a /flags page: start on that country's frame.
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('edit')) return;
            const flag = getFlag(params.get('flag') || '');
            if (!flag) return;
            setHistory([resolveFlagFrame(flag)]);
            setHistoryIndex(0);
        } catch { /* ignore */ }
    }, []);

    // Reuse another campaign's frame: /create?remix=<slug>
    useEffect(() => {
        let remix: string | null = null;
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('edit')) return;
            remix = params.get('remix');
        } catch { /* ignore */ }
        if (!remix) return;

        setIsLoading(true);
        fetch(`/api/campaigns/${encodeURIComponent(remix)}`)
            .then(async (r) => {
                if (!r.ok) throw new Error('Could not load that frame');
                return r.json();
            })
            .then((d) => {
                const raw = d.frame_config;
                const config = typeof raw === 'string' ? JSON.parse(raw) : raw;
                if (!config) throw new Error('This campaign has no frame saved on it.');
                setHistory([config]);
                setHistoryIndex(0);
            })
            .catch((e) => setNotice(e.message || 'Could not load that frame'))
            .finally(() => setIsLoading(false));
    }, []);

    // Initial load: restore an in-progress frame from local storage. Skipped when
    // editing or when a flag was requested, so neither can be overwritten by a
    // half-finished draft.
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('edit') || params.get('flag')) return;
            const stored = localStorage.getItem('temp_frame');
            if (stored) {
                const frame = JSON.parse(stored);
                const config = frame.config ? (typeof frame.config === 'string' ? JSON.parse(frame.config) : frame.config) : frame;
                setHistory([{ ...config, id: frame.id }]);
                setHistoryIndex(0);
                localStorage.removeItem('temp_frame');
            }
        } catch (e) {
            console.error("Failed to load frame from storage", e);
        }
    }, []);


    const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
    const [isRemovingBg, setIsRemovingBg] = useState(false);

    const handleRemoveBackground = async () => {
        if (!imageSrc) return;
        setIsRemovingBg(true);
        setNotice(null);
        try {
            const { removeBackground } = await import("@imgly/background-removal");
            const blob = await removeBackground(imageSrc);
            const url = URL.createObjectURL(blob);
            setImageSrc(url);
        } catch (error) {
            console.error("BG Removal failed", error);
            setNotice("Could not remove the background. Your photo is unchanged. Try again, or use it as it is.");
        } finally {
            setIsRemovingBg(false);
        }
    };

    const handleImageSelect = async (file: File) => {
        if (!file) return;
        setNotice(null);
        try {
            const dataUrl = await fileToDisplayDataUrl(file);
            setImageSrc(dataUrl);
        } catch {
            setNotice('That image could not be opened. Try a JPG or PNG.');
        }
    };

    const handleReset = () => {
        setImageSrc(null);
        setPreviewDataUrl(null);
        setNotice(null);
    };

    // History Helpers
    const addToHistory = (newFrame: FrameConfig) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newFrame);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handlePresetSelect = (frame: FrameConfig) => addToHistory(frame);
    const handleFrameUpdate = (updatedFrame: FrameConfig) => addToHistory(updatedFrame);
    const handlePreviewUpdate = useCallback((dataUrl: string) => setPreviewDataUrl(dataUrl), []);

    if (isLoading || editLoading) {
        return (
            <div className="min-h-screen bg-paper flex flex-col items-center justify-center text-ink font-sans">
                <Loader2 className="w-12 h-12 text-brand-deep animate-spin mb-4" />
                <p className="text-muted text-sm animate-pulse">{editLoading ? 'Loading your frame...' : 'Loading template...'}</p>
            </div>
        );
    }

    if (editError) {
        return (
            <div className="min-h-screen bg-paper text-ink font-sans">
                <NavBar />
                <div className="max-w-md mx-auto pt-32 px-6 text-center">
                    <div className="bg-cream border border-ink/10 rounded-2xl p-8">
                        <AlertCircle className="w-8 h-8 text-coral mx-auto mb-3" />
                        <p className="font-display font-bold text-lg mb-1">Can&apos;t open that campaign</p>
                        <p className="text-sm text-ink/70 mb-6">{editError}</p>
                        <a href="/create" className="inline-flex h-11 px-6 rounded-xl bg-brand text-ink font-bold items-center hover:brightness-105 transition-all">
                            Build a new frame
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const openPublish = () => setIsPublishOpen(true);

    return (
        <div className="min-h-screen bg-paper text-ink font-sans pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
            <NavBar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(3.5rem+env(safe-area-inset-top,0px)+0.5rem)] pb-6 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">

                    {/* Canvas stays pinned on phones so cutout/caption edits never
                        scroll the only preview that matters off-screen. */}
                    <div className="lg:col-span-7 flex flex-col items-center sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-0 bg-paper/95 backdrop-blur-sm py-2 lg:py-0 lg:bg-transparent lg:backdrop-blur-none h-fit">
                        <Editor
                            imageSrc={imageSrc}
                            onImageSelect={handleImageSelect}
                            selectedFrame={selectedFrame}
                            onReset={handleReset}
                            onPreviewUpdate={handlePreviewUpdate}
                            editorRef={editorRef}
                            onRemoveBackground={handleRemoveBackground}
                            isRemovingBackground={isRemovingBg}
                        />

                        {notice && (
                            <div role="alert" className="mt-4 p-4 bg-coral/10 rounded-2xl border border-coral/30 text-sm text-ink/80 max-w-md w-full flex gap-3 items-start animate-fade-in">
                                <AlertCircle className="shrink-0 text-coral mt-0.5" size={18} />
                                <p className="flex-1">{notice}</p>
                                <button
                                    onClick={() => setNotice(null)}
                                    aria-label="Dismiss"
                                    className="shrink-0 text-muted hover:text-ink transition-colors -mt-0.5 px-1"
                                >
                                    &times;
                                </button>
                            </div>
                        )}

                        <p className="mt-3 text-xs text-muted text-center max-w-md hidden lg:block">
                            {t.dragTip}
                        </p>
                    </div>

                    {/* Controls — custom frame first; premades demoted */}
                    <div className="lg:col-span-5 space-y-4 relative z-10">
                        <div className="px-1">
                            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                                {editTarget ? t.editTitle : t.title}
                            </h1>
                            <p className="text-xs text-muted font-medium">
                                {editTarget
                                    ? t.editSubtitle(editTarget.title)
                                    : t.subtitle}
                            </p>
                        </div>

                        <CustomFramePanel
                            frame={selectedFrame}
                            onChange={handleFrameUpdate}
                        />

                        {/* Premades are a fallback. Real organizers upload brand art;
                            leading with eight swatches made the product feel like a
                            sticker picker instead of a campaign tool. */}
                        <details className="group bg-cream border border-ink/10 rounded-2xl overflow-hidden">
                            <summary className="flex items-center cursor-pointer list-none px-5 py-4 text-sm font-bold text-ink hover:bg-ink/5 transition-colors [&::-webkit-details-marker]:hidden">
                                <span className="flex-1">{t.simpleStyles}</span>
                                <span className="text-[11px] font-semibold text-muted normal-case tracking-normal mr-2">{t.fallback}</span>
                                <ChevronDown size={18} className="text-muted transition-transform group-open:rotate-180 shrink-0" />
                            </summary>
                            <div className="px-5 pb-5 space-y-3 border-t border-ink/10 pt-4">
                                <p className="text-xs text-muted">{t.simpleStylesHint}</p>
                                <FrameSelector selectedFrameId={selectedFrame.id} onSelect={handlePresetSelect} />
                            </div>
                        </details>

                        {/* Desktop publish — phones use the sticky bar */}
                        <button
                            onClick={openPublish}
                            className="hidden lg:flex w-full min-h-[52px] items-center justify-center gap-2 bg-brand text-ink px-4 py-3.5 rounded-xl text-base font-bold hover:brightness-105 transition-all"
                        >
                            {editTarget
                                ? <><Save size={18} /> {t.saveChanges}</>
                                : <><Upload size={18} /> {t.createCampaign}</>}
                        </button>
                    </div>
                </div>
            </main>

            {/* Thumb-zone create. Header buttons are easy to miss once you are
                deep in cutout controls on a small screen. */}
        <div className="fixed bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] inset-x-0 z-40 lg:hidden border-t border-ink/10 bg-paper/95 backdrop-blur-xl px-4 pt-3 pb-3">
                <div className="max-w-lg mx-auto">
                    <button
                        onClick={openPublish}
                        className="w-full min-h-[52px] flex items-center justify-center gap-2 bg-brand text-ink px-4 py-3.5 rounded-xl text-base font-bold hover:brightness-105 active:brightness-95 transition-all"
                    >
                    {editTarget
                        ? <><Save size={18} /> {t.saveChanges}</>
                        : <><Upload size={18} /> {t.createCampaign}</>}
                    </button>
                </div>
            </div>

            <PublishTemplateModal
                isOpen={isPublishOpen}
                onClose={() => setIsPublishOpen(false)}
                config={selectedFrame}
                previewDataUrl={previewDataUrl}
                parentId={remixId}
                editTarget={editTarget}
            />

            <footer className="hidden lg:block py-12 text-center text-muted text-sm border-t border-ink/10 bg-paper">
                <p>&copy; {new Date().getFullYear()} Ollabs. Bring your people together.</p>
            </footer>
        </div>
    );
};
