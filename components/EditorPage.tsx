"use client";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Editor } from './Editor';
import { FrameSelector } from './FrameSelector';
import { FrameCustomizer } from './FrameCustomizer';
import { CustomFramePanel } from './CustomFramePanel';
import { CaptionControls } from './CaptionControls';
import { ContactPreview } from './ContactPreview';
import { NavBar } from '@/components/NavBar';
import { DEFAULT_FRAME } from '@/lib/constants';
import { fileToDisplayDataUrl } from '@/lib/imageLoad';
import { FrameConfig } from '@/lib/types';
import { getFlag, resolveFlagFrame } from '@/lib/flags';
import { AlertCircle, Sparkles, Sliders, Eye, Image as ImageIcon, Upload, Loader2, Save } from 'lucide-react';
import { PublishTemplateModal } from './PublishTemplateModal';
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

    const handleAutoMatch = async () => {
        if (!editorRef.current) return;
        try {
            const colors = await editorRef.current.getDominantColors();
            if (colors && colors.length >= 2) {
                const newFrame = { ...selectedFrame, color1: colors[0], color2: colors[1] };
                handleFrameUpdate(newFrame);
            } else if (colors && colors.length === 1) {
                const newFrame = { ...selectedFrame, color1: colors[0] };
                handleFrameUpdate(newFrame);
            }
        } catch (e) {
            console.error("Auto match failed", e);
            alert("Could not extract colors from this image.");
        }
    };


    const [activeTab, setActiveTab] = useState<'design' | 'custom' | 'customize' | 'preview'>('design');
    const [isPublishOpen, setIsPublishOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(!!remixId);

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
        try {
            const { removeBackground } = await import("@imgly/background-removal");
            const blob = await removeBackground(imageSrc);
            const url = URL.createObjectURL(blob);
            setImageSrc(url);
        } catch (error) {
            console.error("BG Removal failed", error);
            alert("Failed to remove background. Please try again.");
        } finally {
            setIsRemovingBg(false);
        }
    };

    const handleImageSelect = async (file: File) => {
        if (!file) return;
        try {
            const dataUrl = await fileToDisplayDataUrl(file);
            setImageSrc(dataUrl);
        } catch {
            alert('That image could not be opened. Try a JPG or PNG.');
        }
    };

    const handleReset = () => {
        setImageSrc(null);
        setPreviewDataUrl(null);
    };

    // History Helpers
    const addToHistory = (newFrame: FrameConfig) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newFrame);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleUndo = () => historyIndex > 0 && setHistoryIndex(historyIndex - 1);
    const handleRedo = () => historyIndex < history.length - 1 && setHistoryIndex(historyIndex + 1);
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

    return (
        <div className="min-h-screen bg-paper text-ink font-sans">
            <NavBar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* Left Column: Canvas */}
                    <div className="lg:col-span-7 flex flex-col items-center sticky top-24 z-0 h-fit lg:h-auto">
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

                        {/* Tip Box */}
                        <div className="mt-8 p-4 bg-brand/10 rounded-2xl border border-brand/30 text-sm text-ink/70 max-w-md flex gap-3 items-start animate-fade-in">
                            <AlertCircle className="shrink-0 text-brand-deep mt-0.5" size={18} />
                            <p><strong className="text-ink">Tip:</strong> Drag and drop a photo to start. Pinch to zoom or pan.</p>
                        </div>
                    </div>

                    {/* Right Column: Key Controls */}
                    <div className="lg:col-span-5 space-y-6 relative z-10 bg-paper/95 backdrop-blur-xl lg:bg-transparent lg:backdrop-blur-none p-4 -mx-4 rounded-t-3xl border-t border-ink/10 lg:border-none lg:p-0 lg:m-0 lg:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.12)] lg:shadow-none">

                        {/* Creator Header */}
                        <div className="flex items-center justify-between px-2">
                            <div className="min-w-0">
                                <h1 className="font-display text-2xl font-extrabold text-ink tracking-tight">
                                    {editTarget ? 'Edit your frame' : 'Campaign builder'}
                                </h1>
                                <p className="text-xs text-muted font-medium truncate">
                                    {editTarget
                                        ? `Saves to "${editTarget.title}". Your link and supporters stay put.`
                                        : 'Make your frame, then share one link.'}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsPublishOpen(true)}
                                className="bg-brand text-ink px-3 py-2 sm:px-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:brightness-105 transition-all shrink-0"
                            >
                                {editTarget
                                    ? <><Save size={16} /> <span className="hidden sm:inline">Save changes</span></>
                                    : <><Upload size={16} /> <span className="hidden sm:inline">Create campaign</span></>}
                            </button>
                        </div>

                        {/* Tab Switcher - Scrollable on mobile */}
                        <div className="flex p-1 bg-cream border border-ink/10 rounded-2xl overflow-x-auto scrollbar-hide">
                            {[
                                { id: 'design', icon: Sparkles, label: 'Design' },
                                { id: 'custom', icon: ImageIcon, label: 'Custom' },
                                { id: 'customize', icon: Sliders, label: 'Edit' },
                                { id: 'preview', icon: Eye, label: 'Preview' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 min-w-[60px] flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl text-[10px] uppercase font-bold tracking-wide transition-all ${activeTab === tab.id ? 'bg-ink text-paper shadow-sm' : 'text-muted hover:text-ink'}`}
                                >
                                    <tab.icon size={18} />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content Panels */}
                        <div className="bg-cream border border-ink/10 p-6 rounded-3xl min-h-[400px]">

                            {activeTab === 'design' && (
                                <div className="space-y-5 animate-fade-in">
                                    <div>
                                        <h2 className="font-display text-lg font-bold text-ink mb-1">Choose a style</h2>
                                        <p className="text-muted text-xs">Select a base frame to start with.</p>
                                    </div>
                                    <FrameSelector selectedFrameId={selectedFrame.id} onSelect={handlePresetSelect} />
                                    <div className="pt-4 border-t border-ink/10">
                                        <CaptionControls frame={selectedFrame} onChange={handleFrameUpdate} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'custom' && (
                                <CustomFramePanel
                                    frame={selectedFrame}
                                    onChange={handleFrameUpdate}
                                />
                            )}

                            {activeTab === 'customize' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <h2 className="font-display text-lg font-bold text-ink mb-1">Fine tune</h2>
                                        <p className="text-muted text-xs">Adjust colors, borders, and effects.</p>
                                    </div>
                                    <FrameCustomizer
                                        frame={selectedFrame}
                                        onChange={handleFrameUpdate}
                                        onUndo={handleUndo}
                                        onRedo={handleRedo}
                                        canUndo={historyIndex > 0}
                                        canRedo={historyIndex < history.length - 1}
                                        onAutoMatch={handleAutoMatch}
                                    />
                                </div>
                            )}

                            {activeTab === 'preview' && (
                                <div className="space-y-4 animate-fade-in flex flex-col items-center justify-center h-full">
                                    <div>
                                        <h2 className="font-display text-lg font-bold text-ink mb-1 text-center">Live preview</h2>
                                        <p className="text-muted text-xs text-center mb-6">See how it looks in a contact list.</p>
                                    </div>
                                    <ContactPreview previewSrc={previewDataUrl} />
                                </div>
                            )}

                        </div>

                    </div>

                </div>
            </main>

            <PublishTemplateModal
                isOpen={isPublishOpen}
                onClose={() => setIsPublishOpen(false)}
                config={selectedFrame}
                previewDataUrl={previewDataUrl}
                parentId={remixId}
                editTarget={editTarget}
            />

            <footer className="py-12 text-center text-muted text-sm border-t border-ink/10 bg-paper">
                <p>&copy; {new Date().getFullYear()} Ollabs. Bring your people together.</p>
            </footer>
        </div>
    );
};
