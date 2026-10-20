import { pool } from '@/lib/neon';
import { visibleFrameSql, HOME_TOP_CAMPAIGNS, HOME_PODIUM_SLOTS, MIN_SUPPORTERS_TO_DISPLAY } from '@/lib/frameValidity';
import type { TopCampaign } from '@/components/home/TopCampaignsPodium';
import { HomeTopCampaignsClient } from '@/components/home/HomeTopCampaignsClient';
import { HomeCalendarLink, HomeExamplesCopy } from '@/components/home/HomeExamplesCopy';
import { parseFrameConfig } from '@/lib/parseFrameConfig';

async function getTopCampaigns(): Promise<TopCampaign[]> {
    try {
        // Rank by real campaign_uses rows, not the denormalized counter. Seeded
        // demo frames used to inflate supporter_count without matching uses.
        // Supporter JPEGs stay off this page. Those uploads are not a gallery
        // consent, and the hero photo pool is approved for the hero only.
        const fetchLimit = HOME_TOP_CAMPAIGNS * 4;
        const res = await pool.query(
            `SELECT c.slug, c.title, c.frame_config,
                    COALESCE(u.real_uses, 0)::int AS supporter_count
             FROM campaigns c
             LEFT JOIN (
                 SELECT campaign_id, COUNT(*)::int AS real_uses
                 FROM campaign_uses
                 GROUP BY campaign_id
             ) u ON u.campaign_id = c.id
             WHERE c.is_public = true
               AND c.is_hidden IS NOT TRUE
               AND COALESCE(u.real_uses, 0) >= $1
               AND ${visibleFrameSql('c')}
             ORDER BY COALESCE(u.real_uses, 0) DESC, c.created_at DESC
             LIMIT $2`,
            [MIN_SUPPORTERS_TO_DISPLAY, fetchLimit]
        );
        const mapped: TopCampaign[] = res.rows.flatMap((r) => {
            const frame = parseFrameConfig(r.frame_config);
            if (!frame) return [];
            return [{
                slug: r.slug,
                title: r.title,
                supporterCount: r.supporter_count ?? 0,
                frame,
            }];
        });
        return mapped.slice(0, HOME_PODIUM_SLOTS);
    } catch (e) {
        console.error('Failed to load top campaigns', e);
        return [];
    }
}

export async function HomeExamplesSection() {
    const campaigns = await getTopCampaigns();
    if (campaigns.length === 0) return null;

    return (
        <div className="relative z-10">
            <HomeExamplesCopy />
            <HomeTopCampaignsClient campaigns={campaigns} />
            <HomeCalendarLink />
        </div>
    );
}
