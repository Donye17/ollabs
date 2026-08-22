"use client";

import dynamic from 'next/dynamic';
import type { TopCampaign } from '@/components/home/TopCampaignsPodium';
import { ExamplesSkeleton } from '@/components/home/ExamplesSkeleton';
import { DeferUntilIdle } from '@/components/home/DeferUntilIdle';

const TopCampaignsPodium = dynamic(
    () => import('@/components/home/TopCampaignsPodium').then((m) => ({ default: m.TopCampaignsPodium })),
    { ssr: false, loading: () => <ExamplesSkeleton /> }
);

export function HomeTopCampaignsClient({ campaigns }: { campaigns: TopCampaign[] }) {
    return (
        <DeferUntilIdle fallback={<ExamplesSkeleton />}>
            <TopCampaignsPodium campaigns={campaigns} />
        </DeferUntilIdle>
    );
}
