import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { parseAdminCampaignId } from '@/lib/adminCampaignId';

export const dynamic = 'force-dynamic';

// POST /api/admin/moderate
// Body: { key, id, hidden }. Hides or unhides a campaign by id.
//
// id, not slug: campaign_reports.slug is the URL at report time. After a
// custom-link rename that name can be free, and a later campaign can claim
// it. Updating WHERE slug = report.slug would hide the wrong row.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const key = typeof body.key === 'string' ? body.key : (request.headers.get('x-admin-key') || '');
        const expected = process.env.ADMIN_KEY || '';
        if (!expected || key !== expected) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = parseAdminCampaignId(body.id);
        const hidden = body.hidden === true;
        if (!id) {
            return NextResponse.json({ error: 'Missing campaign id' }, { status: 400 });
        }

        const result = await pool.query(
            `UPDATE campaigns SET is_hidden = $1 WHERE id = $2 RETURNING id, slug, is_hidden`,
            [hidden, id]
        );
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Failed to moderate campaign:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
