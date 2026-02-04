import { auth } from "@/lib/auth";
import { pool } from "@/lib/neon";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    // 1. Verify Secret Key (From Env)
    if (!process.env.ADMIN_CLAIM_SECRET) {
        return NextResponse.json({ error: 'Server misconfigured: ADMIN_CLAIM_SECRET not set' }, { status: 500 });
    }

    if (secret !== process.env.ADMIN_CLAIM_SECRET) {
        return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
    }

    // 2. Get Current Session
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: 'You must be logged in to claim admin' }, { status: 401 });
    }

    // 3. Promote User (Using Safe Auth API)
    try {
        await auth.api.updateUser({
            headers: await headers(),
            body: {
                role: 'admin'
            }
        });

        return NextResponse.json({
            status: 'success',
            message: `User ${session.user.email} promoted to ADMIN. Refresh your page to see admin tools.`,
            user: { ...session.user, role: 'admin' }
        });

    } catch (e: any) {
        return NextResponse.json({ error: 'Failed to update user role: ' + String(e.message) }, { status: 500 });
    }
}
