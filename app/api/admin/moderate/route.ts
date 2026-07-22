import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// POST /api/admin/moderate
// Body: { key, slug, hidden }. Hides or unhides a campaign.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const key = typeof body.key === 'string' ? body.key : (request.headers.get('x-admin-key') || '');
        const expected = process.env.ADMIN_KEY || '';
        if (!expected || key !== expected) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const slug = typeof body.slug === 'string' ? body.slug : '';
        const hidden = body.hidden === true;
        if (!slug) {
            return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
        }

        const result = await pool.query(
            `UPDATE campaigns SET is_hidden = $1 WHERE slug = $2 RETURNING slug, is_hidden`,
            [hidden, slug]
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
