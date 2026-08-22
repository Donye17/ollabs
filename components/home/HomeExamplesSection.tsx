import { pool } from '@/lib/neon';
import { visibleFrameSql, HOME_SHOWCASE_LIMIT } from '@/lib/frameValidity';
import type { FrameConfig } from '@/lib/types';
import type { HomeCampaign } from '@/components/HomeExamples';
import { HomeExamplesClient } from '@/components/home/HomeExamplesClient';

async function getExampleCampaigns(): Promise<HomeCampaign[]> {
    try {
        const res = await pool.query(
            `SELECT c.slug, c.title, c.frame_config, c.supporter_count
             FROM campaigns c
             WHERE c.is_public = true
               AND c.is_hidden IS NOT TRUE
               AND ${visibleFrameSql('c')}
             ORDER BY c.created_at DESC
             LIMIT $1`,
            [HOME_SHOWCASE_LIMIT]
        );
        return res.rows.map((r) => ({
            slug: r.slug,
            title: r.title,
            supporterCount: r.supporter_count ?? 0,
            frame: (typeof r.frame_config === 'string' ? JSON.parse(r.frame_config) : r.frame_config) as FrameConfig,
        }));
    } catch (e) {
        console.error('Failed to load example campaigns', e);
        return [];
    }
}

export async function HomeExamplesSection() {
    const examples = await getExampleCampaigns();
    if (examples.length === 0) return null;

    return (
        <div id="examples" className="mt-20 relative z-10 scroll-mt-24">
            <p className="text-center text-xs uppercase tracking-[0.2em] text-muted font-bold mb-4">Live campaigns</p>
            <div className="-mx-6">
                <HomeExamplesClient campaigns={examples} />
            </div>
        </div>
    );
}
