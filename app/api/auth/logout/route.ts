import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, destroySession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/auth/logout
//
// Deletes the session row as well as the cookie, so signing out on a shared
// phone actually revokes the token rather than just forgetting it locally.
export async function POST(request: NextRequest) {
    try {
        await destroySession(request);
    } catch (error) {
        console.error('Failed to destroy session:', error);
    }
    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    return response;
}
