
import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { frame_id } = body;

        if (!frame_id) {
            return NextResponse.json({ error: 'Frame ID is required' }, { status: 400 });
        }

        // Verify ownership
        const collection = await pool.query('SELECT user_id FROM collections WHERE id = $1', [id]);
        if (collection.rows.length === 0) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }
        if (collection.rows[0].user_id !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Add item
        await pool.query(
            `INSERT INTO collection_items (collection_id, frame_id)
             VALUES ($1, $2)
             ON CONFLICT (collection_id, frame_id) DO NOTHING`,
            [id, frame_id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to add item to collection:', error);
        return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const frameId = searchParams.get('frame_id');

        if (!frameId) {
            return NextResponse.json({ error: 'Frame ID required' }, { status: 400 });
        }

        // Verify ownership
        const collection = await pool.query('SELECT user_id FROM collections WHERE id = $1', [id]);
        if (collection.rows.length === 0) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }
        if (collection.rows[0].user_id !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Remove item
        await pool.query(
            'DELETE FROM collection_items WHERE collection_id = $1 AND frame_id = $2',
            [id, frameId]
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Failed to remove item from collection:', error);
        return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
    }
}
