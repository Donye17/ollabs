import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { DAYS, getDay } from '@/lib/days';

export const dynamic = 'force-dynamic';

// Same shared-secret gate the rest of /api/admin uses.
function authed(request: NextRequest): boolean {
    const key = new URL(request.url).searchParams.get('key') || request.headers.get('x-admin-key') || '';
    const expected = process.env.ADMIN_KEY || '';
    return !!expected && key === expected;
}

/**
 * Day pages are cached (revalidate 3600), so without this an admin would swap
 * the artwork and then watch the old frame for up to an hour and assume it
 * had not worked.
 */
function bust(slug: string) {
    revalidatePath(`/day/${slug}`);
    revalidatePath('/day');
    revalidatePath('/');
}

// GET, every day with its current override
export async function GET(request: NextRequest) {
    if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const res = await pool.query(`SELECT slug, image_url, updated_at FROM day_frame_overrides`);
        const overrides = new Map(res.rows.map((r) => [r.slug, r]));
        return NextResponse.json(
            DAYS.map((d) => {
                const o = overrides.get(d.slug) as { image_url: string; updated_at: string } | undefined;
                return {
                    slug: d.slug,
                    name: d.name,
                    bundled: d.frame?.imageUrl ?? null,
                    color: d.colors[0]?.hex ?? '#01BEF6',
                    overrideUrl: o?.image_url ?? null,
                    updatedAt: o?.updated_at ?? null,
                };
            })
        );
    } catch (error) {
        console.error('admin day-frames list failed:', error);
        return NextResponse.json({ error: 'Failed to load day frames' }, { status: 500 });
    }
}

// POST { slug, imageUrl }, point a day at new artwork
export async function POST(request: NextRequest) {
    if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { slug, imageUrl } = await request.json();
        if (!getDay(slug)) {
            return NextResponse.json({ error: 'Unknown day' }, { status: 400 });
        }
        // Only our own blob storage, so this cannot be pointed at an arbitrary host.
        if (typeof imageUrl !== 'string' || !/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(imageUrl)) {
            return NextResponse.json({ error: 'Image must be an uploaded file.' }, { status: 400 });
        }
        await pool.query(
            `INSERT INTO day_frame_overrides (slug, image_url, updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW()`,
            [slug, imageUrl]
        );
        bust(slug);
        return NextResponse.json({ ok: true, slug, imageUrl });
    } catch (error) {
        console.error('admin day-frame set failed:', error);
        return NextResponse.json({ error: 'Failed to set frame' }, { status: 500 });
    }
}

// DELETE ?slug=, revert to whatever ships in the repo
export async function DELETE(request: NextRequest) {
    if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const slug = new URL(request.url).searchParams.get('slug') || '';
        if (!getDay(slug)) return NextResponse.json({ error: 'Unknown day' }, { status: 400 });
        await pool.query(`DELETE FROM day_frame_overrides WHERE slug = $1`, [slug]);
        bust(slug);
        return NextResponse.json({ ok: true, slug });
    } catch (error) {
        console.error('admin day-frame clear failed:', error);
        return NextResponse.json({ error: 'Failed to clear frame' }, { status: 500 });
    }
}
