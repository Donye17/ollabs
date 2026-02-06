"use client";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Editor } from './Editor';
import { FrameSelector } from './FrameSelector';
import { FrameCustomizer } from './FrameCustomizer';
import { CustomFramePanel } from './CustomFramePanel';
import { ContactPreview } from './ContactPreview';
import { StickerControls } from './StickerControls';
import { TextControls } from './TextControls';
import { MotionControls } from './MotionControls';
import { NavBar } from '@/components/NavBar';
import { AVAILABLE_FRAMES } from '@/lib/constants';
import { FrameConfig, StickerConfig, TextConfig, MotionEffect } from '@/lib/types';
import { AlertCircle, Sparkles, Sliders, Eye, Type, Sticker, Clapperboard, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { PublishTemplateModal } from './PublishTemplateModal';
import { OnboardingOverlay } from './editor/OnboardingOverlay';
import { removeBackground } from "@imgly/background-removal";

export const EditorPage: React.FC<{ remixId?: string }> = ({ remixId }) => {
    // History State (Frame Config)
    const [history, setHistory] = useState<FrameConfig[]>([AVAILABLE_FRAMES[2]]);
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


    const [activeTab, setActiveTab] = useState<'design' | 'custom' | 'customize' | 'text' | 'decor' | 'motion' | 'preview'>('design');
    const [isPublishOpen, setIsPublishOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(!!remixId);

    // Initial Load Logic (Local Storage OR Remix ID)
    useEffect(() => {
        const loadInitialFrame = async () => {
            if (remixId) {
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/frames?id=${remixId}`);
                    if (res.ok) {
                        const frames = await res.json();
                        if (frames.length > 0) {
                            const frame = frames[0];
                            const config = typeof frame.config === 'string' ? JSON.parse(frame.config) : frame.config;
                            setHistory([{ ...config, id: frame.id }]);
                            setHistoryIndex(0);
                            window.history.replaceState({}, '', '/create');
                        }
                    }
                } catch (e) {
                    console.error("Failed to load remix frame", e);
                } finally {
                    setIsLoading(false);
                }
                return;
            }
            try {
                const stored = localStorage.getItem('temp_frame');
                if (stored) {
                    const frame = JSON.parse(stored);
                    setHistory([frame]);
                    setHistoryIndex(0);
                    localStorage.removeItem('temp_frame');
                }
            } catch (e) {
                console.error("Failed to load frame from storage", e);
            }
        };
        loadInitialFrame();
    }, [remixId]);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
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

    const handleImageSelect = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setImageSrc(event.target?.result as string);
            reader.readAsDataURL(file);
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

    // Handlers for controls
    const handleAddSticker = (icon: string) => {
        setStickers(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                icon: icon,
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0
            }
        ]);
    };

    const handleUpdateSticker = (id: string, updates: Partial<StickerConfig>) => {
        setStickers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const handleDeleteSticker = (id: string) => {
        setStickers(prev => prev.filter(s => s.id !== id));
        if (selection === id) setSelection(null);
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-50 font-sans">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-zinc-400 text-sm animate-pulse">Loading Template...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-blue-500/30">
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
                        <div className="mt-8 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-sm text-blue-200 max-w-md flex gap-3 items-start animate-fade-in">
                            <AlertCircle className="shrink-0 text-blue-400 mt-0.5" size={18} />
                            <p><strong>Tip:</strong> Drag & Drop a photo to start. Pinch to zoom/pan.</p>
                        </div>
                    </div>

                    {/* Right Column: Key Controls */}
                    <div className="lg:col-span-5 space-y-6 relative z-10 bg-zinc-950/95 backdrop-blur-xl lg:bg-transparent lg:backdrop-blur-none p-4 -mx-4 rounded-t-3xl border-t border-white/10 lg:border-none lg:p-0 lg:m-0 lg:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:shadow-none">

                        {/* Creator Header */}
                        <div className="flex items-center justify-between px-2">
                            <div>
                                <h1 className="text-2xl font-black text-white tracking-tight">Studio</h1>
                                <p className="text-xs text-zinc-400 font-medium">Create & Share Templates</p>
                            </div>
                            <button
                                onClick={() => setIsPublishOpen(true)}
                                className="bg-white text-zinc-950 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
                            >
                                <Upload size={16} /> Publish
                            </button>
                        </div>

                        {/* Tab Switcher - Scrollable on mobile */}
                        <div className="flex p-1 bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-x-auto scrollbar-hide">
                            {[
                                { id: 'design', icon: Sparkles, label: 'Design' },
                                { id: 'custom', icon: ImageIcon, label: 'Custom' },
                                { id: 'customize', icon: Sliders, label: 'Edit' },
                                { id: 'text', icon: Type, label: 'Text' },
                                { id: 'decor', icon: Sticker, label: 'Stickers' },
                                { id: 'motion', icon: Clapperboard, label: 'Motion' },
                                { id: 'preview', icon: Eye, label: 'Preview' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 min-w-[60px] flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl text-[10px] uppercase font-bold tracking-wide transition-all ${activeTab === tab.id ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    <tab.icon size={18} />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content Panels */}
                        <div className="glass-panel p-6 rounded-3xl min-h-[400px]">

                            {activeTab === 'design' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <h2 className="text-lg font-bold text-white mb-1">Choose a Style</h2>
                                        <p className="text-zinc-400 text-xs">Select a base frame to start with.</p>
                                    </div>
                                    <FrameSelector selectedFrameId={selectedFrame.id} onSelect={handlePresetSelect} />
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
                                        <h2 className="text-lg font-bold text-white mb-1">Fine Tune</h2>
                                        <p className="text-zinc-400 text-xs">Adjust colors, borders, and effects.</p>
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

                            {activeTab === 'decor' && (
                                <div className="space-y-4 animate-fade-in">
                                    <StickerControls
                                        stickers={stickers}
                                        selectedStickerId={selection}
                                        onAddSticker={handleAddSticker}
                                        onUpdateSticker={handleUpdateSticker}
                                        onDeleteSticker={handleDeleteSticker}
                                        onSelectSticker={(id) => {
                                            setSelection(id);
                                            setSelectedTextId(null);
                                        }}
                                    />
                                </div>
                            )}

                            {activeTab === 'motion' && (
                                <div className="space-y-4 animate-fade-in">
                                    <MotionControls
                                        currentEffect={motionEffect}
                                        setEffect={setMotionEffect}
                                        isRecording={false} // Loading state not lifted fully, maybe todo
                                        onExport={() => editorRef.current?.exportGif()}
                                        isPlaying={isPlaying}
                                        onTogglePlay={() => setIsPlaying(!isPlaying)}
                                    />
                                </div>
                            )}

                            {activeTab === 'preview' && (
                                <div className="space-y-4 animate-fade-in flex flex-col items-center justify-center h-full">
                                    <div>
                                        <h2 className="text-lg font-bold text-white mb-1 text-center">Live Preview</h2>
                                        <p className="text-zinc-400 text-xs text-center mb-6">See how it looks in a contact list.</p>
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

            <footer className="py-12 text-center text-zinc-600 text-sm border-t border-white/5 bg-zinc-950">
                <p>&copy; {new Date().getFullYear()} Ollabs. Designed & Built for the Community.</p>
            </footer>
        </div>
    );
};
