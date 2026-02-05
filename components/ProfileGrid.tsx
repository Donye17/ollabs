"use client";

import React from 'react';
import { Gallery } from './Gallery';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { FolderOpen } from 'lucide-react';

interface ProfileGridProps {
    creatorId: string;
    tab?: string;
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({ creatorId, tab = 'frames' }) => {
    const router = useRouter();

    // Future Collections Tab
    if (tab === 'collections') {
        return (
            <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
                <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-700/50">
                    <FolderOpen className="text-zinc-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Collections</h3>
                <p className="text-zinc-500 max-w-sm mx-auto">Organize your favorite frames into curated packs.</p>
                <div className="mt-6">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">COMING SOON</span>
                </div>
            </div>
        );
    }

    const isDrafts = tab === 'drafts';
    const likedBy = tab === 'liked' ? creatorId : undefined;

    return (
        <div className="space-y-6">
            <Gallery
                onSelectFrame={(frame, frameId) => {
                    localStorage.setItem('temp_frame', JSON.stringify(frame));
                    // Redirect to edit
                    router.push(`/?remix=${frameId}`);
                }}
                creatorId={likedBy ? undefined : creatorId}
                likedBy={likedBy}
                filter={(frame) => {
                    if (likedBy) return true;
                    return isDrafts ? !frame.is_public : !!frame.is_public;
                }}
            />
        </div>
    );
};
