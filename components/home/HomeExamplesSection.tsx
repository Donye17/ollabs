import { pool } from '@/lib/neon';
import Link from 'next/link';
import { visibleFrameSql, HOME_TOP_CAMPAIGNS, MIN_SUPPORTERS_TO_DISPLAY } from '@/lib/frameValidity';
import { SUPPORTER_PHOTOS_LATERAL, parseSupporterPhotos } from '@/lib/supporterPhotosSql';
import type { TopCampaign } from '@/components/home/TopCampaignsPodium';
import { HomeTopCampaignsClient } from '@/components/home/HomeTopCampaignsClient';
import { parseFrameConfig } from '@/lib/parseFrameConfig';

async function getTopCampaigns(): Promise<TopCampaign[]> {
    try {
        // Rank by real campaign_uses rows, not the denormalized counter. Seeded
        // demo frames used to inflate supporter_count without matching uses.
        // Over-fetch: parseFrameConfig can drop a row, and we prefer thumbs
        // that already have a supporter JPEG. Requiring a JPEG used to leave
        // the podium with a single card (Foto com DrPitagoras) because almost
        // no campaign_uses row stores image_url.
        const fetchLimit = HOME_TOP_CAMPAIGNS * 4;
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
                supporterPhotos: parseSupporterPhotos(r.supporter_photos),
            }];
        });
        const withPhotos = mapped.filter((c) => c.supporterPhotos.length > 0);
        const without = mapped.filter((c) => c.supporterPhotos.length === 0);
        return [...withPhotos, ...without].slice(0, HOME_TOP_CAMPAIGNS);
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
            <p className="text-left text-sm text-ink/65 mb-8 max-w-md mx-auto leading-relaxed">
                Real frames people are using right now, ranked by supporters.
            </p>
            <HomeTopCampaignsClient campaigns={campaigns} />
            <p className="mt-8 text-left max-w-md mx-auto text-sm">
                <Link href="/day" className="font-semibold text-brand-deep hover:underline">
                    Calendar moments
                </Link>
            </p>
        </div>
    );
}
