"use client";

import type { TopCampaign } from '@/components/home/TopCampaignsPodium';
import { TopCampaignsPodium } from '@/components/home/TopCampaignsPodium';

/** Server-renders the podium. The old ssr:false + DeferUntilVisible path left
 *  "Top campaigns" as a heading with nothing under it on a cold mobile load. */
export function HomeTopCampaignsClient({ campaigns }: { campaigns: TopCampaign[] }) {
    return <TopCampaignsPodium campaigns={campaigns} />;
}
