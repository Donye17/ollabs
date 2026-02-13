import { pool } from '@/lib/neon';
import { FrameConfig, FrameType } from '@/lib/types';
import { cache } from 'react';

export interface FrameData {
    id: string;
    name: string;
    description: string | null;
    config: FrameConfig;
    creator_id: string;
    creator_name: string;
    created_at: Date;
    tags: string[];
    likes_count: number;
    preview_url: string | null;
    media_type: string;
    is_public: boolean;
    creator_verified: boolean;
    liked_by_user?: boolean;
}

// Cache the result for the duration of the request
export const getFrameById = cache(async (id: string): Promise<FrameData | null> => {
    try {
        const query = `
            SELECT 
                f.id, 
                f.name, 
                f.description, 
                f.config, 
                f.creator_id, 
                f.creator_name, 
                f.created_at, 
                f.tags, 
                f.likes_count, 
                f.preview_url, 
                f.media_type, 
                f.is_public, 
                u.isVerified as creator_verified
            FROM frames f
            LEFT JOIN "user" u ON f.creator_id = u.id
            WHERE f.id = $1
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];

        // Parse config if it's a string (it might be jsonb which pg returns as object, but just in case)
        const config = typeof row.config === 'string' ? JSON.parse(row.config) : row.config;

        return {
            ...row,
            config
        };
    } catch (error) {
        console.error('Error fetching frame by ID:', error);
        return null;
    }
});
