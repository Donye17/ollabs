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
    const cutout = frame.cutoutScale ?? 0;

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
                // Default to a centered photo window so solid logos/badges work out of the box.
                cutoutScale: frame.cutoutScale ?? 0.62,
                name: frame.name === 'New Frame' ? 'Custom Frame' : frame.name,
            });
        } catch (err) {
            console.error('Frame upload failed', err);
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const setCutout = (value: number) => onChange({ ...frame, cutoutScale: value });

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-lg font-bold text-ink mb-1">Upload your own frame</h2>
                <p className="text-muted text-xs">Use your brand or cause design, a logo, badge, or frame. It wraps the photo, and you open a window in the middle for the picture.</p>
            </div>

            <div className="p-6 bg-cream border border-ink/10 rounded-2xl flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-paper2 flex items-center justify-center mb-1 overflow-hidden">
                    {isCustom ? (
                        <img src={frame.imageUrl} alt="Your frame" className="w-full h-full object-contain" />
                    ) : (
                        <ImageIcon className="text-muted" size={32} />
                    )}
                </div>

                <label className="cursor-pointer group relative">
                    <input
                        type="file"
                        accept="image/png,image/webp,image/gif,image/jpeg"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />
                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-blue-900/20 ${uploading ? 'bg-brand/60 text-ink/80 cursor-wait' : 'bg-brand hover:brightness-105 text-ink'}`}>
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        <span>{uploading ? 'Uploading…' : (isCustom ? 'Change frame' : 'Upload logo or frame')}</span>
                    </div>
                </label>

                {error && <p className="text-xs text-red-400">{error}</p>}
            </div>

            {isCustom && (
                <div className="p-5 bg-cream border border-ink/10 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-ink">Photo window</label>
                        <span className="text-xs text-muted">{Math.round(cutout * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={0.9}
                        step={0.01}
                        value={cutout}
                        onChange={(e) => setCutout(parseFloat(e.target.value))}
                        className="w-full accent-blue-500"
                    />
                    <p className="text-xs text-muted">Cut a circle out of the middle so the photo shows through. Drag left for a bigger frame, right for a bigger photo. Set to 0 if your PNG already has a transparent center.</p>
                </div>
            )}

            <div className="p-4 bg-brand/10 rounded-xl border border-brand/20 flex gap-3 items-start">
                <AlertCircle className="text-brand-deep shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-brand-deep">
                    <strong>Tip:</strong> A square logo or round badge works great, Ollabs keeps the outer design and opens a window in the center for each supporter's photo.
                </p>
            </div>
        </div>
    );
};
