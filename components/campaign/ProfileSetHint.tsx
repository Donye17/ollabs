"use client";

import React from 'react';
import type { InAppKind } from '@/lib/inAppBrowser';

type Copy = {
    title: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
    generic: string;
    proof: string;
};

/**
 * One platform breadcrumb after a save, plus a mock profile row at real
 * avatar size. The conversion is a changed profile picture, not a file.
 */
export function ProfileSetHint({
    platform,
    previewUrl,
    copy,
}: {
    platform: InAppKind | 'generic';
    previewUrl: string | null;
    copy: Copy;
}) {
    const crumb =
        platform === 'instagram' ? copy.instagram
        : platform === 'facebook' ? copy.facebook
        : platform === 'whatsapp' ? copy.whatsapp
        : copy.generic;

    return (
        <div className="w-full rounded-xl border border-ink/10 bg-cream px-3 py-3 text-left space-y-2.5">
            <p className="text-sm font-semibold text-ink">{copy.title}</p>
            {previewUrl && (
                <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={previewUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-ink/10 shrink-0"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink leading-tight">{copy.proof}</p>
                        <p className="text-xs text-muted truncate">40 × 40</p>
                    </div>
                </div>
            )}
            <p className="text-sm text-ink/80 leading-snug">{crumb}</p>
        </div>
    );
}
