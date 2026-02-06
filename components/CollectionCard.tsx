
import React from 'react';
import Link from 'next/link';
import { FrameType, FrameConfig } from '@/lib/types';

interface CollectionCardProps {
    id: string;
    name: string;
    description?: string;
    item_count: number;
    preview_frames?: { id: string; image?: string; type: FrameType }[];
    is_public: boolean;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ id, name, description, item_count, preview_frames, is_public }) => {

    // Mini preview grid logic
    const renderPreview = () => {
        if (!preview_frames || preview_frames.length === 0) {
            return (
                <div className="w-full h-full bg-zinc-800/50 flex items-center justify-center">
                    <span className="text-zinc-600 text-sm">Empty</span>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 gap-0.5 w-full h-full">
                {preview_frames.slice(0, 4).map((frame, i) => (
                    <div key={i} className="relative aspect-square bg-zinc-800/80 overflow-hidden">
                        {frame.image ? (
                            <img src={frame.image} alt="" className="w-full h-full object-cover opacity-70" />
                        ) : (
                            // Fallback for no image, maybe show a colored block based on type? 
                            // For now just consistent gray
                            <div className="w-full h-full bg-zinc-700/30" />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Link href={`/collection/${id}`} className="group block h-full">
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-zinc-900 transiton-all duration-300 h-full flex flex-col">
                {/* Preview Area */}
                <div className="aspect-[4/3] w-full relative">
                    {renderPreview()}
                    {!is_public && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-xs font-medium text-zinc-300">
                            Private
                        </div>
                    )}
                </div>

                {/* Info Area */}
                <div className="p-4 flex flex-col grow">
                    <h3 className="font-bold text-zinc-100 mb-1 group-hover:text-blue-400 transition-colors truncate">
                        {name}
                    </h3>
                    {description && (
                        <p className="text-sm text-zinc-400 line-clamp-2 mb-3 grow">
                            {description}
                        </p>
                    )}
                    <div className="text-xs text-zinc-500 mt-auto pt-2 border-t border-white/5">
                        {item_count} items
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CollectionCard;
