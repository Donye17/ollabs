"use client";

import React from 'react';
import { Gallery } from './Gallery';
import { useRouter } from 'next/navigation';
import { FrameConfig } from '@/lib/types';

import { authClient } from '@/lib/auth-client';
import { useState } from 'react';
import { Layout, FileText } from 'lucide-react';

interface ProfileGridProps {
    creatorId: string;
}


export const ProfileGrid: React.FC<ProfileGridProps> = ({ creatorId }) => {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const isOwner = session?.user?.id === creatorId;
    const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');

    const handleSelectFrame = (frame: FrameConfig, frameId: string) => {
        localStorage.setItem('temp_frame', JSON.stringify(frame));
        // If it's a draft, maybe we want to carry over the ID to edit it? 
        // For now, just load the config.
        router.push('/');
    };

    return (
        <div className="space-y-6">
            {isOwner && (
                <div className="flex justify-center">
                    <div className="bg-zinc-900/50 p-1 rounded-xl flex gap-1 border border-zinc-800">
                        <button
                            onClick={() => setActiveTab('published')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'published' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                        >
                            <Layout size={16} />
                            Published
                        </button>
                        <button
                            onClick={() => setActiveTab('drafts')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'drafts' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                        >
                            <FileText size={16} />
                            Drafts
                        </button>
                    </div>
                </div>
            )}

            <Gallery
                onSelectFrame={handleSelectFrame}
                creatorId={creatorId}
                filter={(frame) => activeTab === 'published' ? !!frame.is_public : !frame.is_public}
            />
        </div>
    );
};
