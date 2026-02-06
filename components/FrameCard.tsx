"use client";
import React, { useEffect, useState, useRef } from 'react';
import { FrameRendererFactory } from './renderer/FrameRendererFactory';
import { FrameConfig } from '@/lib/types';
import { UserCircle2, MessageSquare, Heart, Share2, Eye, Folder } from 'lucide-react';
import { LikeButton } from './social/LikeButton'; // We might replace this with inline logic or keep it
import { CommentSection } from './social/CommentSection';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { AddToCollectionModal } from './AddToCollectionModal';

export interface PublishedFrame {
    id: string;
    name: string;
    description: string;
    config: FrameConfig;
    creator_name: string;
    created_at: string;
    likes_count: number;
    views_count?: number;
    liked_by_user: boolean;
    is_public?: boolean;
    preview_url?: string;
    media_type?: string;
    creator_verified?: boolean;
}

interface FrameCardProps {
    frame: PublishedFrame;
    onSelect: () => void;
}

import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

export const FrameCard: React.FC<FrameCardProps> = ({ frame, onSelect }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(frame.liked_by_user);
    const [likeCount, setLikeCount] = useState(frame.likes_count || 0);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const router = useRouter();

    const session = authClient.useSession();

    // Canvas rendering logic removed in favor of Server-Side Image

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!session.data) {
            // Redirect to login or open modal? For now, nice alert or nothing.
            alert("Please sign in to like frames!");
            return;
        }

        if (isLikeLoading) return;

        // Optimistic UI
        const previousLiked = isLiked;
        const previousCount = likeCount;

        setIsLiked(!previousLiked);
        setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);
        setIsLikeLoading(true);

        try {
            const res = await fetch(`/api/frames/${frame.id}/like`, { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setIsLiked(data.liked);
                setLikeCount(data.likes_count);
            } else {
                // Revert
                setIsLiked(previousLiked);
                setLikeCount(previousCount);
            }
        } catch (error) {
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
        } finally {
            setIsLikeLoading(false);
        }
    };

    const [showCollectionModal, setShowCollectionModal] = useState(false);

    return (
        <>
            <div className="glass-panel rounded-2xl overflow-hidden hover:border-zinc-600 hover:shadow-xl transition-all duration-300 group flex flex-col h-full bg-zinc-900/40">
                {/* Image Container with Overlay Actions */}
                <div className="aspect-square bg-zinc-950/50 relative flex items-center justify-center p-4 cursor-pointer overflow-hidden" onClick={onSelect}>
                    {/* Canvas Preview */}
                    <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out">
                        {/* Primary Server-Side Image */}
                        {frame.preview_url ? (
                            <img
                                src={frame.preview_url}
                                alt={frame.name}
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
                        ) : (
                            <img
                                src={`/api/og/frame?id=${frame.id}`}
                                alt={frame.name}
                                width={300}
                                height={300}
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
                        )}
                    </div>

                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]" />

                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 p-4">
                        <button className="w-full py-2.5 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg">
                            Remix This
                        </button>
                        <div className="flex gap-2 w-full">
                            <button
                                onClick={handleLike}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full font-medium text-xs transition-colors backdrop-blur-md ${isLiked ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'}`}
                            >
                                <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                                {likeCount}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCollectionModal(true);
                                }}
                                className="w-10 flex items-center justify-center py-2.5 rounded-full bg-white/10 text-white border border-white/10 hover:bg-white/20 font-medium text-xs backdrop-blur-md"
                                title="Save to Collection"
                            >
                                <Folder size={14} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(`${window.location.origin}/share/${frame.id}`);
                                    alert('Link copied!');
                                }}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-white/10 text-white border border-white/10 hover:bg-white/20 font-medium text-xs backdrop-blur-md"
                            >
                                <Share2 size={14} />
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Compact Footer */}
                <div className="p-3 border-t border-white/5 bg-zinc-900/40">
                    <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                            <h3 className="font-bold text-sm text-zinc-200 truncate group-hover:text-blue-400 transition-colors">{frame.name}</h3>
                            <p className="text-xs text-zinc-500 truncate flex items-center gap-1">
                                {frame.creator_name}
                                {frame.creator_verified && <VerifiedBadge className="text-blue-400 w-3 h-3" />}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <AddToCollectionModal
                frameId={frame.id}
                isOpen={showCollectionModal}
                onClose={() => setShowCollectionModal(false)}
            />
        </>
    );
};
