import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const frameId = searchParams.get('frameId');
    const userId = searchParams.get('userId');

    if (!frameId) return NextResponse.json({ error: 'Missing frameId' }, { status: 400 });

    try {
        // Get count
        const countResult = await pool.query(
            `SELECT COUNT(*) as count FROM frame_likes WHERE frame_id = $1`,
            [frameId]
        );

        // Get user status if userId is provided
        let userLiked = false;
        if (userId) {
            const userResult = await pool.query(
                `SELECT 1 FROM frame_likes WHERE frame_id = $1 AND user_id = $2`,
                [frameId, userId]
            );
            userLiked = userResult.rows.length > 0;
        }

        return NextResponse.json({
            count: parseInt(countResult.rows[0].count),
            userLiked
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { frameId, userId } = await request.json();

        if (!frameId || !userId) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

        // Check if exists
        const check = await pool.query(
            `SELECT 1 FROM frame_likes WHERE frame_id = $1 AND user_id = $2`,
            [frameId, userId]
        );

        if (check.rows.length > 0) {
            // Unlike
            await pool.query(
                `DELETE FROM frame_likes WHERE frame_id = $1 AND user_id = $2`,
                [frameId, userId]
            );
            return NextResponse.json({ liked: false });
        } else {
            // Like
            await pool.query(
                `INSERT INTO frame_likes (frame_id, user_id, created_at) VALUES ($1, $2, NOW())`,
                [frameId, userId]
            );

            // Fetch Frame Creator info
            const frameResult = await pool.query(
                `SELECT created_by, name FROM frames WHERE id = $1`,
                [frameId]
            );

            if (frameResult.rows.length > 0) {
                const creatorId = frameResult.rows[0].created_by;
                const frameName = frameResult.rows[0].name;

                // Insert Notification (if not self-like)
                if (creatorId && creatorId !== userId) {
                    // Extract extra user info from request if available, or just leave it generic
                    const { userName, userImage } = await request.clone().json().catch(() => ({}));

                    // Check if notification already exists for this like (debounce)
                    const notifCheck = await pool.query(
                        `SELECT 1 FROM notifications 
                         WHERE user_id = $1 AND actor_id = $2 AND type = 'like' AND entity_id = $3`,
                        [creatorId, userId, frameId]
                    );

                    if (notifCheck.rows.length === 0) {
                        await pool.query(
                            `INSERT INTO notifications (user_id, actor_id, type, entity_id, metadata)
                             VALUES ($1, $2, 'like', $3, $4)`,
                            [
                                creatorId,
                                userId,
                                frameId,
                                JSON.stringify({
                                    actor_name: userName || 'Someone',
                                    actor_image: userImage,
                                    frame_name: frameName
                                })
                            ]
                        );
                    }
                }
            }

            return NextResponse.json({ liked: true });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
    }
}
