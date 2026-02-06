"use client";

import React from 'react';
import { Gallery } from './Gallery';
import CollectionCard from './CollectionCard';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { FolderOpen } from 'lucide-react';

interface ProfileGridProps {
    creatorId: string;
    tab?: string;
    initialFrames?: any[]; // Using any[] to avoid circular dep issues for now, or import PublishedFrame
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({ creatorId, tab = 'frames', initialFrames }) => {
    const router = useRouter();

    // Collections Tab Logic
    const [collections, setCollections] = React.useState<any[]>([]);
    const [loadingCollections, setLoadingCollections] = React.useState(false);

    React.useEffect(() => {
        if (tab === 'collections') {
            setLoadingCollections(true);
            fetch(`/api/collections?user_id=${creatorId}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setCollections(data);
                })
                .finally(() => setLoadingCollections(false));
        }
    }, [tab, creatorId]);

    if (tab === 'collections') {
        if (loadingCollections) {
            return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-[4/3] rounded-2xl bg-zinc-900/50 animate-pulse border border-white/5" />
                    ))}
                </div>
            );
        }

        if (collections.length === 0) {
            return (
                <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
                    <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-700/50">
                        <FolderOpen className="text-zinc-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No collections yet</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto">Create a collection to organize your favorite frames.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {collections.map(col => (
                    <CollectionCard
                        key={col.id}
                        id={col.id}
                        name={col.name}
                        description={col.description}
                        item_count={parseInt(col.item_count || '0')}
                        preview_frames={col.preview_frames}
                        is_public={col.is_public}
                    />
                ))}
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
                initialFrames={initialFrames}
                likedBy={likedBy}
                filter={(frame) => {
                    if (likedBy) return true;
                    return isDrafts ? !frame.is_public : !!frame.is_public;
                }}
            />
        </div>
    );
};
