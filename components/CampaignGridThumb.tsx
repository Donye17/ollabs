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
 * overlay baked in). Everything else draws live from frame_config. Never
 * preview_url, which often captured the default cyan ring before custom art loaded.
 */
export function CampaignGridThumb({
    frame,
    supporterPhotos,
    size,
    className,
    priority = false,
    title,
}: {
    frame: FrameConfig;
    supporterPhotos: string[];
    size: number;
    className?: string;
    /** Hero / LCP thumb: fetch early. Default lazy for grids. */
    priority?: boolean;
    title?: string;
}) {
    const [supporterPhoto] = useState(() => pickSupporterPhoto(supporterPhotos));
    const alt = title ? `${title} frame` : '';

    if (supporterPhoto) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={supporterPhoto}
                alt={alt}
                width={size}
                height={size}
                className={className ?? 'w-full h-full object-cover'}
                fetchPriority={priority ? 'high' : 'auto'}
                decoding={priority ? 'sync' : 'async'}
                loading={priority ? 'eager' : 'lazy'}
            />
        );
    }

    return <FramePreview frame={frame} size={size} className={className ?? 'w-full h-full'} />;
}
