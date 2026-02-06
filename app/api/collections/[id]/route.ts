
import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({ headers: await headers() });
        const currentUserId = session?.user?.id;

        // Fetch collection details
        const collectionResult = await pool.query('SELECT * FROM collections WHERE id = $1', [id]);

        if (collectionResult.rows.length === 0) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }

        const collection = collectionResult.rows[0];

        // Check visibility
        if (!collection.is_public && collection.user_id !== currentUserId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch items
        const itemsResult = await pool.query(`
            SELECT f.*, ci.added_at
            FROM collection_items ci
            JOIN frames f ON f.id = ci.frame_id
            WHERE ci.collection_id = $1
            ORDER BY ci.added_at DESC
        `, [id]);

        return NextResponse.json({
            ...collection,
            items: itemsResult.rows.map(row => ({
                ...row,
                config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config
            }))
        });

    } catch (error) {
        console.error('Failed to fetch collection details:', error);
        return NextResponse.json({ error: 'Failed to fetch collection details' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ownership
        const collection = await pool.query('SELECT user_id FROM collections WHERE id = $1', [id]);
        if (collection.rows.length === 0) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }
        if (collection.rows[0].user_id !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Delete collection (cascade will handle items)
        await pool.query('DELETE FROM collections WHERE id = $1', [id]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Failed to delete collection:', error);
        return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
    }
}
