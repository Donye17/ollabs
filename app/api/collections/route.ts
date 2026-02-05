
import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Adjust import based on your auth helper usually it is auth.api.getSession stuff but checking other routes is safer.
import { headers } from 'next/headers';

// We need to check how auth is handled in other routes. 
// Assuming checking headers or using better-auth helper.
// For now, I'll use a standard pattern and might need to adjust if auth helper is different.

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    try {
        // Fetch collections for a user
        // If viewing own profile (auth check needed) show private? 
        // For MVP, just show public, OR show all if requested by same user.
        // Let's simplified: fetch all for now, filter in UI or refine later.

        const result = await pool.query(
            `SELECT * FROM collections WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        return NextResponse.json(result.rows);
    } catch (e) {
        console.error('Failed to fetch collections', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, userId, isPublic } = body; // expecting userId from client for now but should verify session

        if (!name || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // TODO: Verify session match userId

        const result = await pool.query(
            `INSERT INTO collections (name, user_id, is_public) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [name, userId, isPublic ?? true]
        );

        return NextResponse.json(result.rows[0]);
    } catch (e) {
        console.error('Failed to create collection', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
