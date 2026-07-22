import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// POST /api/campaigns/[slug]/report
// Records a report against a campaign. Body (optional): { reason }.
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const ip = clientIp(request);

        // Light throttle so a single client cannot spam reports.
        if (!rateLimit(`report:${ip}`, 10, 10 * 60 * 1000)) {
            return NextResponse.json({ error: 'Too many reports. Please wait a bit.' }, { status: 429 });
        }

        const campaignRes = await pool.query(
            `SELECT id FROM campaigns WHERE slug = $1 LIMIT 1`,
            [slug]
        );
        if (campaignRes.rows.length === 0) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }
        const campaignId = campaignRes.rows[0].id;

        let reason: string | null = null;
        try {
            const body = await request.json();
            if (body && typeof body.reason === 'string') reason = body.reason.slice(0, 500);
        } catch {
            // no body is fine
        }

        await pool.query(
            `INSERT INTO campaign_reports (campaign_id, slug, reason, reporter_ip, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [campaignId, slug, reason, ip]
        );

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Failed to record report:', error);
        return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
    }
}
