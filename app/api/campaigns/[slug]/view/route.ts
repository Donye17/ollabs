import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// POST /api/campaigns/[slug]/view
// Records a real view of the supporter page. The client dedupes per browser session
// (sessionStorage) so a reload in the same tab does not inflate the number.
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const result = await pool.query(
            `UPDATE campaigns
             SET view_count = COALESCE(view_count, 0) + 1
             WHERE slug = $1 AND is_public = true
             RETURNING view_count`,
            [slug]
        );
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }
        return NextResponse.json({ view_count: result.rows[0].view_count });
    } catch (error) {
        console.error('Failed to record view:', error);
        return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
    }
}
