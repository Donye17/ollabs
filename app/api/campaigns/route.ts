import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { CATEGORY_KEYS } from '@/lib/categories';

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

function ownerToken(): string {
    return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '');
}

// GET /api/campaigns, list public campaigns, newest first
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
        const result = await pool.query(
            `SELECT id, slug, title, description, frame_config, creator_name, supporter_count, created_at
             FROM campaigns
             WHERE is_public = true AND is_hidden IS NOT TRUE
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

// POST /api/campaigns, create a campaign (anonymous-first; attaches creator if signed in)
export async function POST(request: NextRequest) {
    try {
        // Best-effort abuse throttle: 12 new campaigns per 10 minutes per client.
        if (!rateLimit(`create:${clientIp(request)}`, 12, 10 * 60 * 1000)) {
            return NextResponse.json({ error: 'You are creating campaigns too fast. Please wait a minute and try again.' }, { status: 429 });
        }

        const body = await request.json();
        const { title, description, frameConfig, isPublic, previewUrl, goal, category } = body;
        const categoryValue = typeof category === 'string' && CATEGORY_KEYS.includes(category) ? category : null;

        if (!title || !frameConfig) {
            return NextResponse.json({ error: 'title and frameConfig are required' }, { status: 400 });
        }

        // Optional supporter goal.
        let goalValue: number | null = null;
        if (goal != null && goal !== '') {
            const g = Math.floor(Number(goal));
            if (!Number.isFinite(g) || g < 1 || g > 100_000_000) {
                return NextResponse.json({ error: 'Goal must be a number between 1 and 100,000,000.' }, { status: 400 });
            }
            goalValue = g;
        }

        // Input caps to keep payloads sane and block junk.
        if (typeof title !== 'string' || title.length > 120) {
            return NextResponse.json({ error: 'Title is too long (max 120 characters).' }, { status: 400 });
        }
        if (description != null && (typeof description !== 'string' || description.length > 400)) {
            return NextResponse.json({ error: 'Description is too long (max 400 characters).' }, { status: 400 });
        }
        const frameJson = JSON.stringify(frameConfig);
        if (frameJson.length > 200_000) {
            return NextResponse.json({ error: 'Frame data is too large.' }, { status: 400 });
        }

        // Anonymous-first: campaigns are created without an account.
        const creatorId = null;
        const creatorName = 'Anonymous';

        const baseSlug = slugify(title);
        const token = ownerToken();

        let campaign = null;
        for (let attempt = 0; attempt < 5; attempt++) {
            const slug = `${baseSlug}-${randomSuffix()}`;
            try {
                const result = await pool.query(
                    `INSERT INTO campaigns (slug, title, description, frame_config, creator_id, creator_name, is_public, preview_url, owner_token, goal, category, created_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
                     RETURNING id, slug, title, supporter_count, owner_token, created_at`,
                    [slug, title, description ?? null, frameJson, creatorId, creatorName, isPublic !== false, previewUrl ?? null, token, goalValue, categoryValue]
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
