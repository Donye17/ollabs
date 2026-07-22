import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/campaigns/[slug], fetch a single public campaign for the supporter page
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const result = await pool.query(
            `SELECT id, slug, title, description, frame_config, creator_name, supporter_count, is_public, is_hidden, created_at
             FROM campaigns
             WHERE slug = $1
             LIMIT 1`,
            [slug]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }

        const campaign = result.rows[0];
        if (campaign.is_public === false || campaign.is_hidden === true) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }

        return NextResponse.json(campaign);
    } catch (error) {
        console.error('Failed to fetch campaign:', error);
        return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
    }
}
