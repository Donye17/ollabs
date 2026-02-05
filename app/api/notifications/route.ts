import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/neon';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET /api/notifications - Fetch user's notifications
export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        const result = await pool.query(
            `SELECT * FROM notifications 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT 50`,
            [userId]
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Fetch notifications error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Use a transaction to ensure all or nothing
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Mark all unread for this user as read (simple approach for "Clear All" or "Open Bell")
            // Or we could accept specific IDs. For now, let's support "mark all read" or "mark specific read"
            const body = await request.json().catch(() => ({}));
            const { id } = body; // Optional specific notification ID

            if (id) {
                await client.query(
                    `UPDATE notifications SET read = TRUE WHERE id = $1 AND user_id = $2`,
                    [id, userId]
                );
            } else {
                // Mark all as read
                await client.query(
                    `UPDATE notifications SET read = TRUE WHERE user_id = $1 AND read = FALSE`,
                    [userId]
                );
            }

            await client.query('COMMIT');
            return NextResponse.json({ success: true });
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Update notifications error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
