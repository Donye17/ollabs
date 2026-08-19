import { NextRequest, NextResponse } from 'next/server';
import { getSessionOrganizer } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/auth/me
//
// Cheap "is anyone signed in" check for client components that need to decide
// what to render before doing any real work. Returns the address only, never
// anything about the account's campaigns.
export async function GET(request: NextRequest) {
    const organizer = await getSessionOrganizer(request);
    if (!organizer) return NextResponse.json({ signedIn: false }, { status: 401 });
    return NextResponse.json({ signedIn: true, email: organizer.email });
}
