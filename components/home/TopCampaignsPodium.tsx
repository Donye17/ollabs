'use client';

import React from 'react';
import Link from 'next/link';
import { FramePreview } from '@/components/FramePreview';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { formatCount } from '@/lib/i18n/locale';
import type { FrameConfig } from '@/lib/types';
import { HOME_PODIUM_SLOTS } from '@/lib/frameValidity';

export type TopCampaign = {
    slug: string;
    title: string;
    supporterCount: number;
    frame: FrameConfig;
};

/**
 * Compact proof row. The overlapping fan used to be a second hero.
 * Three small frames, names, and counts. No supporter photos.
 */
export function TopCampaignsPodium({ campaigns }: { campaigns: TopCampaign[] }) {
    const { locale, messages } = useLocale();
    const supportingLabel = messages.campaign.peopleSupporting;
    const shown = campaigns.slice(0, HOME_PODIUM_SLOTS);
    if (shown.length === 0) return null;

    return (
        <ul className="mx-auto grid max-w-lg grid-cols-3 gap-3 px-5">
            {shown.map((campaign) => {
                const count = formatCount(campaign.supporterCount, locale);
                return (
                    <li key={campaign.slug} className="min-w-0">
                        <Link
                            href={`/c/${campaign.slug}`}
                            className="flex min-h-11 flex-col items-center rounded-xl px-1 py-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                        >
                            <span className="block h-[72px] w-[72px] overflow-hidden rounded-full bg-paper">
                                <FramePreview
                                    frame={campaign.frame}
                                    size={72}
                                    tone="paper"
                                    className="h-full w-full"
                                />
                            </span>
                            <span className="mt-2 block font-display text-sm font-bold leading-snug text-ink line-clamp-2 break-words">
                                {campaign.title}
                            </span>
                            <span className="mt-1 block font-sans text-xs tabular-nums text-ink/80">
                                {count} {supportingLabel}
                            </span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
