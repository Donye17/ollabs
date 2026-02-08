"use client";
import React from 'react';
import { X, User, Heart, Share2, Sparkles } from 'lucide-react';
import { PublishedFrame } from './FrameCard';
import { CommentSection } from './social/CommentSection';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

interface FrameDetailsModalProps {
    frame: PublishedFrame;
    isOpen: boolean;
    onClose: () => void;
    // Pass in current like state to sync
    isLiked: boolean;
    likeCount: number;
    onLike: (e: React.MouseEvent) => void;
}

export const FrameDetailsModal: React.FC<FrameDetailsModalProps> = ({
    frame,
    isOpen,
    onClose,
    isLiked,
    likeCount,
    onLike
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="relative w-full max-w-5xl h-[85vh] md:h-[600px] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col md:flex-row outline-none"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Visual Side (Left) - 50% width on desktop */}
                <div className="md:w-1/2 lg:w-3/5 bg-zinc-900/50 flex items-center justify-center p-8 relative border-r border-zinc-800/50 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none" />

                    <div className="relative w-full h-full max-h-[80%] flex justify-center items-center">
                        {frame.preview_url ? (
                            <img
                                src={frame.preview_url}
                                alt={frame.name}
                                className="w-full h-full object-contain drop-shadow-2xl z-10"
                            />
                        ) : (
                            <img
                                src={`/api/og/frame?id=${frame.id}`}
                                alt={frame.name}
                                className="w-full h-full object-contain drop-shadow-2xl z-10"
                            />
                        )}
                    </div>
                </div>

                {/* Info Side (Right) - 50% width on desktop with scrollable content */}
                <div className="md:w-1/2 lg:w-2/5 flex flex-col h-full bg-zinc-950">
                    {/* Header */}
                    <div className="p-6 border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-xl z-20 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white">{frame.name}</h2>
                            <div className="flex items-center gap-2 mt-2 text-zinc-400">
                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                                    <User size={14} />
                                </div>
                                <span className="text-sm font-medium text-zinc-300">{frame.creator_name}</span>
                                {frame.creator_verified && <VerifiedBadge className="w-3 h-3 text-blue-400" />}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                        <div className="p-6 space-y-6">
                            {/* Description */}
                            {frame.description && (
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    {frame.description}
                                </p>
                            )}

                            {/* Tags */}
                            {frame.tags && frame.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {frame.tags.map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-zinc-900 rounded-md text-xs font-medium text-zinc-500 border border-zinc-800/50">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Actions Row */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onLike}
                                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium transition-all ${isLiked ? 'text-pink-400 border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20' : 'border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white text-zinc-400'}`}
                                >
                                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                                    {likeCount}
                                </button>
                                <button
                                    className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium transition-all border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white text-zinc-400"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/share/${frame.id}`);
                                        alert('Link copied!');
                                    }}
                                >
                                    <Share2 size={16} />
                                    Share
                                </button>
                            </div>

                            <div className="border-t border-zinc-900 my-6" />

                            {/* Comments Section */}
                            <CommentSection frameId={frame.id} />
                        </div>
                    </div>

                    {/* Sticky Footer CTA */}
                    <div className="p-4 border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-xl z-20">
                        <button
                            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            onClick={() => window.location.href = `/create?id=${frame.id}`}
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Remix This Design
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
