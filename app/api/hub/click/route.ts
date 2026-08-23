import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/neon';
import { clientIp, rateLimit } from '@/lib/rateLimit';
import { normalizeHandle } from '@/lib/hub';

export const dynamic = 'force-dynamic';

/**
 * POST /api/hub/click
 * Body: { handle, kind: 'support' | 'link', linkId? }
 * Fire-and-forget beacon from the public hub. Per-instance rate limit only.
 */
export async function POST(request: NextRequest) {
    try {
        const ip = clientIp(request);
        if (!rateLimit(`hubclick:${ip}`, 80, 10 * 60 * 1000)) {
            return NextResponse.json({ ok: true }); // soft-drop abuse
        }

        const body = await request.json().catch(() => ({}));
        const handle = normalizeHandle(body.handle);
        const kind = body.kind === 'link' ? 'link' : body.kind === 'support' ? 'support' : null;
        if (!handle || !kind) {
            return NextResponse.json({ error: 'Bad request' }, { status: 400 });
        }

        const org = await pool.query(
            `SELECT id FROM organizers WHERE handle = $1 LIMIT 1`,
            [handle]
        );
        if (!org.rows[0]) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        const organizerId = org.rows[0].id as string;

        if (kind === 'support') {
            await pool.query(
                `UPDATE organizers
                 SET support_click_count = COALESCE(support_click_count, 0) + 1
                 WHERE id = $1`,
                [organizerId]
            );
        } else {
            const linkId = typeof body.linkId === 'string' ? body.linkId : '';
            if (!linkId) {
                return NextResponse.json({ error: 'Missing linkId' }, { status: 400 });
            }
            await pool.query(
                `UPDATE organizer_hub_links
                 SET click_count = COALESCE(click_count, 0) + 1
                 WHERE id = $1 AND organizer_id = $2`,
                [linkId, organizerId]
            );
        }

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error('[hub/click]', e);
        return NextResponse.json({ ok: true });
    }
}
