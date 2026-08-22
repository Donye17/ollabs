"use client";
import React, { useState } from 'react';
import { FrameConfig, FrameType } from '@/lib/types';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import { useLocale } from '@/components/i18n/LocaleProvider';

interface CustomFramePanelProps {
    frame: FrameConfig;
    onChange: (updatedFrame: FrameConfig) => void;
}

export const CustomFramePanel: React.FC<CustomFramePanelProps> = ({ frame, onChange }) => {
    const { messages } = useLocale();
    const t = messages.create;
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
        <div className="space-y-5 animate-fade-in">
            <div>
                <h2 className="font-display text-lg font-bold text-ink mb-1">{t.yourFrame}</h2>
                <p className="text-muted text-xs">
                    {t.yourFrameHint}
                </p>
            </div>

            {/* Large drop zone — the old 80px circle made the upload feel like a
                side option. This is the product. */}
            <label className={`block cursor-pointer rounded-2xl border-2 border-dashed transition-colors ${isCustom ? 'border-ink/15 bg-cream' : 'border-brand/50 bg-brand/5 hover:bg-brand/10'} ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
                <input
                    type="file"
                    accept="image/png,image/webp,image/gif,image/jpeg"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                />
                <div className="flex flex-col items-center justify-center gap-3 px-4 py-8 text-center">
                    {isCustom ? (
                        <div className="w-24 h-24 rounded-full bg-paper overflow-hidden border border-ink/10 flex items-center justify-center">
                            <img src={frame.imageUrl} alt="" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-2xl bg-brand/20 flex items-center justify-center">
                            {uploading ? <Loader2 className="animate-spin text-brand-deep" size={28} /> : <Upload className="text-brand-deep" size={28} />}
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-ink text-sm">
                            {uploading ? t.uploading : (isCustom ? t.changeFrame : t.uploadFrame)}
                        </p>
                        <p className="text-[11px] text-muted mt-1">{t.pngTip}</p>
                    </div>
                </div>
            </label>

            {error && (
                <p role="alert" className="text-sm text-coral bg-coral/10 border border-coral/25 rounded-xl px-3 py-2.5">
                    {error}
                </p>
            )}

            {isCustom && (
                <div className="p-4 bg-cream border border-ink/10 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-ink">{t.photoWindow}</label>
                        <span className="text-xs text-muted">{Math.round(cutout * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={0.9}
                        step={0.01}
                        value={cutout}
                        onChange={(e) => setCutout(parseFloat(e.target.value))}
                        aria-label={t.photoWindow}
                        className="w-full h-8 accent-brand"
                    />
                    <p className="text-xs text-muted">
                        {t.photoWindowHint}
                    </p>
                </div>
            )}

            {!isCustom && (
                <div className="p-3 bg-brand/10 rounded-xl border border-brand/20 flex gap-3 items-start">
                    <AlertCircle className="text-brand-deep shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-brand-deep">
                        {t.tipLogo}
                    </p>
                </div>
            )}
        </div>
    );
};
