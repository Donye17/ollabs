import React, { useState } from 'react';
import { Download, Upload, ZoomIn, ZoomOut, RefreshCcw, RotateCw, User, Loader2, Sparkles, Maximize } from 'lucide-react';
import { StickerConfig, TextConfig } from '@/lib/types';
import { authClient } from '@/lib/auth-client';
import { upload } from '@vercel/blob/client';

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
    const { data: session } = authClient.useSession();
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onImageSelect(file);
    };

    const handleSetProfile = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setIsUpdatingProfile(true);
        try {
            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 0.8));
            if (!blob) throw new Error("Canvas conversion failed");

            const { url } = await upload(`profile-${Date.now()}.png`, blob, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });

            // @ts-ignore
            await authClient.updateUser({ image: url });
            alert("Profile picture updated!");
        } catch (e) {
            console.error("Upload failed", e);
            alert("Failed to update profile picture. Ensure you are logged in.");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto space-y-6">
            {/* Controls Bar: Upload, Set Profile, Download */}
            <div className="flex items-center gap-4 w-full px-4">
                <label className="flex-1">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                    <div className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white py-4 px-6 rounded-xl cursor-pointer transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 font-bold font-heading select-none hover:-translate-y-0.5">
                        <Upload size={20} /> <span>{imageObject ? 'Change Photo' : 'Upload Photo'}</span>
                    </div>
                </label>
            </div>

            {imageObject && (
                <div className="flex gap-3 justify-center w-full px-4">
                    {session && (
                        <button onClick={handleSetProfile}
                            disabled={isUpdatingProfile}
                            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-3.5 px-6 rounded-xl transition-all font-bold border border-transparent hover:border-purple-400 shadow-lg shadow-purple-900/20 disabled:opacity-50 hover:-translate-y-0.5">
                            {isUpdatingProfile ? <Loader2 size={20} className="animate-spin" /> : <User size={20} />}
                            <span>Set Profile</span>
                        </button>
                    )}
                    <button onClick={onDownload} className="flex-1 flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-white py-3.5 px-6 rounded-xl transition-all font-bold border border-white/5 hover:border-white/10 hover:-translate-y-0.5">
                        <Download size={20} /> <span>Save</span>
                    </button>
                </div>
            )}

            {/* Advanced Controls (Scale/Rotate for Selection or Image) */}
            {(imageObject || stickers.length > 0) && (
                <div className="w-full bg-slate-900/60 p-5 rounded-2xl border border-white/5 backdrop-blur-xl space-y-5 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center px-1">
                        <h4 className="text-xs font-bold font-heading text-slate-400 uppercase tracking-widest">{selection ? 'Adjust Decoration' : 'Adjust Base Image'}</h4>
                        {selection && <span className="text-[10px] text-primary font-bold font-mono bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Selected</span>}
                    </div>

                    {/* Magic Tools */}
                    {!selection && imageObject && onRemoveBackground && (
                        <button
                            onClick={onRemoveBackground}
                            disabled={isRemovingBackground}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 hover:border-violet-500/50 hover:from-violet-600/30 hover:to-fuchsia-600/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isRemovingBackground ? (
                                <Loader2 size={16} className="animate-spin text-violet-300" />
                            ) : (
                                <Sparkles size={16} className="text-violet-300 group-hover:text-white transition-colors" />
                            )}
                            <span className="text-xs font-bold text-violet-200 group-hover:text-white">Magic Remove Background</span>
                        </button>
                    )}

                    {/* Scale Control */}
                    <div className="flex items-center gap-3">
                        <ZoomOut size={16} className="text-slate-500" />
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
                            className={`flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer ${selection ? 'accent-primary' : 'accent-indigo-500'}`} />
                        <ZoomIn size={16} className="text-slate-500" />
                    </div>

                    {/* Rotate Control */}
                    <div className="flex items-center gap-3">
                        <div className="relative group"><RotateCw size={16} className="text-slate-500 group-hover:text-white transition-colors" /></div>
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
                            className={`flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer ${selection ? 'accent-primary' : 'accent-purple-500'}`} />
                        <span className="text-[10px] w-8 text-right font-mono text-slate-400">{selection ? (stickers.find(s => s.id === selection)?.rotation || 0) : rotation}°</span>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-white/5 justify-between">
                        <button onClick={onAutoFit} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 border border-transparent hover:border-white/5">
                            <Maximize size={14} /> <span>Fit to Frame</span>
                        </button>
                        <button onClick={onReset} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 border border-transparent hover:border-white/5">
                            <RefreshCcw size={14} /> <span>Reset All</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
