"use client";

import { useState, useRef, useEffect } from "react";
import { AVATAR_ASSETS, AVATAR_LAYERS, AvatarConfig, AvatarPartType, DEFAULT_AVATAR_CONFIG } from "@/lib/avatar/config";
import { Button } from "@/components/ui/button";
import { Download, Check, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function AvatarBuilder() {
    const router = useRouter();
    const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
    const [activeTab, setActiveTab] = useState<AvatarPartType>('skin');
    const [isExporting, setIsExporting] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSelect = (type: AvatarPartType, id: string) => {
        setConfig(prev => ({ ...prev, [type]: id }));
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Set high resolution
            const size = 1000;
            canvas.width = size;
            canvas.height = size;

            // Sort layers
            const layers = Object.entries(AVATAR_LAYERS).sort(([, a], [, b]) => a - b);

            // Draw each layer
            const loadParams = layers.map(async ([type]) => {
                const partType = type as AvatarPartType;
                const assetId = config[partType];
                const asset = AVATAR_ASSETS[partType].find(a => a.id === assetId);

                if (!asset || !asset.src) return;

                return new Promise<void>((resolve, reject) => {
                    const img = new window.Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, size, size);
                        resolve();
                    };
                    img.onerror = reject;
                    img.src = asset.src;
                });
            });

            await Promise.all(loadParams);

            // Convert to Blob
            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error("Failed to create blob");

            // Convert to Data URL for passing to editor
            // In a real app, we might upload this to blob storage first, but for now passing via localStorage or URL is okay for small things?
            // Better: Store in IndexedDB or just use sessionStorage? 
            // Simplest: Data URL in sessionStorage
            const dataUrl = canvas.toDataURL('image/png');

            // WE NEED TO PASS THIS TO THE EDITOR.
            // The Editor expects a file upload or a selected image.
            // Let's use sessionStorage 'imported_avatar'
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('imported_avatar', dataUrl);
            }

            // Redirect
            router.push('/create?source=avatar_builder');

        } catch (error) {
            console.error("Export failed", error);
            alert("Failed to create avatar image");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-zinc-950 text-white overflow-hidden">
            {/* Preview Area (Left/Top) */}
            <div className="flex-1 flex items-center justify-center bg-zinc-900 relative p-8">
                <div
                    ref={containerRef}
                    className="relative w-96 h-96 bg-white/5 rounded-xl overflow-hidden shadow-2xl border border-white/5"
                >
                    {/* Rendering Layers for Display */}
                    {Object.entries(AVATAR_LAYERS).sort(([, a], [, b]) => a - b).map(([type]) => {
                        const partType = type as AvatarPartType;
                        const assetId = config[partType];
                        const asset = AVATAR_ASSETS[partType].find(a => a.id === assetId);

                        if (!asset || !asset.src) return null;

                        return (
                            <img
                                key={type}
                                src={asset.src}
                                alt={type}
                                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                                style={{ zIndex: asset.zIndex }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Controls Area (Right/Bottom) */}
            <div className="w-full md:w-[400px] flex flex-col bg-zinc-950 border-l border-white/5">

                {/* Tabs */}
                <div className="flex overflow-x-auto p-4 border-b border-white/5 gap-2 hide-scrollbar">
                    {Object.keys(AVATAR_LAYERS).map((type) => (
                        <button
                            key={type}
                            onClick={() => setActiveTab(type as AvatarPartType)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === type
                                    ? 'bg-white text-black'
                                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Asset Grid */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-4 content-start">
                    {AVATAR_ASSETS[activeTab].map((asset) => (
                        <button
                            key={asset.id}
                            onClick={() => handleSelect(activeTab, asset.id)}
                            className={`aspect-square rounded-xl bg-zinc-900 border-2 p-2 flex items-center justify-center transition-all ${config[activeTab] === asset.id
                                    ? 'border-blue-500 scale-105'
                                    : 'border-transparent hover:border-zinc-700'
                                }`}
                        >
                            {/* Mini Preview if possible, else text/icon */}
                            {asset.src ? (
                                <img src={asset.src} alt={asset.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-xs text-zinc-500">{asset.name}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/5 flex gap-4">
                    <Button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold flex items-center justify-center gap-2"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Use as PFP</>}
                    </Button>
                </div>
            </div>
        </div>
    );
}
