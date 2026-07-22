import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { CATEGORY_KEYS } from '@/lib/categories';

export const dynamic = 'force-dynamic';

function slugify(input: string): string {
    const base = (input || '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);
    return base;
}

// GET /api/campaigns/[slug]/manage?token=XXX
// Returns real stats for the owner. Requires the private owner token.
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const token = new URL(request.url).searchParams.get('token') || '';
        if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

        const result = await pool.query(
            `SELECT id, slug, title, description, frame_config, supporter_count, view_count, goal, category, preview_url, is_public, created_at
             FROM campaigns
             WHERE slug = $1 AND owner_token = $2
             LIMIT 1`,
            [slug, token]
        );
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Not found or wrong key' }, { status: 404 });
        }
        const { id, ...campaign } = result.rows[0];

        // Real daily supporter counts for the last 30 days (from each recorded use).
        let daily: { day: string; n: number }[] = [];
        try {
            const ts = await pool.query(
                `SELECT to_char(date_trunc('day', created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS day, COUNT(*)::int AS n
                 FROM campaign_uses
                 WHERE campaign_id = $1 AND created_at >= now() - interval '30 days'
                 GROUP BY 1 ORDER BY 1`,
                [id]
            );
            daily = ts.rows;
        } catch (e) {
            console.error('timeseries failed', e);
        }

        return NextResponse.json({ ...campaign, daily });
    } catch (error) {
        console.error('Failed to load manage data:', error);
        return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
    }
}

// PATCH /api/campaigns/[slug]/manage
// Body: { token, title?, description?, slug? }. Requires the owner token.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const body = await request.json().catch(() => ({}));
        const token = typeof body.token === 'string' ? body.token : '';
        if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

        // Confirm ownership first.
        const owned = await pool.query(
            `SELECT id FROM campaigns WHERE slug = $1 AND owner_token = $2 LIMIT 1`,
            [slug, token]
        );
        if (owned.rows.length === 0) {
            return NextResponse.json({ error: 'Not found or wrong key' }, { status: 404 });
        }
        const id = owned.rows[0].id;

        const sets: string[] = [];
        const values: unknown[] = [];
        let i = 1;

        if (typeof body.title === 'string' && body.title.trim()) {
            sets.push(`title = $${i++}`);
            values.push(body.title.trim().slice(0, 120));
        }
        if (typeof body.description === 'string') {
            sets.push(`description = $${i++}`);
            values.push(body.description.trim().slice(0, 400) || null);
        }
        if ('goal' in body) {
            let goalValue: number | null = null;
            if (body.goal != null && body.goal !== '') {
                const g = Math.floor(Number(body.goal));
                if (!Number.isFinite(g) || g < 1 || g > 100_000_000) {
                    return NextResponse.json({ error: 'Goal must be a number between 1 and 100,000,000.' }, { status: 400 });
                }
                goalValue = g;
            }
            sets.push(`goal = $${i++}`);
            values.push(goalValue);
        }
        if ('category' in body) {
            const cat = typeof body.category === 'string' && CATEGORY_KEYS.includes(body.category) ? body.category : null;
            sets.push(`category = $${i++}`);
            values.push(cat);
        }

        let newSlug: string | null = null;
        if (typeof body.slug === 'string' && body.slug.trim()) {
            newSlug = slugify(body.slug);
            if (!newSlug) {
                return NextResponse.json({ error: 'That link name is not valid. Use letters and numbers.' }, { status: 400 });
            }
            sets.push(`slug = $${i++}`);
            values.push(newSlug);
        }

        if (sets.length === 0) {
            return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
        }

        values.push(id);
        try {
            const result = await pool.query(
                `UPDATE campaigns SET ${sets.join(', ')} WHERE id = $${i} RETURNING slug, title, description`,
                values
            );
            return NextResponse.json(result.rows[0]);
        } catch (e: any) {
            if (e?.code === '23505') {
                return NextResponse.json({ error: 'That link name is taken. Try another.' }, { status: 409 });
            }
            throw e;
        }
    } catch (error) {
        console.error('Failed to update campaign:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
