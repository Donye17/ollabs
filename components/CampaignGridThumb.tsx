"use client";

import React, { useState } from 'react';
import { FramePreview } from '@/components/FramePreview';
import type { FrameConfig } from '@/lib/types';

function pickSupporterPhoto(photos: string[]): string | null {
    if (photos.length === 0) return null;
    return photos[Math.floor(Math.random() * photos.length)];
}

/**
 * Explore / podium thumbnail. Supporter saves upload a small framed JPEG (face +
 * overlay baked in). Everything else draws live from frame_config — never
 * preview_url, which often captured the default cyan ring before custom art loaded.
 */
export function CampaignGridThumb({
    frame,
    supporterPhotos,
    size,
    className,
}: {
    frame: FrameConfig;
    supporterPhotos: string[];
    size: number;
    className?: string;
}) {
    const [supporterPhoto] = useState(() => pickSupporterPhoto(supporterPhotos));

    if (supporterPhoto) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={supporterPhoto} alt="" className={className ?? 'w-full h-full object-cover'} />
        );
    }

    return <FramePreview frame={frame} size={size} className={className ?? 'w-full h-full'} />;
}
