import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// POST /api/campaigns/[slug]/cta
// A supporter tapped "Make your own frame" after saving. Count only.
// No account, no personal data. The hub reads cta_taps later.
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const ip = clientIp(request);
        if (!rateLimit(`cta:${ip}:${slug}`, 8, 10 * 60 * 1000)) {
            return NextResponse.json({ error: 'Too many requests. Try again shortly.' }, { status: 429 });
        }
        const result = await pool.query(
            `UPDATE campaigns
             SET cta_taps = COALESCE(cta_taps, 0) + 1
             WHERE slug = $1 AND is_public = true AND is_hidden IS NOT TRUE
             RETURNING cta_taps`,
            [slug]
        );
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }
        return NextResponse.json({ cta_taps: result.rows[0].cta_taps });
    } catch (error) {
        console.error('Failed to record CTA tap:', error);
        return NextResponse.json({ error: 'Failed to record' }, { status: 500 });
    }
}
