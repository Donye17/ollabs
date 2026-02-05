import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const creatorId = searchParams.get('creator_id');
        const id = searchParams.get('id');
        const search = searchParams.get('search');
        const tag = searchParams.get('tag');

        // Check auth for 'liked_by_user' field
        const session = await auth.api.getSession({ headers: await headers() });
        const currentUserId = session?.user?.id;

        let query = `
            SELECT 
                f.*, 
                ${currentUserId ? `CASE WHEN l.user_id IS NOT NULL THEN true ELSE false END as liked_by_user` : 'false as liked_by_user'}
            FROM frames f
            ${currentUserId ? `LEFT JOIN likes l ON f.id = l.frame_id AND l.user_id = $1` : ''}
            WHERE (f.is_public = true ${currentUserId ? `OR f.creator_id = $1` : ''})
        `;

        const queryParams: any[] = [];
        if (currentUserId) queryParams.push(currentUserId);


        if (id) {
            query += ` AND f.id = $${queryParams.length + 1}`;
            queryParams.push(id);
        } else if (creatorId) {
            query += ` AND f.creator_id = $${queryParams.length + 1}`;
            queryParams.push(creatorId);
        }

        if (search) {
            query += ` AND f.name ILIKE $${queryParams.length + 1}`;
            queryParams.push(`%${search}%`);
        }

        if (tag) {
            // MVP Tag search: Look in description or config
            query += ` AND (f.description ILIKE $${queryParams.length + 1} OR f.config::text ILIKE $${queryParams.length + 1})`;
            queryParams.push(`%${tag}%`);
        }

        query += ` ORDER BY f.created_at DESC LIMIT $${queryParams.length + 1}`;
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
