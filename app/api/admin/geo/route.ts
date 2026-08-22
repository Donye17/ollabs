import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function authed(request: NextRequest): boolean {
    const key = new URL(request.url).searchParams.get('key') || request.headers.get('x-admin-key') || '';
    const expected = process.env.ADMIN_KEY || '';
    return !!expected && key === expected;
}

// GET /api/admin/geo?key=ADMIN_KEY
// Publisher and supporter country breakdown from edge geo headers.
export async function GET(request: NextRequest) {
    if (!authed(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const [published, firstSupporter, supporterUses, deadCampaigns] = await Promise.all([
            pool.query(
                `SELECT publisher_country AS country, COUNT(*)::int AS n
                 FROM campaigns
                 WHERE publisher_country IS NOT NULL
                 GROUP BY publisher_country
                 ORDER BY n DESC
                 LIMIT 40`
            ),
            pool.query(
                `SELECT first_supporter_country AS country, COUNT(*)::int AS n
                 FROM campaigns
                 WHERE first_supporter_country IS NOT NULL
                 GROUP BY first_supporter_country
                 ORDER BY n DESC
                 LIMIT 40`
            ),
            pool.query(
                `SELECT supporter_country AS country, COUNT(*)::int AS n
                 FROM campaign_uses
                 WHERE supporter_country IS NOT NULL
                 GROUP BY supporter_country
                 ORDER BY n DESC
                 LIMIT 40`
            ),
            pool.query(
                `SELECT c.slug, c.title, c.view_count, c.supporter_count, c.created_at
                 FROM campaigns c
                 WHERE COALESCE(c.view_count, 0) >= 2
                   AND COALESCE(c.supporter_count, 0) = 0
                   AND c.created_at < NOW() - INTERVAL '24 hours'
                   AND NOT EXISTS (
                     SELECT 1
                     FROM campaign_uses cu
                     WHERE cu.campaign_id = c.id
                   )
                 ORDER BY c.view_count DESC, c.created_at DESC
                 LIMIT 100`
            ),
        ]);

        return NextResponse.json({
            published: published.rows,
            firstSupporter: firstSupporter.rows,
            supporterUses: supporterUses.rows,
            deadCampaigns: deadCampaigns.rows,
        });
    } catch (error) {
        console.error('Failed to load geo stats:', error);
        return NextResponse.json({ error: 'Failed to load geo stats' }, { status: 500 });
    }
}
