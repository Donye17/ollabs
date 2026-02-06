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
        let selectClause = `SELECT f.id, f.name, f.description, f.config, f.creator_id, f.creator_name, f.created_at, f.tags, f.likes_count, f.preview_url, f.media_type, f.is_public, u.isVerified as creator_verified`;
        let joinClause = ` LEFT JOIN "user" u ON f.creator_id = u.id`;
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
            // Updated to search name, description, and tags
            query += ` AND (f.name ILIKE $${paramIndex} OR f.description ILIKE $${paramIndex} OR f.tags @> $${paramIndex + 1} OR f.tags::text ILIKE $${paramIndex})`;
            queryParams.push(`%${search}%`);
            // For simple text search in tags, we can use the text cast, but @> expects an array literal which is hard with partial matches
            // Actually, for partial search in tags (scanned as text), filtering by text cast is easiest for "contains substring" logic
            // But let's keep it simple: Name OR Description OR Tag (Array Match) is tricky with partials.
            // Let's just do Name OR Description OR Tags cast to text (for partial match like 'eo' in 'neon')

            // Re-doing the query logic for cleaner parameters:
            // We use $paramIndex for '%search%'
            // We'll use a separate param for the array check if we wanted exact match, but for a general "search box" partial match is usually expected.
            // So: name ILIKE %s% OR description ILIKE %s% OR tags::text ILIKE %s%
        }

        if (tag) {
            // Updated to search both the explicit 'tags' array OR the description/config for backwards compatibility
            // $paramIndex is for the LIKE search (%tag%), $paramIndex+1 is for Array contains query
            query += ` AND (f.tags @> $${paramIndex} OR f.description ILIKE $${paramIndex + 1} OR f.config::text ILIKE $${paramIndex + 1})`;
            // For array contains logic: '{tag}'
            queryParams.push(`{${tag}}`);
            // For text search logic: '%tag%'
            queryParams.push(`%${tag}%`);
            paramIndex += 2;
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
        const { name, description, config, creator_id, creator_name, is_public, parent_id, tags, preview_url, media_type } = body;

        // Ensure tags is a valid array of strings or empty
        const safeTags = Array.isArray(tags) ? tags : [];

        // TODO: Add server-side auth validation here (using Request Headers or Cookie)

        const result = await pool.query(
            `INSERT INTO frames (name, description, config, creator_id, creator_name, is_public, created_at, tags, preview_url, media_type)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9)
       RETURNING id, name, created_at, tags, preview_url, media_type`,
            [name, description, JSON.stringify(config), creator_id, creator_name, is_public, safeTags, preview_url || null, media_type || 'image/png']
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
