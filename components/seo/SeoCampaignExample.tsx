"use client";

import Link from 'next/link';
import { Users } from 'lucide-react';
import { CampaignGridThumb } from '@/components/CampaignGridThumb';
import type { SeoExampleCampaign } from '@/lib/seoExampleCampaign';

/** Single live campaign proof for SEO / home marketing surfaces. */
export function SeoCampaignExample({
    campaign,
    size = 200,
    title,
    className = '',
    priority = false,
}: {
    campaign: SeoExampleCampaign;
    size?: number;
    /** Optional heading above the thumb. */
    title?: string;
    className?: string;
    /** Mark as LCP candidate (home hero). */
    priority?: boolean;
}) {
    return (
        <div className={className}>
            {title && (
                <p className="text-sm font-semibold text-muted mb-4 text-center">{title}</p>
            )}
            <Link
                href={`/c/${campaign.slug}`}
                className="group flex flex-col items-center gap-3"
            >
                <div
                    className="rounded-full overflow-hidden bg-cream border border-ink/10 shrink-0 frame-shadow"
                    style={{
                        width: size,
                        height: size,
                    }}
                >
                    <CampaignGridThumb
                        frame={campaign.frame}
                        supporterPhotos={campaign.supporterPhotos}
                        size={size}
                        className="w-full h-full object-cover"
                        priority={priority}
                    />
                </div>
                <div className="text-center min-w-0 max-w-[16rem]">
                    <p className="font-display font-bold text-[15px] text-ink group-hover:text-brand-deep transition-colors truncate">
                        {campaign.title}
                    </p>
                    <p className="text-xs text-muted flex items-center justify-center gap-1 mt-0.5">
                        <Users size={12} />
                        {campaign.supporterCount.toLocaleString()} supporters
                    </p>
                </div>
            </Link>
        </div>
    );
}
