"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { FrameRendererFactory } from './renderer/FrameRendererFactory';
import { FrameConfig, FrameType } from '@/lib/types';
import { Loader2, UserCircle2, Copy, MessageSquare, Heart } from 'lucide-react';
import { CANVAS_SIZE } from '@/lib/constants';
import { LikeButton } from './social/LikeButton';
import { CommentSection } from './social/CommentSection';

interface GalleryProps {
    onSelectFrame: (frame: FrameConfig, frameId: string) => void;
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
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold tracking-tight text-zinc-50">Community Gallery</h2>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Discover and remix designs from creators worldwide.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {frames.map((frame, i) => (
                    <div className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }} key={frame.id}>
                        <GalleryCard
                            frame={frame}
                            onSelect={() => onSelectFrame(frame.config, frame.id.toString())}
                        />
                    </div>
                ))}
            </div>

            {frames.length === 0 && (
                <div className="text-center py-20 bg-zinc-900/30 backdrop-blur-sm rounded-3xl border border-white/5 border-dashed hover:border-blue-500/20 transition-all">
                    <div className="w-20 h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Loader2 className="text-zinc-600" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-50 mb-2">No frames yet</h3>
                    <p className="text-zinc-400 mb-8 max-w-sm mx-auto leading-relaxed">Be the first to publish a verified design to the community gallery.</p>
                    <Link href="/create" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 text-white font-bold py-3 px-8 rounded-full transition-all">
                        Create Masterpiece
                    </Link>
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
        <div className="glass-panel rounded-3xl overflow-hidden hover:border-zinc-700 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 group flex flex-col h-full hover:bg-zinc-900/60">
            <div className="aspect-square bg-zinc-950/30 relative flex items-center justify-center p-4 sm:p-8 group-hover:bg-zinc-950/50 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex justify-center pb-8 bg-gradient-to-t from-zinc-950/80 to-transparent">
                    <button
                        onClick={onSelect}
                        className="bg-zinc-50 hover:bg-white text-zinc-950 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm tracking-wide"
                    >
                        Remix This
                    </button>
                </div>
            </div>

            <div className="p-4 sm:p-6 flex-1 flex flex-col border-t border-white/5 bg-zinc-900/20">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-lg text-zinc-100 truncate group-hover:text-blue-400 transition-colors tracking-tight">{frame.name}</h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
                            <UserCircle2 size={16} className="text-zinc-600" />
                            <span className="font-medium text-zinc-400">{frame.creator_name}</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-zinc-500 mb-6 line-clamp-2 leading-relaxed font-normal">{frame.description}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <LikeButton frameId={frame.id.toString()} />

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${showComments ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
                    >
                        <MessageSquare size={18} strokeWidth={2} />
                        <span className="text-xs font-bold uppercase tracking-wide">Comments</span>
                    </button>
                </div>

                {showComments && (
                    <div className="mt-4 border-t border-zinc-800/50 pt-4 animate-in slide-in-from-top-2 duration-300">
                        <CommentSection frameId={frame.id.toString()} />
                    </div>
                )}
            </div>
        </div >
    );
}
