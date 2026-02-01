"use client";

import React from 'react';
import { Gallery } from './Gallery';
import { useRouter } from 'next/navigation';
import { FrameConfig } from '@/lib/types';

interface ProfileGridProps {
    creatorId: string;
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({ creatorId }) => {
    const router = useRouter();

    const handleSelectFrame = (frame: FrameConfig) => {
        // Store in localStorage purely for client-side persistence across navigation
        localStorage.setItem('temp_frame', JSON.stringify(frame));
        router.push('/');
    };

    return <Gallery onSelectFrame={handleSelectFrame} creatorId={creatorId} />;
};
