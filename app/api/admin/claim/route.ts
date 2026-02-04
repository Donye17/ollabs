import { auth } from "@/lib/auth";
import { pool } from "@/lib/neon";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    // 1. Verify Secret Key (Hardcoded for bootstrapping)
    if (secret !== 'ollabs-2026-master-key') {
        return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
    }

    // 2. Get Current Session
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: 'You must be logged in to claim admin' }, { status: 401 });
    }

    // 3. Promote User
    try {
        // We use raw SQL because we are bypassing auth lib for this specific operation
        const table = session.user.email ? 'user' : 'users'; // Try to be robust
        await pool.query(`UPDATE "user" SET role = 'admin' WHERE id = $1`, [session.user.id]);

        return NextResponse.json({
            status: 'success',
            message: `User ${session.user.email} promoted to ADMIN.`,
            user: session.user
        });
    } catch (e: any) {
        // Fallback for table name
        if (e.message?.includes('does not exist')) {
            await pool.query(`UPDATE users SET role = 'admin' WHERE id = $1`, [session.user.id]);
            return NextResponse.json({ status: 'success', message: 'User promoted (fallback table)' });
        }
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
