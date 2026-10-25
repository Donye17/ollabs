import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// POST /api/campaigns/[slug]/share
// Someone sent the campaign on from the supporter page. A count, not a person.
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const ip = clientIp(request);
        if (!rateLimit(`share:${ip}:${slug}`, 20, 10 * 60 * 1000)) {
            return NextResponse.json({ error: 'Too many requests. Try again shortly.' }, { status: 429 });
        }
        const result = await pool.query(
            `UPDATE campaigns
             SET share_count = COALESCE(share_count, 0) + 1
             WHERE slug = $1 AND is_public = true AND is_hidden IS NOT TRUE
             RETURNING share_count`,
            [slug]
        );
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }
        return NextResponse.json({ share_count: result.rows[0].share_count });
    } catch (error) {
        console.error('Failed to record share:', error);
        return NextResponse.json({ error: 'Failed to record' }, { status: 500 });
    }
}
