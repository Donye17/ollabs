import { pool } from '@/lib/neon';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, bio, location, website, social_links } = body;

        // Basic validation
        if (name && name.length > 50) {
            return NextResponse.json({ error: 'Name too long' }, { status: 400 });
        }
        if (bio && bio.length > 300) {
            return NextResponse.json({ error: 'Bio too long' }, { status: 400 });
        }

        // Update user
        // Using "user" or "users" based on context, better-auth usually defaults to "user"
        // We'll trust our migration script found "user"
        const query = `
            UPDATE "user" 
            SET name = COALESCE($1, name),
                bio = COALESCE($2, bio),
                location = COALESCE($3, location),
                website = COALESCE($4, website),
                social_links = COALESCE($5, social_links)
            WHERE id = $6
            RETURNING *
        `;

        const result = await pool.query(query, [
            name,
            bio,
            location,
            website,
            social_links ? JSON.stringify(social_links) : null,
            session.user.id
        ]);

        return NextResponse.json({ success: true, user: result.rows[0] });

    } catch (error) {
        console.error('Profile update failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
