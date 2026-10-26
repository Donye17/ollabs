import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionOrganizer } from '@/lib/auth';
import { readReferrers } from '@/lib/campaignBrand';

export const dynamic = 'force-dynamic';

function cell(value: string | number): string {
    const s = String(value);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}

// GET /api/organizer/campaigns/export
// One row per campaign: public counts only. No photos, emails, or tokens.
export async function GET(request: NextRequest) {
    try {
        const organizer = await getSessionOrganizer(request);
        if (!organizer) {
            return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
        }
        const result = await pool.query(
            `SELECT title, slug,
                    COALESCE(supporter_count, 0) AS supporter_count,
                    COALESCE(share_count, 0) AS share_count,
                    COALESCE(cta_taps, 0) AS cta_taps,
                    referrer_counts
             FROM campaigns
             WHERE creator_id = $1 AND is_hidden IS NOT TRUE
             ORDER BY created_at DESC
             LIMIT 200`,
            [organizer.id]
        );
        const header = ['title', 'slug', 'supporters', 'shares', 'cta_taps', 'whatsapp', 'instagram', 'facebook', 'direct'];
        const lines = [header.join(',')];
        for (const row of result.rows) {
            const refs = readReferrers(row.referrer_counts);
            lines.push([
                cell(row.title || ''),
                cell(row.slug || ''),
                cell(row.supporter_count ?? 0),
                cell(row.share_count ?? 0),
                cell(row.cta_taps ?? 0),
                cell(refs.whatsapp),
                cell(refs.instagram),
                cell(refs.facebook),
                cell(refs.direct),
            ].join(','));
        }
        return new NextResponse(lines.join('\n'), {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="ollabs-campaigns.csv"',
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Failed to export campaigns:', error);
        return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
    }
}
