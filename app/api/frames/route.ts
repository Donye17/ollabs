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
        const sort = searchParams.get('sort');
        const likedBy = searchParams.get('liked_by');

        // Check auth for 'liked_by_user' field
        const session = await auth.api.getSession({ headers: await headers() });
        const currentUserId = session?.user?.id;

        const queryParams: any[] = [];

        // Base Query Structure
        let selectClause = `SELECT f.*`;
        let joinClause = ``;
        let whereClause = `WHERE (f.is_public = true`;
        let paramIndex = 1; // PostgreSQL params start at $1

        // 1. Current User Logic (for 'liked_by_user' access and private frames)
        if (currentUserId) {
            queryParams.push(currentUserId);
            // Check if current user liked the frame
            selectClause += `, CASE WHEN l.user_id IS NOT NULL THEN true ELSE false END as liked_by_user`;
            // Join for 'liked_by_user' check
            joinClause += ` LEFT JOIN frame_likes l ON f.id = l.frame_id AND l.user_id = $${paramIndex}`;
            // Allow creator to see their own private frames
            whereClause += ` OR f.creator_id = $${paramIndex}`;
            paramIndex++;
        } else {
            selectClause += `, false as liked_by_user`;
        }

        // Close initial public/private permission check
        whereClause += `)`;

        // 2. Filter by "Liked By" (e.g. show my liked frames)
        if (likedBy) {
            queryParams.push(likedBy);
            joinClause += ` INNER JOIN frame_likes filter_likes ON f.id = filter_likes.frame_id AND filter_likes.user_id = $${paramIndex}`;
            paramIndex++;
        }

        let query = `${selectClause} FROM frames f ${joinClause} ${whereClause}`;

        // 3. Other Filters
        if (id) {
            query += ` AND f.id = $${paramIndex}`;
            queryParams.push(id);
            paramIndex++;
        } else if (creatorId) {
            query += ` AND f.creator_id = $${paramIndex}`;
            queryParams.push(creatorId);
            paramIndex++;
        }

        if (search) {
            query += ` AND f.name ILIKE $${paramIndex}`;
            queryParams.push(`%${search}%`);
            paramIndex++;
        }

        if (tag) {
            query += ` AND (f.description ILIKE $${paramIndex} OR f.config::text ILIKE $${paramIndex})`;
            queryParams.push(`%${tag}%`);
            paramIndex++;
        }

        if (sort === 'trending') {
            // Sort by likes_count DESC, recent first
            query += ` AND f.created_at > NOW() - INTERVAL '7 days' ORDER BY f.likes_count DESC, f.created_at DESC LIMIT $${paramIndex}`;
        } else {
            query += ` ORDER BY f.created_at DESC LIMIT $${paramIndex}`;
        }
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
        const { name, description, config, creator_id, creator_name, is_public, parent_id } = body;

        // TODO: Add server-side auth validation here (using Request Headers or Cookie)

        const result = await pool.query(
            `INSERT INTO frames (name, description, config, creator_id, creator_name, is_public, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, name, created_at`,
            [name, description, JSON.stringify(config), creator_id, creator_name, is_public]
        );

        const newFrame = result.rows[0];

        // NOTIFICATION LOGIC: Remix
        if (parent_id) {
            try {
                // 1. Get parent frame creator
                const parentResult = await pool.query(
                    'SELECT created_by, name FROM frames WHERE id = $1',
                    [parent_id]
                );

                if (parentResult.rows.length > 0) {
                    const originalCreatorId = parentResult.rows[0].created_by;
                    const originalFrameName = parentResult.rows[0].name;

                    // 2. Insert notification if not self-remix
                    if (originalCreatorId && originalCreatorId !== creator_id) {
                        await pool.query(
                            `INSERT INTO notifications (user_id, actor_id, type, entity_id, metadata)
                             VALUES ($1, $2, 'remix', $3, $4)`,
                            [
                                originalCreatorId,
                                creator_id,
                                newFrame.id, // Link to the NEW frame so they can see what was made
                                JSON.stringify({
                                    actor_name: creator_name,
                                    frame_name: originalFrameName,
                                    new_frame_name: newFrame.name
                                })
                            ]
                        );
                    }
                }
            } catch (err) {
                console.error("Failed to send remix notification", err);
                // Don't fail the request
            }
        }

        return NextResponse.json(newFrame);
    } catch (error) {
        console.error('Failed to create frame:', error);
        return NextResponse.json(
            { error: 'Failed to create frame' },
            { status: 500 }
        );
    }
}
