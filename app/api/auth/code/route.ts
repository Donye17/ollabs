import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { isValidEmail, normalizeEmail, loginCodeEmail, sendEmail } from '@/lib/email';
import { newLoginCode, sha256Hex, CODE_TTL_MINUTES } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/auth/code, body { email }
//
// Mails a six digit sign-in code. Always answers with the same shape whether or
// not the address is known, for the same reason /api/recover does: a different
// answer would turn this into a way to test who has used Ollabs.
export async function POST(request: NextRequest) {
    const generic = NextResponse.json({
        ok: true,
        message: 'If that address can receive mail, a code is on its way.',
    });

    try {
        // Two limits. The IP limit blunts someone walking a list of addresses,
        // the per-address limit stops Ollabs being used to mailbomb one person.
        if (!rateLimit(`authcode:ip:${clientIp(request)}`, 10, 60 * 60 * 1000)) {
            return NextResponse.json(
                { error: 'Too many sign-in requests. Please wait a few minutes.' },
                { status: 429 }
            );
        }

        const body = await request.json().catch(() => ({}));
        if (!isValidEmail(body?.email)) {
            return NextResponse.json({ error: 'That email address does not look right.' }, { status: 400 });
        }
        const email = normalizeEmail(body.email);

        if (!rateLimit(`authcode:email:${email}`, 5, 15 * 60 * 1000)) {
            return generic;
        }

        const code = newLoginCode();
        const codeHash = await sha256Hex(code);

        // Retire any outstanding codes for this address first, so only the most
        // recent mail works. Otherwise asking for a second code leaves the first
        // one live and doubles the guessing surface.
        await pool.query(
            `UPDATE organizer_login_codes SET used_at = NOW()
             WHERE email = $1 AND used_at IS NULL`,
            [email]
        );
        await pool.query(
            `INSERT INTO organizer_login_codes (email, code_hash, created_at, expires_at)
             VALUES ($1, $2, NOW(), NOW() + ($3 || ' minutes')::interval)`,
            [email, codeHash, String(CODE_TTL_MINUTES)]
        );

        const msg = loginCodeEmail({ code, minutes: CODE_TTL_MINUTES });
        await sendEmail({ to: email, ...msg });
        return generic;
    } catch (error) {
        console.error('Failed to send login code:', error);
        // Generic here too: a database hiccup should not reveal anything either.
        return generic;
    }
}
