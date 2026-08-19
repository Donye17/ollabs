import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionOrganizer } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/organizer/campaigns
//
// Every campaign attached to the signed-in account, newest first.
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
            `SELECT slug, title, owner_token, supporter_count, view_count, created_at
             FROM campaigns
             WHERE creator_id = $1 AND is_hidden IS NOT TRUE
             ORDER BY created_at DESC
             LIMIT 200`,
            [organizer.id]
        );

        return NextResponse.json({ email: organizer.email, campaigns: result.rows });
    } catch (error) {
        console.error('Failed to list organizer campaigns:', error);
        return NextResponse.json({ error: 'Failed to load your campaigns' }, { status: 500 });
    }
}
