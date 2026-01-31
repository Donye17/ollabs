"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { Editor } from './Editor';
import { FrameSelector } from './FrameSelector';
import { FrameCustomizer } from './FrameCustomizer';
import { ContactPreview } from './ContactPreview';
import { NavBar } from './NavBar';
import { AVAILABLE_FRAMES } from '@/lib/constants';
import { FrameConfig } from '@/lib/types';
import { AlertCircle } from 'lucide-react';

export const EditorPage: React.FC = () => {
    const [history, setHistory] = useState<FrameConfig[]>([AVAILABLE_FRAMES[2]]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);

    // Check for incoming frame from gallery
    useEffect(() => {
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
    }, []);

    const selectedFrame = history[historyIndex];

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

    // Updated to accept File object directly for DnD support
    const handleImageSelect = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        setImageSrc(null);
        setPreviewDataUrl(null);
    };

    // Add new state to history
    const addToHistory = (newFrame: FrameConfig) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newFrame);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
        }
    };

    // When a preset is selected, overwrite history path
    const handlePresetSelect = (frame: FrameConfig) => {
        addToHistory(frame);
    };

    // When customizing, update specific fields and add to history
    const handleFrameUpdate = (updatedFrame: FrameConfig) => {
        addToHistory(updatedFrame);
    };

    // Update the preview image data
    const handlePreviewUpdate = useCallback((dataUrl: string) => {
        setPreviewDataUrl(dataUrl);
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-blue-500/30">
            <NavBar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Left Column: Editor & Canvas */}
                    <div className="lg:col-span-7 flex flex-col items-center">
                        <Editor
                            imageSrc={imageSrc}
                            onImageSelect={handleImageSelect}
                            selectedFrame={selectedFrame}
                            onReset={handleReset}
                            onPreviewUpdate={handlePreviewUpdate}
                        />

                        {/* Info Box */}
                        <div className="mt-8 p-4 bg-blue-900/10 rounded-xl border border-blue-500/20 text-sm text-blue-200 max-w-md flex gap-3 items-start">
                            <AlertCircle className="shrink-0 text-blue-400 mt-0.5" size={18} />
                            <p>
                                <strong>Tip:</strong> Drag & Drop a photo to start. Pinch to zoom/pan.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Controls & Desktop Preview */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* 1. Desktop Preview (Only visible on large screens) */}
                        <div className="hidden lg:block">
                            <ContactPreview previewSrc={previewDataUrl} />
                        </div>

                        {/* 2. Controls */}
                        <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50 backdrop-blur-sm sticky top-24">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <span className="w-1 h-6 rounded-full bg-blue-500 block"></span>
                                    Frame Presets
                                </h2>
                                <p className="text-slate-400 text-sm">Select a base style then customize it below.</p>
                            </div>

                            <FrameSelector
                                selectedFrameId={selectedFrame.id}
                                onSelect={handlePresetSelect}
                            />

                            <div className="my-6 border-t border-slate-700/50"></div>

                            <FrameCustomizer
                                frame={selectedFrame}
                                onChange={handleFrameUpdate}
                                onUndo={handleUndo}
                                onRedo={handleRedo}
                                canUndo={historyIndex > 0}
                                canRedo={historyIndex < history.length - 1}
                            />

                            {!imageSrc && (
                                <div className="mt-6 p-4 bg-blue-500/10 rounded-xl text-center border border-blue-500/20">
                                    <p className="text-blue-200 text-sm">Upload a photo to see the live preview.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Only: Preview at the bottom */}
                    <div className="lg:hidden col-span-1 md:col-span-2 lg:col-span-12 w-full border-t border-slate-800 pt-12 pb-8 mt-8">
                        <h3 className="text-center text-slate-400 text-sm uppercase tracking-wider font-bold mb-6">Final Preview</h3>
                        <div className="flex justify-center">
                            <ContactPreview previewSrc={previewDataUrl} />
                        </div>
                    </div>

                </div>
            </main>

            <footer className="py-8 text-center text-slate-600 text-sm">
                <p>&copy; {new Date().getFullYear()} Ollabs. Designed & Built for the Community.</p>
            </footer>
        </div>
    );
};
