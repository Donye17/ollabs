import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    try {
        const result = await pool.query(
            `SELECT * FROM notifications 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT 50`,
            [userId]
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Notifications fetch error", error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    // Mark as read logic
    try {
        const { notificationIds } = await request.json();

        if (!notificationIds || !Array.isArray(notificationIds)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        await pool.query(
            `UPDATE notifications SET read = TRUE WHERE id = ANY($1)`,
            [notificationIds]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Mark read error", error);
        return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
    }
}
