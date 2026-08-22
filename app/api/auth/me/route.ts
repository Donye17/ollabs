import { NextRequest, NextResponse } from 'next/server';
import { getSessionOrganizer } from '@/lib/auth';
import { pool } from '@/lib/neon';

export const dynamic = 'force-dynamic';

// GET /api/auth/me
//
// Cheap "is anyone signed in" check for client components that need to decide
// what to render before doing any real work. Returns the address and optional
// hub handle, never anything about the account's campaigns.
export async function GET(request: NextRequest) {
    const organizer = await getSessionOrganizer(request);
    if (!organizer) return NextResponse.json({ signedIn: false }, { status: 401 });

    let handle: string | null = null;
    try {
        const res = await pool.query(
            `SELECT handle FROM organizers WHERE id = $1 LIMIT 1`,
            [organizer.id]
        );
        handle = (res.rows[0]?.handle as string | null) ?? null;
    } catch {
        /* ignore — hub columns may be missing before migration 0013 */
    }

    return NextResponse.json({ signedIn: true, email: organizer.email, handle });
}
