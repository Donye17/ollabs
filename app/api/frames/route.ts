import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const creatorId = searchParams.get('creator_id');

        let query = `SELECT * FROM frames WHERE is_public = true`;
        const queryParams: any[] = [];

        if (creatorId) {
            query += ` AND creator_id = $${queryParams.length + 1}`;
            queryParams.push(creatorId);
        }

        query += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1}`;
        queryParams.push(limit);

        const result = await pool.query(query, queryParams);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Failed to fetch frames:', error);
        return NextResponse.json(
            { error: 'Failed to fetch frames' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, config, creator_id, creator_name, is_public } = body;

        // TODO: Add server-side auth validation here (using Request Headers or Cookie)

        const result = await pool.query(
            `INSERT INTO frames (name, description, config, creator_id, creator_name, is_public, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, name, created_at`,
            [name, description, JSON.stringify(config), creator_id, creator_name, is_public]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Failed to create frame:', error);
        return NextResponse.json(
            { error: 'Failed to create frame' },
            { status: 500 }
        );
    }
}
