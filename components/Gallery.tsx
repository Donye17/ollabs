"use client";
import React, { useEffect, useState } from 'react';

import { FrameRendererFactory } from './renderer/FrameRendererFactory';
import { FrameConfig, FrameType } from '@/lib/types';
import { Loader2, UserCircle2, Copy, MessageSquare, Heart } from 'lucide-react';
import { CANVAS_SIZE } from '@/lib/constants';
import { LikeButton } from './social/LikeButton';
import { CommentSection } from './social/CommentSection';

interface GalleryProps {
    onSelectFrame: (frame: FrameConfig) => void;
    creatorId?: string;
}

interface PublishedFrame {
    id: number;
    name: string;
    description: string;
    config: FrameConfig;
    creator_name: string; // We'll need to join this in the query
    created_at: string;
}

export const Gallery: React.FC<GalleryProps> = ({ onSelectFrame, creatorId }) => {
    const [frames, setFrames] = useState<PublishedFrame[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFrames = async () => {
            try {
                // Fetch frames (optionally filtered by creator)
                const url = creatorId
                    ? `/api/frames?limit=20&creator_id=${creatorId}`
                    : '/api/frames?limit=20';

                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch frames');

                const result = await response.json();

                // Parse the config JSON for each row
                const parsedFrames = result.map((row: any) => ({
                    ...row,
                    config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
                }));

                setFrames(parsedFrames);
            } catch (err) {
                console.error("Failed to fetch gallery", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFrames();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Community Gallery</h2>
                <p className="text-slate-400">Discover designs from other creators</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {frames.map((frame) => (
                    <GalleryCard
                        key={frame.id}
                        frame={frame}
                        onSelect={() => onSelectFrame(frame.config)}
                    />
                ))}
            </div>

            {frames.length === 0 && (
                <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="text-slate-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No frames yet</h3>
                    <p className="text-slate-400 mb-6 max-w-sm mx-auto">Be the first to publish a verified design to the community gallery.</p>
                    <a href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded-full transition-all">
                        Create Masterpiece
                    </a>
                </div>
            )}
        </div>
    );
};

const GalleryCard: React.FC<{ frame: PublishedFrame, onSelect: () => void }> = ({ frame, onSelect }) => {
    // Generate a mini preview using the existing renderer logic
    // We can reuse the same canvas rendering logic or just create a small canvas
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render Frame ONLY (No image)
        const renderer = FrameRendererFactory.getRenderer(frame.config.type);

        // Mock context for renderer
        const mockCtx = {
            ctx,
            width: canvas.width,
            height: canvas.height,
            centerX: canvas.width / 2,
            centerY: canvas.height / 2,
            imageObject: null, // No user image in gallery preview,
            frame: frame.config,
            radius: (canvas.width / 2) - 20 // Padding
        };

        renderer.drawFrame(mockCtx);

    }, [frame.config]);

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/10 group flex flex-col">
            <div className="aspect-square bg-slate-950 relative flex items-center justify-center p-4">
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="w-full h-full object-contain"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button
                        onClick={onSelect}
                        className="bg-white text-black font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                        Use this Frame
                    </button>
                </div>
            </div>

            <div className="p-4 bg-slate-900 flex-1">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-white truncate">{frame.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                            <UserCircle2 size={16} />
                            <span>{frame.creator_name}</span>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{frame.description}</p>

                <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-auto">
                    <LikeButton frameId={frame.id.toString()} />

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${showComments ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <MessageSquare size={16} />
                        <span className="text-sm font-medium">Comments</span>
                    </button>
                </div>

                {showComments && (
                    <div className="mt-4 border-t border-slate-800 pt-4 animate-in slide-in-from-top-2 duration-300">
                        <CommentSection frameId={frame.id.toString()} />
                    </div>
                )}
            </div>
        </div>
    );
}
