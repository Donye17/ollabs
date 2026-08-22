"use client";

import dynamic from 'next/dynamic';
import type { HomeCampaign } from '@/components/HomeExamples';
import { ExamplesSkeleton } from '@/components/home/ExamplesSkeleton';

const HomeExamples = dynamic(
    () => import('@/components/HomeExamples').then((m) => ({ default: m.HomeExamples })),
    { ssr: false, loading: () => <ExamplesSkeleton /> }
);

export function HomeExamplesClient({ campaigns }: { campaigns: HomeCampaign[] }) {
    return <HomeExamples campaigns={campaigns} />;
}
