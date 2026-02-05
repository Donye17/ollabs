import { pool } from '@/lib/neon';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id: frameId } = await params;
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Check if already liked
            const check = await client.query(
                'SELECT * FROM likes WHERE user_id = $1 AND frame_id = $2',
                [userId, frameId]
            );

            let isLiked = false;
            let newCount = 0;

            if (check.rows.length > 0) {
                // UNLIKE
                await client.query(
                    'DELETE FROM likes WHERE user_id = $1 AND frame_id = $2',
                    [userId, frameId]
                );
                await client.query(
                    'UPDATE frames SET likes_count = likes_count - 1 WHERE id = $1',
                    [frameId]
                );
                isLiked = false;
            } else {
                // LIKE
                await client.query(
                    'INSERT INTO likes (user_id, frame_id) VALUES ($1, $2)',
                    [userId, frameId]
                );
                await client.query(
                    'UPDATE frames SET likes_count = likes_count + 1 WHERE id = $1',
                    [frameId]
                );
                isLiked = true;
            }

            // Get updated count
            const countResult = await client.query('SELECT likes_count FROM frames WHERE id = $1', [frameId]);
            newCount = countResult.rows[0]?.likes_count || 0;

            await client.query('COMMIT');

            return NextResponse.json({
                success: true,
                liked: isLiked,
                likes_count: newCount
            });

        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Like toggle failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    // Check if current user likes this frame
    // This is optional if we fetch it in bulk, but good for specific checks
    const { id: frameId } = await params;
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json({ liked: false });
    }

    const result = await pool.query(
        'SELECT 1 FROM likes WHERE user_id = $1 AND frame_id = $2',
        [session.user.id, frameId]
    );

    return NextResponse.json({ liked: result.rows.length > 0 });
}
