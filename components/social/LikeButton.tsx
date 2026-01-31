"use client";
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { authClient } from '../../lib/auth-client';

interface LikeButtonProps {
    frameId: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ frameId }) => {
    const { data: session } = authClient.useSession();
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/frames/likes?frameId=${frameId}&userId=${session?.user?.id || ''}`);
                const data = await res.json();
                setLikes(data.count);
                if (session?.user?.id) setIsLiked(data.userLiked);
            } catch (error) {
                console.error("Error fetching likes:", error);
            }
        };
        fetchData();
    }, [frameId, session?.user?.id]);

    const handleToggleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!session?.user?.id || loading) return;

        setLoading(true);
        // Optimistic update
        const previousIsLiked = isLiked;
        const previousLikes = likes;

        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);

        try {
            await fetch('/api/frames/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frameId, userId: session.user.id })
            });
        } catch (error) {
            // Revert
            setIsLiked(previousIsLiked);
            setLikes(previousLikes);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleLike}
            disabled={!session || loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${isLiked
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            <Heart size={16} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "scale-110" : ""} />
            <span className="text-sm font-medium">{likes}</span>
        </button>
    );
};
