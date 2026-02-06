
import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');

        // Auth check
        const session = await auth.api.getSession({ headers: await headers() });
        const currentUserId = session?.user?.id;

        if (!userId && !currentUserId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const targetUserId = userId || currentUserId;
        const isOwner = currentUserId === targetUserId;

        let query = `
            SELECT c.*, 
            (SELECT COUNT(*) FROM collection_items ci WHERE ci.collection_id = c.id) as item_count,
            (
                SELECT json_agg(json_build_object('id', f.id, 'image', f.config->>'image', 'type', f.config->>'type'))
                FROM collection_items ci
                JOIN frames f ON f.id = ci.frame_id
                WHERE ci.collection_id = c.id
                LIMIT 4
            ) as preview_frames
            FROM collections c 
            WHERE c.user_id = $1
        `;

        if (!isOwner) {
            query += ` AND c.is_public = true`;
        }

        query += ` ORDER BY c.created_at DESC`;

        const result = await pool.query(query, [targetUserId]);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Failed to fetch collections:', error);
        return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, is_public } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const result = await pool.query(
            `INSERT INTO collections (user_id, name, description, is_public)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [session.user.id, name, description || '', is_public ?? true]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Failed to create collection:', error);
        return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
    }
}
