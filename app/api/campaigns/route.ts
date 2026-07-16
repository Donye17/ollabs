import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function slugify(input: string): string {
    const base = (input || '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);
    return base || 'campaign';
}

function randomSuffix(len = 4): string {
    return Math.random().toString(36).slice(2, 2 + len);
}

// GET /api/campaigns — list public campaigns, newest first
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
        const result = await pool.query(
            `SELECT id, slug, title, description, frame_config, creator_name, supporter_count, created_at
             FROM campaigns
             WHERE is_public = true
             ORDER BY created_at DESC
             LIMIT $1`,
            [limit]
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Failed to list campaigns:', error);
        return NextResponse.json({ error: 'Failed to list campaigns' }, { status: 500 });
    }
}

// POST /api/campaigns — create a campaign (anonymous-first; attaches creator if signed in)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, frameConfig, isPublic, previewUrl } = body;

        if (!title || !frameConfig) {
            return NextResponse.json({ error: 'title and frameConfig are required' }, { status: 400 });
        }

        // Anonymous-first: campaigns are created without an account.
        const creatorId = null;
        const creatorName = 'Anonymous';

        const baseSlug = slugify(title);

        let campaign = null;
        for (let attempt = 0; attempt < 5; attempt++) {
            const slug = `${baseSlug}-${randomSuffix()}`;
            try {
                const result = await pool.query(
                    `INSERT INTO campaigns (slug, title, description, frame_config, creator_id, creator_name, is_public, preview_url, created_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
                     RETURNING id, slug, title, supporter_count, created_at`,
                    [slug, title, description ?? null, JSON.stringify(frameConfig), creatorId, creatorName, isPublic !== false, previewUrl ?? null]
                );
                campaign = result.rows[0];
                break;
            } catch (e: any) {
                // 23505 = unique_violation on slug; retry with a fresh suffix
                if (e?.code === '23505') continue;
                throw e;
            }
        }

        if (!campaign) {
            return NextResponse.json({ error: 'Could not generate a unique link, please try again' }, { status: 409 });
        }

        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        console.error('Failed to create campaign:', error);
        return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
    }
}
