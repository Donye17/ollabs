"use client";
import React, { useState } from 'react';
import { FrameConfig, FrameType } from '@/lib/types';
import { Upload, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { upload } from '@vercel/blob/client';

interface CustomFramePanelProps {
    frame: FrameConfig;
    onChange: (updatedFrame: FrameConfig) => void;
}

export const CustomFramePanel: React.FC<CustomFramePanelProps> = ({ frame, onChange }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isCustom = frame.type === FrameType.CUSTOM_IMAGE && !!frame.imageUrl;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);
        setUploading(true);
        try {
            const { url } = await upload(`frame-${Date.now()}-${file.name}`, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });
            onChange({
                ...frame,
                type: FrameType.CUSTOM_IMAGE,
                imageUrl: url,
                name: frame.name === 'New Frame' ? 'Custom Frame' : frame.name,
            });
        } catch (err) {
            console.error('Frame upload failed', err);
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-lg font-bold text-white mb-1">Upload your own frame</h2>
                <p className="text-zinc-400 text-xs">Use your brand or cause design. Upload a square PNG with a transparent center — it overlays the whole photo.</p>
            </div>

            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-1 overflow-hidden">
                    {isCustom ? (
                        <img src={frame.imageUrl} alt="Your frame" className="w-full h-full object-contain" />
                    ) : (
                        <ImageIcon className="text-zinc-600" size={32} />
                    )}
                </div>

                <label className="cursor-pointer group relative">
                    <input
                        type="file"
                        accept="image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />
                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-blue-900/20 ${uploading ? 'bg-blue-600/60 text-white/80 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        <span>{uploading ? 'Uploading…' : (isCustom ? 'Change frame' : 'Upload frame PNG')}</span>
                    </div>
                </label>

                {error && <p className="text-xs text-red-400">{error}</p>}
            </div>

            <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 flex gap-3 items-start">
                <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-blue-200">
                    <strong>Tip:</strong> Design a 1024×1024 PNG with a transparent circle in the middle where the photo shows through. Put your logo, colors, or slogan around the edge.
                </p>
            </div>
        </div>
    );
};
