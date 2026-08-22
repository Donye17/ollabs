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
        const [published, firstSupporter, supporterUses] = await Promise.all([
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
        ]);

        return NextResponse.json({
            published: published.rows,
            firstSupporter: firstSupporter.rows,
            supporterUses: supporterUses.rows,
        });
    } catch (error) {
        console.error('Failed to load geo stats:', error);
        return NextResponse.json({ error: 'Failed to load geo stats' }, { status: 500 });
    }
}
