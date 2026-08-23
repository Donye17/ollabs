import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/neon';
import { sendEmail, zeroSupporterEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Cron: nudge organizers whose campaigns still have zero supporters ~20–90
 * minutes after publish. Median first supporter is ~4.5 minutes; waiting past
 * an hour is usually wasted. Guarded by zero_supporter_emailed_at.
 *
 * Auth: Authorization Bearer CRON_SECRET (Vercel Cron sends this when set),
 * or x-cron-secret header for manual runs.
 */
export async function GET(request: NextRequest) {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
        return NextResponse.json(
            { error: 'CRON_SECRET is not configured' },
            { status: 503 }
        );
    }
    const auth = request.headers.get('authorization') || '';
    const headerSecret = request.headers.get('x-cron-secret') || '';
    const ok =
        auth === `Bearer ${secret}` || headerSecret === secret;
    if (!ok) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Claim a batch atomically so overlapping cron ticks do not double-send.
        const claim = await pool.query(
            `UPDATE campaigns
             SET zero_supporter_emailed_at = NOW()
             WHERE id IN (
                 SELECT id FROM campaigns
                 WHERE COALESCE(supporter_count, 0) = 0
                   AND is_public = true
                   AND is_hidden IS NOT TRUE
                   AND organizer_email IS NOT NULL
                   AND owner_token IS NOT NULL
                   AND zero_supporter_emailed_at IS NULL
                   AND created_at <= NOW() - interval '20 minutes'
                   AND created_at >= NOW() - interval '90 minutes'
                 ORDER BY created_at ASC
                 LIMIT 40
                 FOR UPDATE SKIP LOCKED
             )
             RETURNING id, title, slug, owner_token, organizer_email`
        );

        let sent = 0;
        for (const row of claim.rows) {
            try {
                const msg = zeroSupporterEmail({
                    title: row.title,
                    slug: row.slug,
                    ownerToken: row.owner_token,
                });
                const okSend = await sendEmail({
                    to: row.organizer_email,
                    ...msg,
                    tag: 'zero_supporter',
                });
                if (okSend) sent += 1;
            } catch (e) {
                console.error('[cron/zero-supporter] send failed', row.slug, e);
            }
        }

        return NextResponse.json({
            claimed: claim.rows.length,
            sent,
        });
    } catch (error) {
        console.error('[cron/zero-supporter]', error);
        return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
    }
}
