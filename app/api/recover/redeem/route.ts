import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { isRecoveryToken, RECOVERY_REPLAY_MINUTES } from '@/lib/recoverToken';

export const dynamic = 'force-dynamic';

type CampaignRow = {
    slug: string;
    title: string;
    owner_token: string;
    supporter_count: number;
    created_at: string;
};

/**
 * POST /api/recover/redeem, body { token }
 *
 * Marks the mailed recovery token used and returns that email's campaigns.
 * GET /recover/[token] must not call this: scanners redeem on GET.
 */
export async function POST(request: NextRequest) {
    const expired = NextResponse.json(
        { error: 'This link has expired' },
        { status: 404 }
    );

    try {
        if (!rateLimit(`recover-redeem:${clientIp(request)}`, 20, 15 * 60 * 1000)) {
            return NextResponse.json(
                { error: 'Too many attempts. Please wait a few minutes.' },
                { status: 429 }
            );
        }

        const body = await request.json().catch(() => ({}));
        const token = body?.token;
        if (!isRecoveryToken(token)) return expired;

        const claim = await pool.query(
            `UPDATE campaign_recovery_tokens
             SET used_at = COALESCE(used_at, NOW())
             WHERE token = $1
               AND expires_at > NOW()
               AND (used_at IS NULL OR used_at > NOW() - ($2 || ' minutes')::interval)
             RETURNING email`,
            [token, String(RECOVERY_REPLAY_MINUTES)]
        );
        if (claim.rowCount === 0) return expired;

        const email = claim.rows[0].email;
        const res = await pool.query(
            `SELECT slug, title, owner_token, COALESCE(supporter_count, 0) AS supporter_count, created_at
             FROM campaigns
             WHERE organizer_email = $1
             ORDER BY created_at DESC`,
            [email]
        );

        return NextResponse.json({
            ok: true,
            campaigns: res.rows as CampaignRow[],
        });
    } catch (error) {
        console.error('Recovery redemption failed:', error);
        return expired;
    }
}
