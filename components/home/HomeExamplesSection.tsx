import { pool } from '@/lib/neon';
import { visibleFrameSql, HOME_TOP_CAMPAIGNS, MIN_SUPPORTERS_TO_DISPLAY } from '@/lib/frameValidity';
import { SUPPORTER_PHOTOS_LATERAL, parseSupporterPhotos } from '@/lib/supporterPhotosSql';
import type { TopCampaign } from '@/components/home/TopCampaignsPodium';
import { HomeTopCampaignsClient } from '@/components/home/HomeTopCampaignsClient';
import { parseFrameConfig } from '@/lib/parseFrameConfig';

async function getTopCampaigns(): Promise<TopCampaign[]> {
    try {
        // Rank by real campaign_uses rows, not the denormalized counter. Seeded
        // demo frames used to inflate supporter_count without matching uses.
        const res = await pool.query(
            `SELECT c.slug, c.title, c.frame_config,
                    COALESCE(u.real_uses, 0)::int AS supporter_count,
                    COALESCE(sp.supporter_photos, ARRAY[]::text[]) AS supporter_photos
             FROM campaigns c
             LEFT JOIN (
                 SELECT campaign_id, COUNT(*)::int AS real_uses
                 FROM campaign_uses
                 GROUP BY campaign_id
             ) u ON u.campaign_id = c.id
             ${SUPPORTER_PHOTOS_LATERAL}
             WHERE c.is_public = true
               AND c.is_hidden IS NOT TRUE
               AND COALESCE(u.real_uses, 0) >= $1
               AND ${visibleFrameSql('c')}
             ORDER BY COALESCE(u.real_uses, 0) DESC, c.created_at DESC
             LIMIT $2`,
            [MIN_SUPPORTERS_TO_DISPLAY, HOME_TOP_CAMPAIGNS]
        );
        return res.rows.flatMap((r) => {
            const frame = parseFrameConfig(r.frame_config);
            if (!frame) return [];
            const supporterPhotos = parseSupporterPhotos(r.supporter_photos);
            // Home thumbs must use explore JPEGs, not live frame PNG overlays.
            if (supporterPhotos.length === 0) return [];
            return [{
                slug: r.slug,
                title: r.title,
                supporterCount: r.supporter_count ?? 0,
                frame,
                supporterPhotos,
            }];
        });
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
            <p className="text-center text-sm text-muted font-semibold mb-2">
                Top campaigns
            </p>
            <p className="text-center text-sm text-ink/65 mb-8 max-w-md mx-auto leading-relaxed">
                Real frames people are using right now, ranked by supporters.
            </p>
            <HomeTopCampaignsClient campaigns={campaigns} />
        </div>
    );
}
