import React from 'react';
import { FrameConfig, FrameType } from '@/lib/types';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface CustomFramePanelProps {
    frame: FrameConfig;
    onChange: (updatedFrame: FrameConfig) => void;
}

export const CustomFramePanel: React.FC<CustomFramePanelProps> = ({ frame, onChange }) => {

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const imageUrl = ev.target?.result as string;
                // Switch to CUSTOM_IMAGE type when image is uploaded
                onChange({
                    ...frame,
                    type: FrameType.CUSTOM_IMAGE,
                    imageUrl: imageUrl,
                    name: 'Custom Frame'
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-lg font-bold text-white mb-1">Custom Texture</h2>
                <p className="text-zinc-400 text-xs">Upload your own image to use as a frame pattern.</p>
            </div>

            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                    {frame.imageUrl && frame.type === FrameType.CUSTOM_IMAGE ? (
                        <img src={frame.imageUrl} alt="Texture" className="w-full h-full object-cover rounded-full opacity-80" />
                    ) : (
                        <ImageIcon className="text-zinc-600" size={32} />
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-white">Upload Texture</h3>
                    <p className="text-xs text-zinc-500 max-w-[200px]">
                        Upload a pattern, flag, or texture. It will be applied to the frame ring.
                    </p>
                </div>

                <label className="cursor-pointer group relative">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-xs transition-colors shadow-lg shadow-blue-900/20">
                        <Upload size={14} />
                        <span>{frame.imageUrl ? 'Change Image' : 'Select Image'}</span>
                    </div>
                </label>
            </div>

            <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 flex gap-3 items-start">
                <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-blue-200">
                    <strong>Tip:</strong> Seamless patterns or high-resolution textures work best.
                </p>
            </div>
        </div>
    );
};
