import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { isValidEmail, normalizeEmail, recoveryEmail, sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// POST /api/recover, body { email }
//
// Always responds with the same success shape whether or not the address has
// campaigns. Telling an anonymous caller "no campaigns for that email" turns
// this endpoint into a way to test whether someone used Ollabs.
export async function POST(request: NextRequest) {
    const generic = NextResponse.json({
        ok: true,
        message: 'If that email has campaigns, a link is on its way.',
    });

    try {
        if (!rateLimit(`recover:${clientIp(request)}`, 5, 15 * 60 * 1000)) {
            return NextResponse.json(
                { error: 'Too many recovery requests. Please wait a few minutes.' },
                { status: 429 }
            );
        }

        const body = await request.json().catch(() => ({}));
        if (!isValidEmail(body?.email)) {
            return NextResponse.json({ error: 'That email address does not look right.' }, { status: 400 });
        }
        const email = normalizeEmail(body.email);

        const found = await pool.query(
            `SELECT COUNT(*)::int AS n FROM campaigns WHERE organizer_email = $1`,
            [email]
        );
        const count: number = found.rows[0]?.n ?? 0;
        if (count === 0) return generic;

        const token = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '');
        await pool.query(
            `INSERT INTO campaign_recovery_tokens (token, email, created_at, expires_at)
             VALUES ($1, $2, NOW(), NOW() + INTERVAL '24 hours')`,
            [token, email]
        );

        const msg = recoveryEmail({ token, count });
        await sendEmail({ to: email, ...msg });
        return generic;
    } catch (error) {
        console.error('Failed to start recovery:', error);
        // Still generic: a database hiccup should not reveal anything either.
        return generic;
    }
}
