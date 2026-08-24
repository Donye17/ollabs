import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionOrganizer } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/organizer/campaigns
//
// Every campaign on the signed-in account, most recently active first
// (last supporter save, else publish time). Includes frame_config for Mine
// thumbs — live render, not stale preview_url blobs.
//
// This returns owner_token, which is the campaign's private key. That is
// deliberate and it is safe: the only caller who ever sees it is a session that
// already owns the campaign, and the client needs it to build the manage link.
// It is the same secret the welcome email already puts in their inbox.
export async function GET(request: NextRequest) {
    try {
        const organizer = await getSessionOrganizer(request);
        if (!organizer) {
            return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
        }

        const result = await pool.query(
            `SELECT c.slug, c.title, c.owner_token, c.supporter_count, c.view_count, c.created_at,
                    c.publisher_country, c.first_supporter_country, c.frame_config,
                    COALESCE(u.last_use, c.created_at) AS last_activity
             FROM campaigns c
             LEFT JOIN (
                 SELECT campaign_id, MAX(created_at) AS last_use
                 FROM campaign_uses
                 GROUP BY campaign_id
             ) u ON u.campaign_id = c.id
             WHERE c.creator_id = $1 AND c.is_hidden IS NOT TRUE
             ORDER BY COALESCE(u.last_use, c.created_at) DESC
             LIMIT 200`,
            [organizer.id]
        );

        const hubRes = await pool.query(
            `SELECT handle FROM organizers WHERE id = $1 LIMIT 1`,
            [organizer.id]
        );

        const campaigns = result.rows.map((row: {
            slug: string;
            title: string;
            owner_token: string;
            supporter_count: number | null;
            view_count: number | null;
            created_at: string;
            publisher_country: string | null;
            first_supporter_country: string | null;
            frame_config: unknown;
            last_activity: string;
        }) => {
            let frameConfig = row.frame_config;
            if (typeof frameConfig === 'string') {
                try {
                    frameConfig = JSON.parse(frameConfig);
                } catch {
                    frameConfig = null;
                }
            }
            return {
                slug: row.slug,
                title: row.title,
                owner_token: row.owner_token,
                supporter_count: row.supporter_count,
                view_count: row.view_count,
                created_at: row.created_at,
                publisher_country: row.publisher_country,
                first_supporter_country: row.first_supporter_country,
                last_activity: row.last_activity,
                frameConfig: frameConfig ?? null,
            };
        });

        return NextResponse.json({
            email: organizer.email,
            hub_handle: (hubRes.rows[0]?.handle as string | null) ?? null,
            campaigns,
        });
    } catch (error) {
        console.error('Failed to list organizer campaigns:', error);
        return NextResponse.json({ error: 'Failed to load your campaigns' }, { status: 500 });
    }
}
