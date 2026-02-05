
import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const body = await request.json();
        const { frameId } = body;

        if (!frameId) {
            return NextResponse.json({ error: 'Missing frameId' }, { status: 400 });
        }

        await pool.query(
            `INSERT INTO collection_items (collection_id, frame_id) 
             VALUES ($1, $2) 
             ON CONFLICT (collection_id, frame_id) DO NOTHING`,
            [id, frameId]
        );

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Failed to add item to collection', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const result = await pool.query(
            `SELECT f.*, ci.added_at 
             FROM frames f
             JOIN collection_items ci ON f.id = ci.frame_id
             WHERE ci.collection_id = $1
             ORDER BY ci.added_at DESC`,
            [id]
        );

        return NextResponse.json(result.rows);
    } catch (e) {
        console.error('Failed to fetch collection items', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
