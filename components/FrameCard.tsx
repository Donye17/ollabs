"use client";
import React, { useEffect, useState, useRef } from 'react';
import { FrameRendererFactory } from './renderer/FrameRendererFactory';
import { FrameConfig } from '@/lib/types';
import { UserCircle2, MessageSquare, Heart, Share2, Eye } from 'lucide-react';
import { LikeButton } from './social/LikeButton'; // We might replace this with inline logic or keep it
import { CommentSection } from './social/CommentSection';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

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
}

interface FrameCardProps {
    frame: PublishedFrame;
    onSelect: () => void;
}

export const FrameCard: React.FC<FrameCardProps> = ({ frame, onSelect }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(frame.liked_by_user);
    const [likeCount, setLikeCount] = useState(frame.likes_count || 0);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const router = useRouter();

    const session = authClient.useSession();

    // Render Preview
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const renderer = FrameRendererFactory.getRenderer(frame.config.type);
        const mockCtx = {
            ctx,
            width: canvas.width,
            height: canvas.height,
            centerX: canvas.width / 2,
            centerY: canvas.height / 2,
            imageObject: null,
            frame: frame.config,
            radius: (canvas.width / 2) - 20
        };
        renderer.drawFrame(mockCtx);
    }, [frame.config]);

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

    return (
        <div className="glass-panel rounded-3xl overflow-hidden hover:border-zinc-700 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 group flex flex-col h-full hover:bg-zinc-900/60">
            {/* Valid Click Area for Remixing */}
            <div className="aspect-square bg-zinc-950/30 relative flex items-center justify-center p-4 sm:p-8 group-hover:bg-zinc-950/50 transition-colors cursor-pointer overflow-hidden" onClick={onSelect}>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-full h-full">
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={300}
                        className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex justify-center pb-8 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none">
                    <span className="bg-zinc-50 text-zinc-950 font-bold py-3 px-8 rounded-full shadow-lg text-sm tracking-wide">
                        Remix This
                    </span>
                </div>
            </div>

            <div className="p-4 sm:p-6 flex-1 flex flex-col border-t border-white/5 bg-zinc-900/20">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-lg text-zinc-100 truncate group-hover:text-blue-400 transition-colors tracking-tight">{frame.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
                            <div className="flex items-center gap-2">
                                <UserCircle2 size={16} className="text-zinc-600" />
                                <span className="font-medium text-zinc-400">{frame.creator_name}</span>
                            </div>
                            {(frame.views_count !== undefined) && (
                                <div className="flex items-center gap-1.5" title={`${frame.views_count} views`}>
                                    <Eye size={14} className="text-zinc-600" />
                                    <span className="text-xs font-medium text-zinc-500">{frame.views_count}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-sm text-zinc-500 mb-6 line-clamp-2 leading-relaxed font-normal">{frame.description}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    {/* Like Button */}
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 active:scale-95 ${isLiked ? 'bg-pink-500/10 text-pink-500' : 'text-zinc-500 hover:bg-zinc-800 hover:text-pink-400'}`}
                    >
                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} className={isLiked ? "scale-110" : ""} />
                        <span className="text-sm font-semibold">{likeCount}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all active:scale-95 ${showComments ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
                    >
                        <MessageSquare size={20} strokeWidth={2} />
                        <span className="text-xs font-bold uppercase tracking-wide hidden sm:inline">Comments</span>
                        <span className="text-xs font-bold uppercase tracking-wide sm:hidden">{showComments ? 'Hide' : 'Chat'}</span>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(`${window.location.origin}/share/${frame.id}`);
                            alert('Link copied to clipboard!');
                        }}
                        className="p-3 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all ml-2 active:scale-95"
                        title="Share Frame"
                    >
                        <Share2 size={20} />
                    </button>
                </div>

                {showComments && (
                    <div className="mt-4 border-t border-zinc-800/50 pt-4 animate-in slide-in-from-top-2 duration-300">
                        <CommentSection frameId={frame.id.toString()} />
                    </div>
                )}
            </div>
        </div>
    );
};
