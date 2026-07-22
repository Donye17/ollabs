"use client";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Editor } from './Editor';
import { FrameSelector } from './FrameSelector';
import { FrameCustomizer } from './FrameCustomizer';
import { CustomFramePanel } from './CustomFramePanel';
import { CaptionControls } from './CaptionControls';
import { ContactPreview } from './ContactPreview';
import { TextControls } from './TextControls';
import { NavBar } from '@/components/NavBar';
import { DEFAULT_FRAME } from '@/lib/constants';
import { fileToDisplayDataUrl } from '@/lib/imageLoad';
import { FrameConfig, StickerConfig, TextConfig, MotionEffect } from '@/lib/types';
import { AlertCircle, Sparkles, Sliders, Eye, Type, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { PublishTemplateModal } from './PublishTemplateModal';
import { OnboardingOverlay } from './editor/OnboardingOverlay';
import { removeBackground } from "@imgly/background-removal";

export const EditorPage: React.FC<{ remixId?: string }> = ({ remixId }) => {
    // History State (Frame Config)
    const [history, setHistory] = useState<FrameConfig[]>([DEFAULT_FRAME]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);
    const selectedFrame = history[historyIndex];

    // Editor State (Lifted Up)
    const [stickers, setStickers] = useState<StickerConfig[]>([]);
    const [textLayers, setTextLayers] = useState<TextConfig[]>([]);
    const [motionEffect, setMotionEffect] = useState<MotionEffect>('none');
    const [isPlaying, setIsPlaying] = useState(false);
    const [selection, setSelection] = useState<string | null>(null); // For Stickers
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null); // For Text

    // Refs
    const editorRef = useRef<{ exportGif: () => void; generateGif: () => Promise<Blob>; getDominantColors: () => Promise<string[]> }>(null);

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


    const [activeTab, setActiveTab] = useState<'design' | 'custom' | 'customize' | 'text' | 'preview'>('design');
    const [isPublishOpen, setIsPublishOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(!!remixId);

    const [imageSrc, setImageSrc] = useState<string | null>(null);

    // Initial load: restore an in-progress frame from local storage.
    useEffect(() => {
        try {
            const stored = localStorage.getItem('temp_frame');
            if (stored) {
                const frame = JSON.parse(stored);
                const config = frame.config ? (typeof frame.config === 'string' ? JSON.parse(frame.config) : frame.config) : frame;
                setHistory([{ ...config, id: frame.id }]);
                setHistoryIndex(0);
                if (config.stickers) setStickers(config.stickers);
                if (config.textLayers) setTextLayers(config.textLayers);
                if (config.motionEffect) setMotionEffect(config.motionEffect);
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
        setStickers([]);
        setTextLayers([]);
        setMotionEffect('none');
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



    if (isLoading) {
        return (
            <div className="min-h-screen bg-paper flex flex-col items-center justify-center text-ink font-sans">
                <Loader2 className="w-12 h-12 text-brand-deep animate-spin mb-4" />
                <p className="text-muted text-sm animate-pulse">Loading template...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper text-ink font-sans">
            <NavBar />
            <OnboardingOverlay />

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

                            // State Props
                            stickers={stickers}
                            onStickersChange={setStickers}
                            textLayers={textLayers}
                            onTextLayersChange={setTextLayers}
                            motionEffect={motionEffect}
                            isPlaying={isPlaying}

                            // Interaction Props
                            selection={selection}
                            onSelectSticker={setSelection}
                            selectedTextId={selectedTextId}
                            onSelectText={setSelectedTextId}

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
                            <div>
                                <h1 className="font-display text-2xl font-extrabold text-ink tracking-tight">Campaign builder</h1>
                                <p className="text-xs text-muted font-medium">Make your frame, then share one link.</p>
                            </div>
                            <button
                                onClick={() => setIsPublishOpen(true)}
                                className="bg-brand text-ink px-3 py-2 sm:px-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:brightness-105 transition-all"
                            >
                                <Upload size={16} /> <span className="hidden sm:inline">Create campaign</span>
                            </button>
                        </div>

                        {/* Tab Switcher - Scrollable on mobile */}
                        <div className="flex p-1 bg-cream border border-ink/10 rounded-2xl overflow-x-auto scrollbar-hide">
                            {[
                                { id: 'design', icon: Sparkles, label: 'Design' },
                                { id: 'custom', icon: ImageIcon, label: 'Custom' },
                                { id: 'customize', icon: Sliders, label: 'Edit' },
                                // Text tab removed as per user request
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

                            {activeTab === 'text' && (
                                <div className="space-y-4 animate-fade-in">
                                    <TextControls
                                        textLayers={textLayers}
                                        selectedTextId={selectedTextId}
                                        onAddText={() => {
                                            const newText: TextConfig = {
                                                id: Date.now().toString(),
                                                text: 'New Text',
                                                x: 0,
                                                y: 0,
                                                fontSize: 40,
                                                fontFamily: 'Inter',
                                                color: '#ffffff',
                                                rotation: 0,
                                                align: 'center',
                                                flip: false,
                                                curved: true
                                            };
                                            setTextLayers([...textLayers, newText]);
                                            setSelectedTextId(newText.id);
                                            setSelection(null);
                                        }}
                                        onUpdateText={(id, updates) => {
                                            setTextLayers(textLayers.map(t => t.id === id ? { ...t, ...updates } : t));
                                        }}
                                        onDeleteText={(id) => {
                                            setTextLayers(textLayers.filter(t => t.id !== id));
                                            if (selectedTextId === id) setSelectedTextId(null);
                                        }}
                                        onSelectText={(id) => {
                                            setSelectedTextId(id);
                                            setSelection(null);
                                        }}
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
                config={{ ...selectedFrame, stickers, textLayers }}
                previewDataUrl={previewDataUrl}
                parentId={remixId}
            />

            <footer className="py-12 text-center text-muted text-sm border-t border-ink/10 bg-paper">
                <p>&copy; {new Date().getFullYear()} Ollabs. Bring your people together.</p>
            </footer>
        </div>
    );
};
