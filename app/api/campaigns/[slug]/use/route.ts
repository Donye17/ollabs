import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// POST /api/campaigns/[slug]/use, a supporter applied the frame; bump the counter.
// Body (optional): { imageUrl } if the supporter opts in to the supporter wall.
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;

        const campaignRes = await pool.query(
            `SELECT id FROM campaigns WHERE slug = $1 AND is_public = true AND is_hidden IS NOT TRUE LIMIT 1`,
            [slug]
        );
        if (campaignRes.rows.length === 0) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }
        const campaignId = campaignRes.rows[0].id;

        let imageUrl: string | null = null;
        try {
            const body = await request.json();
            if (body && typeof body.imageUrl === 'string') imageUrl = body.imageUrl;
        } catch {
            // no body is fine
        }

        await pool.query(
            `INSERT INTO campaign_uses (campaign_id, user_id, image_url, created_at)
             VALUES ($1, $2, $3, NOW())`,
            [campaignId, null, imageUrl]
        );

        const updated = await pool.query(
            `UPDATE campaigns SET supporter_count = supporter_count + 1 WHERE id = $1 RETURNING supporter_count`,
            [campaignId]
        );

        return NextResponse.json({ supporter_count: updated.rows[0].supporter_count });
    } catch (error) {
        console.error('Failed to record campaign use:', error);
        return NextResponse.json({ error: 'Failed to record campaign use' }, { status: 500 });
    }
}
