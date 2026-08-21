import React from 'react';
import { Download, Upload, ZoomIn, ZoomOut, RefreshCcw, RotateCw, Loader2, Sparkles, Maximize, ImageDown } from 'lucide-react';

interface EditorToolbarProps {
    imageObject: HTMLImageElement | null;
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
    /**
     * Hand the PNG to the OS share sheet. Only passed where the browser can
     * actually do it, which in practice means a phone — iOS in-app browsers
     * ignore <a download>, so this is the only way to keep the picture there.
     */
    onSharePhoto?: () => void;
    isSharingPhoto?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    imageObject,
    scale,
    setScale,
    rotation,
    setRotation,
    onReset,
    onAutoFit,
    onImageSelect,
    onRemoveBackground,
    isRemovingBackground,
    onDownload,
    onSharePhoto,
    isSharingPhoto
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
                <div className="flex flex-col gap-3 w-full px-4">
                    {/* Where the share sheet exists it leads: it is the only path
                        that reliably saves the picture on a phone. */}
                    {onSharePhoto && (
                        <button onClick={onSharePhoto} disabled={isSharingPhoto} className="w-full flex items-center justify-center gap-2 bg-primary hover:brightness-105 text-ink py-3.5 px-6 rounded-xl transition-all font-bold shadow-lg shadow-primary/20 disabled:opacity-50">
                            {isSharingPhoto ? <Loader2 size={20} className="animate-spin" /> : <><ImageDown size={20} /> <span>Save or share photo</span></>}
                        </button>
                    )}
                    <button onClick={onDownload} className="w-full flex items-center justify-center gap-2 bg-cream hover:bg-paper2/80 backdrop-blur-md text-ink py-3.5 px-6 rounded-xl transition-all font-bold border border-ink/10 hover:border-ink/10 hover:-translate-y-0.5">
                        <Download size={20} /> <span>{onSharePhoto ? 'Download' : 'Save'}</span>
                    </button>
                </div>
            )}

            {/* Base image controls. Every control below used to be a
                selection ? sticker : image ternary; with stickers gone only the
                image branch is left, so the ternaries are collapsed rather than
                deleted. */}
            {imageObject && (
                <div className="w-full bg-cream p-5 rounded-2xl border border-ink/10 backdrop-blur-xl space-y-5 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center px-1">
                        <h4 className="text-xs font-bold font-heading text-muted uppercase tracking-widest">Adjust Base Image</h4>
                    </div>

                    {/* Magic Tools */}
                    {onRemoveBackground && (
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
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="flex-1 h-1.5 bg-paper2 rounded-lg appearance-none cursor-pointer accent-brand"
                            aria-label="Zoom level"
                        />
                        <ZoomIn size={16} className="text-muted" />
                    </div>

                    {/* Rotate Control */}
                    <div className="flex items-center gap-3">
                        <div className="relative group"><RotateCw size={16} className="text-muted group-hover:text-ink transition-colors" /></div>
                        <input type="range" min="-180" max="180" step="1"
                            value={rotation}
                            onChange={(e) => setRotation(parseInt(e.target.value))}
                            className="flex-1 h-1.5 bg-paper2 rounded-lg appearance-none cursor-pointer accent-brand"
                            aria-label="Rotation angle"
                        />
                        <span className="text-[10px] w-8 text-right font-mono text-muted">{rotation}&deg;</span>
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
