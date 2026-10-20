"use client";

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

type Ring = 'conic' | 'green' | 'purple';

const SLOT_CLASS: Record<1 | 2 | 3, string> = {
    2: 'left-0 top-[var(--fan-drop)] z-[1] -rotate-[14deg]',
    1: 'left-[calc(var(--fan-step)-(var(--fan-center)-var(--fan-side))/2)] top-0 z-[3]',
    3: 'left-[calc(var(--fan-step)*2)] top-[var(--fan-drop)] z-[2] rotate-[14deg]',
};

function FanLink({
    campaign,
    rank,
    ring,
}: {
    campaign: TopCampaign;
    rank: 1 | 2 | 3;
    ring: Ring;
}) {
    const ringStyle =
        ring === 'green'
            ? ({ '--ring': 'var(--frame-green)' } as React.CSSProperties)
            : ring === 'purple'
              ? ({ '--ring': 'var(--frame-purple)' } as React.CSSProperties)
              : undefined;

    return (
        <Link
            href={`/c/${campaign.slug}`}
            aria-hidden
            tabIndex={-1}
            className={`group absolute rounded-avatar outline-none ${SLOT_CLASS[rank]} ${
                rank === 1 ? 'shadow-frame-lg' : 'shadow-frame-sm'
            }`}
            style={{
                width: rank === 1 ? 'var(--fan-center)' : 'var(--fan-side)',
                height: rank === 1 ? 'var(--fan-center)' : 'var(--fan-side)',
            }}
        >
            <span
                className={`block h-full w-full rounded-avatar p-[3px] ${
                    ring === 'conic' ? 'ring-frame-conic' : 'ring-frame-solid'
                }`}
                style={ringStyle}
            >
                <span className="sr-only">{campaign.title}</span>
                <span className="block h-full w-full overflow-hidden rounded-avatar bg-paper">
                    <FramePreview
                        frame={campaign.frame}
                        size={rank === 1 ? 256 : 192}
                        tone="paper"
                        className="h-full w-full"
                    />
                </span>
            </span>
        </Link>
    );
}

/**
 * Top three campaigns as one overlapping fan. The count sits under each
 * circle. Supporter photos are not drawn here: those uploads are not a
 * gallery consent, and the hero photo pool is for the hero only.
 */
export function TopCampaignsPodium({ campaigns }: { campaigns: TopCampaign[] }) {
    const { locale, messages } = useLocale();
    const supportingLabel = messages.campaign.peopleSupporting;
    const shown = campaigns.slice(0, HOME_PODIUM_SLOTS);
    if (shown.length === 0) return null;

    const leader = shown[0];
    const proof = messages.home.framedTheirs.replace(
        '{count}',
        formatCount(leader.supporterCount, locale),
    );

    const slots: { rank: 1 | 2 | 3; campaign: TopCampaign; ring: Ring }[] = [];
    if (shown[1]) slots.push({ rank: 2, campaign: shown[1], ring: 'green' });
    slots.push({ rank: 1, campaign: shown[0], ring: 'conic' });
    if (shown[2]) slots.push({ rank: 3, campaign: shown[2], ring: 'purple' });

    return (
        <div className="w-full">
            <p className="mx-auto mb-6 max-w-lg px-5 text-center font-sans text-base font-semibold leading-snug text-ink">
                {proof}
            </p>
            <div className="campaign-fan-set">
            <div className="campaign-fan">
                {slots.map(({ rank, campaign, ring }) => (
                    <FanLink key={campaign.slug} campaign={campaign} rank={rank} ring={ring} />
                ))}
            </div>
            <ol className="campaign-fan-labels">
                {slots.map(({ campaign }) => {
                    const count = formatCount(campaign.supporterCount, locale);
                    return (
                        <li key={campaign.slug} className="min-w-0">
                            <Link
                                href={`/c/${campaign.slug}`}
                                className="block rounded-control px-0.5 py-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-brand-deep"
                            >
                                <span className="block font-display text-sm font-bold leading-snug text-ink line-clamp-2 break-words text-balance">
                                    {campaign.title}
                                </span>
                                <span className="mt-1 block font-sans text-xs tabular-nums text-ink/80">
                                    {count} {supportingLabel}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ol>
            </div>
        </div>
    );
}
