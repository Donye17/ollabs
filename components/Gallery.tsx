"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { FrameRendererFactory } from './renderer/FrameRendererFactory';
import { FrameConfig, FrameType } from '@/lib/types';
import { Loader2, UserCircle2, Copy, MessageSquare, Heart, Layout } from 'lucide-react';
import { CANVAS_SIZE } from '@/lib/constants';
import { LikeButton } from './social/LikeButton';
import { CommentSection } from './social/CommentSection';

interface GalleryProps {
    onSelectFrame: (frame: FrameConfig, frameId: string) => void;
    creatorId?: string;
}

import { FrameCard, PublishedFrame } from './FrameCard';

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
    }, [creatorId]);

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
                        <FrameCard
                            frame={frame}
                            onSelect={() => onSelectFrame(frame.config, frame.id.toString())}
                        />
                    </div>
                ))}
            </div>

            {frames.length === 0 && (
                <div className="text-center py-20 bg-zinc-900/30 backdrop-blur-sm rounded-3xl border border-white/5 border-dashed hover:border-blue-500/20 transition-all">
                    <div className="w-20 h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Layout className="text-zinc-600" size={40} />
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
