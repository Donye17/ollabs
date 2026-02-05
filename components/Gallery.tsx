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
    filter?: (frame: PublishedFrame) => boolean;
}

import { FrameCard, PublishedFrame } from './FrameCard';

export const Gallery: React.FC<GalleryProps> = ({ onSelectFrame, creatorId, filter }) => {
    const [frames, setFrames] = useState<PublishedFrame[]>([]);
    const [trendingFrames, setTrendingFrames] = useState<PublishedFrame[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const tags = ["Cyberpunk", "Retro", "Minimal", "Nature", "Neon", "Abstract"];

    // Fetch Trending (Only on main gallery)
    useEffect(() => {
        if (!creatorId) {
            const fetchTrending = async () => {
                try {
                    const response = await fetch('/api/frames?sort=trending&limit=4');
                    if (response.ok) {
                        const result = await response.json();
                        const parsed = result.map((row: any) => ({
                            ...row,
                            config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
                        }));
                        setTrendingFrames(parsed);
                    }
                } catch (e) {
                    console.error("Failed to fetch trending", e);
                }
            };
            fetchTrending();
        }
    }, [creatorId]);

    useEffect(() => {
        const fetchFrames = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.set('limit', '50'); // Increased limit for search
                if (creatorId) params.set('creator_id', creatorId);
                if (debouncedSearch) params.set('search', debouncedSearch);
                if (selectedTag) params.set('tag', selectedTag);

                const response = await fetch(`/api/frames?${params.toString()}`);
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
    }, [creatorId, debouncedSearch, selectedTag]);



    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header Section */}
            {!creatorId && (
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-50">Community Gallery</h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Discover and remix designs from creators worldwide.</p>
                </div>
            )}

            {/* Trending Section */}
            {!creatorId && !searchQuery && !selectedTag && trendingFrames.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Trending Now</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trendingFrames.map((frame, i) => (
                            <div className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }} key={`trending-${frame.id}`}>
                                <FrameCard
                                    frame={frame}
                                    onSelect={() => onSelectFrame(frame.config, frame.id.toString())}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />
                </div>
            )}

            {/* Search & Filter Controls */}
            {!creatorId && (
                <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
                    {/* Search Bar */}
                    <div className="relative w-full max-w-lg">
                        <input
                            type="text"
                            placeholder="Search frames..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-700 text-zinc-100 px-5 py-3 pl-12 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                        />
                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                    </div>

                    {/* Filter Chips */}
                    <div className="flex flex-wrap justify-center gap-2">
                        <button
                            onClick={() => setSelectedTag(null)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!selectedTag ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                        >
                            All
                        </button>
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${tag === selectedTag ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                </div>
            ) : (
                <div className="space-y-6">
                    {!creatorId && (
                        <h3 className="text-xl font-bold text-zinc-400">All Frames</h3>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {frames
                            .filter(f => filter ? filter(f) : true)
                            .map((frame, i) => (
                                <div className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }} key={frame.id}>
                                    <FrameCard
                                        frame={frame}
                                        onSelect={() => onSelectFrame(frame.config, frame.id.toString())}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {frames.length === 0 && !loading && (
                <div className="text-center py-20 bg-zinc-900/30 backdrop-blur-sm rounded-3xl border border-white/5 border-dashed hover:border-blue-500/20 transition-all">
                    <div className="w-20 h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Layout className="text-zinc-600" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-50 mb-2">No frames found</h3>
                    <p className="text-zinc-400 mb-8 max-w-sm mx-auto leading-relaxed">Try adjusting your search or filters.</p>
                    <button onClick={() => { setSearchQuery(''); setSelectedTag(null); }} className="text-blue-400 hover:text-blue-300 underline">
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
};
