"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { CampaignGridThumb } from '@/components/CampaignGridThumb';
import type { FrameConfig } from '@/lib/types';
import { HOME_PODIUM_SLOTS } from '@/lib/frameValidity';

export type TopCampaign = {
    slug: string;
    title: string;
    supporterCount: number;
    frame: FrameConfig;
    supporterPhotos: string[];
};

type Slot = { rank: 1 | 2 | 3; campaign: TopCampaign };

function PodiumLink({
    campaign,
    rank,
    first,
}: {
    campaign: TopCampaign;
    rank: 1 | 2 | 3;
    first: boolean;
}) {
    // CSS box vs file pixels: 2x DPR. Side slots stay at 176 so we do not
    // pull a larger JPEG than the circle can show on phones.
    const framePx = first ? 128 : 88;
    const canvasPx = first ? 256 : 176;

    return (
        <Link
            href={`/c/${campaign.slug}`}
            className={`group flex flex-col items-center text-center outline-none ${
                first ? 'pt-0' : 'pt-6'
            }`}
        >
            <span
                className={`mb-2 inline-flex items-center justify-center rounded-full font-display font-bold tabular-nums ${
                    first
                        ? 'h-8 min-w-8 px-2.5 text-sm bg-brand text-ink ring-4 ring-brand/25'
                        : 'h-7 min-w-7 px-2 text-xs bg-ink/10 text-ink'
                }`}
                aria-label={`Rank ${rank}`}
            >
                {rank}
            </span>
            <div
                className={`rounded-full overflow-hidden bg-ink/5 frame-shadow ${
                    first ? 'ring-2 ring-brand/40' : 'ring-1 ring-ink/10'
                }`}
                style={{ width: framePx, height: framePx }}
            >
                <CampaignGridThumb
                    frame={campaign.frame}
                    supporterPhotos={campaign.supporterPhotos}
                    size={canvasPx}
                    className="w-full h-full"
                />
            </div>
            <p
                className={`mt-3 font-display font-bold leading-snug line-clamp-2 text-balance group-hover:text-brand-deep transition-colors ${
                    first ? 'text-[15px] sm:text-base' : 'text-sm'
                }`}
            >
                {campaign.title}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted tabular-nums">
                <Users size={12} className="shrink-0" aria-hidden />
                {campaign.supporterCount.toLocaleString()}
            </p>
        </Link>
    );
}

function DesktopTile({ campaign, rank }: { campaign: TopCampaign; rank: number }) {
    return (
        <Link
            href={`/c/${campaign.slug}`}
            className="group flex flex-col items-center text-center outline-none"
        >
            <div className="relative">
                <div className="w-36 h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-ink/5 ring-1 ring-ink/10 frame-shadow">
                    <CampaignGridThumb
                        frame={campaign.frame}
                        supporterPhotos={campaign.supporterPhotos}
                        size={192}
                        className="w-full h-full"
                    />
                </div>
                <span className="absolute -top-1 -left-1 h-7 min-w-7 px-1.5 inline-flex items-center justify-center rounded-full bg-ink text-paper text-xs font-bold tabular-nums">
                    {rank}
                </span>
            </div>
            <p className="mt-3 font-display font-bold text-sm leading-snug line-clamp-2 text-balance group-hover:text-brand-deep transition-colors max-w-[10rem]">
                {campaign.title}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted tabular-nums">
                <Users size={12} className="shrink-0" aria-hidden />
                {campaign.supporterCount.toLocaleString()}
            </p>
        </Link>
    );
}

/**
 * Top campaigns by supporters. Phones keep a 2nd / 1st / 3rd podium. Desktop
 * shows up to six equal tiles so discovery feels fuller without a carousel.
 */
export function TopCampaignsPodium({ campaigns }: { campaigns: TopCampaign[] }) {
    // Desktop grid is display:none on phones but browsers still download those
    // <img>s. Mount it only at md+ so mobile lab audits stop counting six
    // offscreen explore JPEGs.
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false
    );
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)');
        const apply = () => setIsDesktop(mq.matches);
        apply();
        mq.addEventListener('change', apply);
        return () => mq.removeEventListener('change', apply);
    }, []);

    // Prefetch only the thumbs that will actually paint. Never prefetch
    // custom frame overlay PNGs here: those are often 0.5–1MB+ and wiped mobile LCP.
    useEffect(() => {
        const targets = isDesktop
            ? campaigns
            : [campaigns[1], campaigns[0], campaigns[2]].filter(Boolean) as TopCampaign[];
        for (const c of targets) {
            const url = c.supporterPhotos[0];
            if (url) {
                const img = new Image();
                img.decoding = 'async';
                img.src = url;
            }
        }
    }, [campaigns, isDesktop]);

    const podium: Slot[] = [];
    if (campaigns[1]) podium.push({ rank: 2, campaign: campaigns[1] });
    if (campaigns[0]) podium.push({ rank: 1, campaign: campaigns[0] });
    if (campaigns[2]) podium.push({ rank: 3, campaign: campaigns[2] });

    if (campaigns.length === 0) return null;

    const desktop = campaigns.slice(0, Math.max(HOME_PODIUM_SLOTS, campaigns.length));

    return (
        <div className="w-full">
            {/* Mobile / tablet: classic podium */}
            {podium.length > 0 && (
                <div className="md:hidden w-full max-w-lg mx-auto">
                    <ol className="flex items-end justify-center gap-2 sm:gap-4 px-1 list-none">
                        {podium.map(({ rank, campaign }) => (
                            <li
                                key={campaign.slug}
                                className={`flex-1 min-w-0 max-w-[140px] sm:max-w-[160px] ${rank === 1 ? 'z-10' : ''}`}
                            >
                                <PodiumLink campaign={campaign} rank={rank} first={rank === 1} />
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Desktop: up to six live tiles */}
            {isDesktop && (
                <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6 max-w-5xl lg:max-w-6xl mx-auto px-2">
                    {desktop.map((campaign, i) => (
                        <DesktopTile key={campaign.slug} campaign={campaign} rank={i + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}
