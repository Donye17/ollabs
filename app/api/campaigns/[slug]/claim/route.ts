import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { getSessionOrganizer } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/campaigns/[slug]/claim, body { token }
//
// Attaches an existing campaign to the signed-in account. The owner token is
// the proof of ownership, so this only works for someone who already holds the
// manage link. It covers the case sign-in alone cannot: campaigns created
// without an email, which is most of them.
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        if (!rateLimit(`claim:${clientIp(request)}`, 60, 10 * 60 * 1000)) {
            return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
        }

        const organizer = await getSessionOrganizer(request);
        if (!organizer) {
            return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
        }

        const { slug } = await params;
        const body = await request.json().catch(() => ({}));
        const token = typeof body.token === 'string' ? body.token : '';
        if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

        const owned = await pool.query(
            `SELECT id, creator_id, organizer_email FROM campaigns
             WHERE slug = $1 AND owner_token = $2 LIMIT 1`,
            [slug, token]
        );
        if (owned.rows.length === 0) {
            return NextResponse.json({ error: 'Not found or wrong key' }, { status: 404 });
        }
        const campaign = owned.rows[0];

        // Already claimed by someone else. Holding the token does not let you
        // take a campaign off another account, it only lets you adopt one that
        // nobody has adopted yet.
        if (campaign.creator_id && campaign.creator_id !== organizer.id) {
            return NextResponse.json(
                { error: 'This campaign is already attached to another account.' },
                { status: 409 }
            );
        }

        // Backfill the organizer email at the same time when it is missing, so
        // the existing recovery path starts working for this campaign too.
        await pool.query(
            `UPDATE campaigns
             SET creator_id = $1,
                 organizer_email = COALESCE(organizer_email, $2)
             WHERE id = $3`,
            [organizer.id, organizer.email, campaign.id]
        );

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Failed to claim campaign:', error);
        return NextResponse.json({ error: 'Could not add this campaign' }, { status: 500 });
    }
}
