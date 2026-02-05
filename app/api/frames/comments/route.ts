import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const frameId = searchParams.get('frameId');

    if (!frameId) return NextResponse.json({ error: 'Missing frameId' }, { status: 400 });

    try {
        const result = await pool.query(
            `SELECT * FROM frame_comments WHERE frame_id = $1 ORDER BY created_at DESC`,
            [frameId]
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { frameId, userId, content, userName, userImage } = await request.json();

        if (!frameId || !userId || !content) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

        const result = await pool.query(
            `INSERT INTO frame_comments (frame_id, user_id, content, user_name, user_image, created_at) 
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
            [frameId, userId, content, userName, userImage]
        );

        // NOTIFICATION LOGIC
        // 1. Get frame creator
        const frameResult = await pool.query(
            'SELECT created_by, name FROM frames WHERE id = $1',
            [frameId]
        );

        if (frameResult.rows.length > 0) {
            const creatorId = frameResult.rows[0].created_by;
            const frameName = frameResult.rows[0].name;

            // 2. Insert notification if not self-comment
            if (creatorId && creatorId !== userId) {
                await pool.query(
                    `INSERT INTO notifications (user_id, actor_id, type, entity_id, metadata)
                     VALUES ($1, $2, 'comment', $3, $4)`,
                    [
                        creatorId,
                        userId,
                        frameId,
                        JSON.stringify({
                            actor_name: userName,
                            actor_image: userImage,
                            frame_name: frameName,
                            comment_preview: content.substring(0, 50)
                        })
                    ]
                );
            }
        }

        return NextResponse.json(result.rows[0]);

    } catch (error) {
        console.error("Comment error", error);
        return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
    }
}
