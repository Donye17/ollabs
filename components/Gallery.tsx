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
                <div className="text-center py-20 bg-slate-900/30 backdrop-blur-sm rounded-3xl border border-white/5 border-dashed hover:border-sidebar-primary/20 transition-all">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Loader2 className="text-slate-600" size={40} />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">No frames yet</h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">Be the first to publish a verified design to the community gallery.</p>
                    <a href="/" className="inline-flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1">
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
        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 group flex flex-col">
            <div className="aspect-square bg-slate-950/50 relative flex items-center justify-center p-6 group-hover:bg-slate-950/80 transition-colors">
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="w-full h-full object-contain drop-shadow-2xl"
                />

                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                    <button
                        onClick={onSelect}
                        className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl shadow-primary/20 hover:scale-105"
                    >
                        Remix
                    </button>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-heading font-bold text-lg text-white truncate group-hover:text-primary transition-colors">{frame.name}</h3>
                        <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-400">
                            <UserCircle2 size={16} className="text-slate-500" />
                            <span className="font-medium text-slate-300">{frame.creator_name}</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed">{frame.description}</p>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                    <LikeButton frameId={frame.id.toString()} />

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${showComments ? 'bg-primary/20 text-primary' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`}
                    >
                        <MessageSquare size={18} />
                        <span className="text-xs font-bold uppercase tracking-wide">Comments</span>
                    </button>
                </div>

                {showComments && (
                    <div className="mt-4 border-t border-slate-800 pt-4 animate-in slide-in-from-top-2 duration-300">
                        <CommentSection frameId={frame.id.toString()} />
                    </div>
                )}
            </div>
        </div >
    );
}
