import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { isValidEmail, normalizeEmail } from '@/lib/email';
import {
    claimCampaignsByEmail,
    constantTimeEqual,
    createSession,
    isValidCode,
    MAX_CODE_ATTEMPTS,
    setSessionCookie,
    sha256Hex,
    upsertOrganizer,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/auth/verify, body { email, code }
//
// On success: creates the organizer if needed, signs them in, and attaches
// every campaign that was created with this address. That last step is the
// point of the whole feature. An organizer who typed their email at publish
// gets everything back on first sign-in without touching a recovery link.
export async function POST(request: NextRequest) {
    const badCode = NextResponse.json(
        { error: 'That code is not right, or it has expired. Request a new one.' },
        { status: 400 }
    );

    try {
        if (!rateLimit(`authverify:${clientIp(request)}`, 15, 15 * 60 * 1000)) {
            return NextResponse.json(
                { error: 'Too many attempts. Please wait a few minutes.' },
                { status: 429 }
            );
        }

        const body = await request.json().catch(() => ({}));
        if (!isValidEmail(body?.email) || !isValidCode(body?.code)) {
            return badCode;
        }
        const email = normalizeEmail(body.email);
        const code = String(body.code).trim();

        const found = await pool.query(
            `SELECT id, code_hash, attempts
             FROM organizer_login_codes
             WHERE email = $1 AND used_at IS NULL AND expires_at > NOW()
             ORDER BY created_at DESC
             LIMIT 1`,
            [email]
        );
        const row = found.rows[0];
        if (!row) return badCode;

        // Count the attempt before checking it, so a crash mid-request cannot be
        // used to get a free guess.
        const bumped = await pool.query(
            `UPDATE organizer_login_codes SET attempts = attempts + 1
             WHERE id = $1 RETURNING attempts`,
            [row.id]
        );
        const attempts: number = bumped.rows[0]?.attempts ?? MAX_CODE_ATTEMPTS + 1;
        if (attempts > MAX_CODE_ATTEMPTS) {
            await pool.query(`UPDATE organizer_login_codes SET used_at = NOW() WHERE id = $1`, [row.id]);
            return NextResponse.json(
                { error: 'Too many wrong codes. Request a new one.' },
                { status: 429 }
            );
        }

        const attemptHash = await sha256Hex(code);
        if (!constantTimeEqual(attemptHash, row.code_hash)) return badCode;

        await pool.query(`UPDATE organizer_login_codes SET used_at = NOW() WHERE id = $1`, [row.id]);

        const organizer = await upsertOrganizer(email);
        const claimed = await claimCampaignsByEmail(organizer.id, email);
        const token = await createSession(organizer.id);

        const response = NextResponse.json({ ok: true, email: organizer.email, claimed });
        setSessionCookie(response, token);
        return response;
    } catch (error) {
        console.error('Failed to verify login code:', error);
        return NextResponse.json({ error: 'Could not sign you in. Please try again.' }, { status: 500 });
    }
}
