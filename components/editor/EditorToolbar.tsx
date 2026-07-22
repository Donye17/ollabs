import React from 'react';
import { Download, Upload, ZoomIn, ZoomOut, RefreshCcw, RotateCw, User, Loader2, Sparkles, Maximize } from 'lucide-react';
import { StickerConfig, TextConfig } from '@/lib/types';

interface EditorToolbarProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    imageObject: HTMLImageElement | null;
    selection: string | null;
    stickers: StickerConfig[];
    onStickersChange: (stickers: StickerConfig[]) => void;
    scale: number;
    setScale: (scale: number) => void;
    rotation: number;
    setRotation: (rotation: number) => void;
    onReset: () => void;
    onAutoFit: () => void;
    onImageSelect: (file: File) => void;
    onRemoveBackground?: () => void;
    isRemovingBackground?: boolean;
    // Download handler
    onDownload: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    canvasRef,
    imageObject,
    selection,
    stickers,
    onStickersChange,
    scale,
    setScale,
    rotation,
    setRotation,
    onReset,
    onAutoFit,
    onImageSelect,
    onRemoveBackground,
    isRemovingBackground,
    onDownload
}) => {
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onImageSelect(file);
    };

    return (
        <div className="w-full max-w-lg mx-auto space-y-6">
            {/* Controls Bar: Upload, Set Profile, Download */}
            <div className="flex items-center gap-4 w-full px-4">
                <label className="flex-1">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                    <div className="flex items-center justify-center gap-2 bg-primary hover:brightness-105 text-ink py-4 px-6 rounded-xl cursor-pointer transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 font-bold font-heading select-none hover:-translate-y-0.5">
                        <Upload size={20} /> <span>{imageObject ? 'Change photo' : 'Upload photo'}</span>
                    </div>
                </label>
            </div>

            {imageObject && (
                <div className="flex gap-3 justify-center w-full px-4">
                    <button onClick={onDownload} className="flex-1 flex items-center justify-center gap-2 bg-cream hover:bg-paper2/80 backdrop-blur-md text-ink py-3.5 px-6 rounded-xl transition-all font-bold border border-ink/10 hover:border-ink/10 hover:-translate-y-0.5">
                        <Download size={20} /> <span>Save</span>
                    </button>
                </div>
            )}

            {/* Advanced Controls (Scale/Rotate for Selection or Image) */}
            {(imageObject || stickers.length > 0) && (
                <div className="w-full bg-cream p-5 rounded-2xl border border-ink/10 backdrop-blur-xl space-y-5 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center px-1">
                        <h4 className="text-xs font-bold font-heading text-muted uppercase tracking-widest">{selection ? 'Adjust Decoration' : 'Adjust Base Image'}</h4>
                        {selection && <span className="text-[10px] text-primary font-bold font-mono bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Selected</span>}
                    </div>

                    {/* Magic Tools */}
                    {!selection && imageObject && onRemoveBackground && (
                        <button
                            onClick={onRemoveBackground}
                            disabled={isRemovingBackground}
                            className="w-full py-3 rounded-xl bg-brand/10 border border-brand/30 hover:bg-brand/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isRemovingBackground ? (
                                <Loader2 size={16} className="animate-spin text-brand-deep" />
                            ) : (
                                <Sparkles size={16} className="text-brand-deep transition-colors" />
                            )}
                            <span className="text-xs font-bold text-brand-deep">Magic remove background</span>
                        </button>
                    )}

                    {/* Scale Control */}
                    <div className="flex items-center gap-3">
                        <ZoomOut size={16} className="text-muted" />
                        <input type="range" min="0.1" max="3" step="0.1"
                            value={selection ? (stickers.find(s => s.id === selection)?.scale || 1) : scale}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (selection) {
                                    onStickersChange(stickers.map(s => s.id === selection ? { ...s, scale: val } : s));
                                } else {
                                    setScale(val);
                                }
                            }}
                            className={`flex-1 h-1.5 bg-paper2 rounded-lg appearance-none cursor-pointer ${selection ? 'accent-primary' : 'accent-brand'}`}
                            aria-label="Zoom level"
                        />
                        <ZoomIn size={16} className="text-muted" />
                    </div>

                    {/* Rotate Control */}
                    <div className="flex items-center gap-3">
                        <div className="relative group"><RotateCw size={16} className="text-muted group-hover:text-ink transition-colors" /></div>
                        <input type="range" min="-180" max="180" step="1"
                            value={selection ? (stickers.find(s => s.id === selection)?.rotation || 0) : rotation}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (selection) {
                                    onStickersChange(stickers.map(s => s.id === selection ? { ...s, rotation: val } : s));
                                } else {
                                    setRotation(val);
                                }
                            }}
                            className={`flex-1 h-1.5 bg-paper2 rounded-lg appearance-none cursor-pointer ${selection ? 'accent-primary' : 'accent-brand'}`}
                            aria-label="Rotation angle"
                        />
                        <span className="text-[10px] w-8 text-right font-mono text-muted">{selection ? (stickers.find(s => s.id === selection)?.rotation || 0) : rotation}°</span>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-ink/10 justify-between">
                        <button onClick={onAutoFit} className="flex items-center gap-2 px-3 py-2 hover:bg-cream rounded-lg text-xs font-bold text-muted hover:text-ink transition-colors bg-cream border border-transparent hover:border-ink/10">
                            <Maximize size={14} /> <span>Fit to Frame</span>
                        </button>
                        <button onClick={onReset} className="flex items-center gap-2 px-3 py-2 hover:bg-cream rounded-lg text-xs font-bold text-muted hover:text-ink transition-colors bg-cream border border-transparent hover:border-ink/10">
                            <RefreshCcw size={14} /> <span>Reset All</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
