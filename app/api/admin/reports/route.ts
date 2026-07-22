import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function authed(request: NextRequest): boolean {
    const key = new URL(request.url).searchParams.get('key') || request.headers.get('x-admin-key') || '';
    const expected = process.env.ADMIN_KEY || '';
    return !!expected && key === expected;
}

// GET /api/admin/reports?key=ADMIN_KEY
// Returns reported campaigns, grouped, newest report first.
export async function GET(request: NextRequest) {
    if (!authed(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const result = await pool.query(
            `SELECT r.slug,
                    c.title,
                    c.is_hidden,
                    c.supporter_count,
                    c.view_count,
                    COUNT(*)::int AS report_count,
                    MAX(r.created_at) AS last_reported,
                    array_agg(r.reason) FILTER (WHERE r.reason IS NOT NULL AND r.reason <> '') AS reasons
             FROM campaign_reports r
             JOIN campaigns c ON c.id = r.campaign_id
             GROUP BY r.slug, c.title, c.is_hidden, c.supporter_count, c.view_count
             ORDER BY MAX(r.created_at) DESC
             LIMIT 200`
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Failed to load reports:', error);
        return NextResponse.json({ error: 'Failed to load reports' }, { status: 500 });
    }
}
