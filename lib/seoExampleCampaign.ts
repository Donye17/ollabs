import { pool } from '@/lib/neon';
import { visibleFrameSql, MIN_SUPPORTERS_TO_DISPLAY } from '@/lib/frameValidity';
import { SUPPORTER_PHOTOS_LATERAL, parseSupporterPhotos } from '@/lib/supporterPhotosSql';
import type { FrameConfig } from '@/lib/types';
import type { CategoryKey } from '@/lib/categories';
import { parseFrameConfig } from '@/lib/parseFrameConfig';

export type SeoExampleCampaign = {
    slug: string;
    title: string;
    supporterCount: number;
    frame: FrameConfig;
    supporterPhotos: string[];
};

/** Use-case slug → campaign category for a matching live example. */
export const USE_CASE_CATEGORY: Record<string, CategoryKey> = {
    fundraisers: 'fundraiser',
    nonprofits: 'cause',
    churches: 'faith',
    schools: 'school',
    'sports-teams': 'sports',
    events: 'event',
    birthdays: 'event',
    'awareness-campaigns': 'awareness',
    companies: 'business',
    universities: 'school',
};

function rowToExample(r: {
    slug: string;
    title: string;
    supporter_count: number;
    frame_config: unknown;
    supporter_photos: unknown;
}): SeoExampleCampaign | null {
    const frame = parseFrameConfig(r.frame_config);
    if (!frame) return null;
    return {
        slug: r.slug,
        title: r.title,
        supporterCount: r.supporter_count ?? 0,
        frame,
        supporterPhotos: parseSupporterPhotos(r.supporter_photos),
    };
}

/**
 * One live campaign for SEO pages (and the home hero). Prefer a category match
 * when given; otherwise the strongest public campaign with a visible frame.
 */
export async function getSeoExampleCampaign(
    category?: CategoryKey | null
): Promise<SeoExampleCampaign | null> {
    try {
        if (category) {
            const byCat = await pool.query(
                `SELECT c.slug, c.title, c.frame_config,
                        COALESCE(c.supporter_count, 0)::int AS supporter_count,
                        COALESCE(sp.supporter_photos, ARRAY[]::text[]) AS supporter_photos
                 FROM campaigns c
                 ${SUPPORTER_PHOTOS_LATERAL}
                 WHERE c.is_public = true AND c.is_hidden IS NOT TRUE
                   AND c.category = $1
                   AND COALESCE(c.supporter_count, 0) >= $2
                   AND ${visibleFrameSql('c')}
                   AND cardinality(COALESCE(sp.supporter_photos, ARRAY[]::text[])) > 0
                 ORDER BY c.supporter_count DESC, c.created_at DESC
                 LIMIT 1`,
                [category, MIN_SUPPORTERS_TO_DISPLAY]
            );
            if (byCat.rows[0]) {
                const example = rowToExample(byCat.rows[0]);
                if (example) return example;
            }
        }

        const top = await pool.query(
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
             WHERE c.is_public = true AND c.is_hidden IS NOT TRUE
               AND COALESCE(u.real_uses, 0) >= $1
               AND ${visibleFrameSql('c')}
               AND cardinality(COALESCE(sp.supporter_photos, ARRAY[]::text[])) > 0
             ORDER BY COALESCE(u.real_uses, 0) DESC, c.created_at DESC
             LIMIT 1`,
            [MIN_SUPPORTERS_TO_DISPLAY]
        );
        if (!top.rows[0]) return null;
        return rowToExample(top.rows[0]);
    } catch (e) {
        console.error('getSeoExampleCampaign failed', e);
        return null;
    }
}
