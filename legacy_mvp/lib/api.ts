import { authClient } from "./auth-client";

const API_URL = import.meta.env.VITE_NEON_DATA_API_URL;

interface QueryResult<T> {
    result: T[];
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const session = await authClient.getSession();
    const token = session.data?.session?.token; // Try to get token if exposed, otherwise generic fetch

    // Note: For now we assume public read or specific auth headers handled by Better Auth hook if integrated deep.
    // Better Auth acts as the issuer. The Data API expects a Bearer token.
    // We need to extract the token from the session or storage.
    // Implementation detail: Better Auth stores token in cookie or local storage.

    // For this MVP, we will try to just fetch. RLS might block us if not handled.

    const response = await fetch(`${API_URL}/sql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
            query: sql,
            params: params
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Database Error: ${err}`);
    }

    const data = await response.json();
    return data.result;
}

// Social Features
export async function getFrameLikes(frameId: string) {
    return query(`SELECT COUNT(*) as count FROM frame_likes WHERE frame_id = $1`, [frameId]);
}

export async function hasUserLikedFrame(frameId: string, userId: string) {
    const result = await query(`SELECT 1 FROM frame_likes WHERE frame_id = $1 AND user_id = $2`, [frameId, userId]);
    return result.length > 0;
}

export async function toggleLikeFrame(frameId: string, userId: string) {
    // Check if liked first
    const hasLiked = await hasUserLikedFrame(frameId, userId);

    if (hasLiked) {
        // Unlike
        await query(`DELETE FROM frame_likes WHERE frame_id = $1 AND user_id = $2`, [frameId, userId]);
        return false;
    } else {
        // Like
        await query(`INSERT INTO frame_likes (frame_id, user_id) VALUES ($1, $2)`, [frameId, userId]);
        return true;
    }
}

export async function getFrameComments(frameId: string) {
    // Join with user_profiles to get name/avatar
    // Note: We use LEFT JOIN in case the user profile is missing for some reason
    return query(`
        SELECT c.*, u.name as user_name, u.image as user_image 
        FROM frame_comments c 
        LEFT JOIN user_profiles u ON c.user_id = u.id 
        WHERE c.frame_id = $1 
        ORDER BY c.created_at ASC
    `, [frameId]);
}

export async function addFrameComment(frameId: string, userId: string, content: string) {
    return query(`
        INSERT INTO frame_comments (frame_id, user_id, content) 
        VALUES ($1, $2, $3) 
        RETURNING *
    `, [frameId, userId, content]);
}
