import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { CATEGORY_KEYS } from '@/lib/categories';
import { hasVisibleFrame } from '@/lib/frameValidity';
import {
    createManageSession,
    findCampaignByManageSession,
    findCampaignByOwnerToken,
    MANAGE_SESSION_COOKIE,
    manageSessionCookieOptions,
    type OwnedCampaign,
} from '@/lib/ownerToken';

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

async function resolveOwned(
    request: NextRequest,
    slug: string,
    tokenFromClient: string
): Promise<{ owned: OwnedCampaign; mintSession: boolean } | null> {
    if (tokenFromClient) {
        const byToken = await findCampaignByOwnerToken(slug, tokenFromClient);
        if (byToken) return { owned: byToken, mintSession: true };
    }

    const session = request.cookies.get(MANAGE_SESSION_COOKIE)?.value || '';
    if (session) {
        const bySession = await findCampaignByManageSession(slug, session);
        if (bySession) return { owned: bySession, mintSession: false };
    }

    return null;
}

async function withOptionalManageCookie(
    response: NextResponse,
    campaignId: string,
    mintSession: boolean
): Promise<NextResponse> {
    if (!mintSession) return response;
    try {
        const sessionToken = await createManageSession(campaignId);
        const opts = manageSessionCookieOptions(sessionToken);
        response.cookies.set(opts.name, opts.value, {
            httpOnly: opts.httpOnly,
            secure: opts.secure,
            sameSite: opts.sameSite,
            path: opts.path,
            maxAge: opts.maxAge,
        });
    } catch (e) {
        // Session table may be missing on a stale preview; manage still works via k=.
        console.error('manage session mint failed', e);
    }
    return response;
}

// GET /api/campaigns/[slug]/manage?token=XXX
// Returns real stats for the owner. Accepts owner token or manage session cookie.
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const token = new URL(request.url).searchParams.get('token') || '';

        const resolved = await resolveOwned(request, slug, token);
        if (!resolved) {
            return NextResponse.json({ error: 'Not found or wrong key' }, { status: 404 });
        }
        const { owned, mintSession } = resolved;

        const result = await pool.query(
            `SELECT id, slug, title, description, frame_config, supporter_count, view_count, goal, category, preview_url, is_public, created_at
             FROM campaigns
             WHERE id = $1
             LIMIT 1`,
            [owned.id]
        );
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Not found or wrong key' }, { status: 404 });
        }
        const { id, ...campaign } = result.rows[0];

        let daily: { day: string; n: number }[] = [];
        let countries: { country: string; n: number }[] = [];
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

        try {
            const geo = await pool.query(
                `SELECT supporter_country AS country, COUNT(*)::int AS n
                 FROM campaign_uses
                 WHERE campaign_id = $1 AND supporter_country IS NOT NULL
                 GROUP BY 1
                 ORDER BY n DESC
                 LIMIT 8`,
                [id]
            );
            countries = geo.rows;
        } catch (e) {
            console.error('country breakdown failed', e);
        }

        const response = NextResponse.json({ ...campaign, daily, countries });
        return withOptionalManageCookie(response, id, mintSession);
    } catch (error) {
        console.error('Failed to load manage data:', error);
        return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
    }
}

// PATCH /api/campaigns/[slug]/manage
// Body: { token?, title?, description?, slug? }. Requires owner token or manage session.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const body = await request.json().catch(() => ({}));
        const token = typeof body.token === 'string' ? body.token : '';

        const resolved = await resolveOwned(request, slug, token);
        if (!resolved) {
            return NextResponse.json({ error: 'Not found or wrong key' }, { status: 404 });
        }
        const id = resolved.owned.id;
        const currentSlug = resolved.owned.slug;

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

        // The frame itself is editable. Without this an owner who published a broken or
        // wrong frame has no way to correct it and has to start a whole new campaign,
        // abandoning the supporters and the link they already shared.
        if ('frameConfig' in body && body.frameConfig != null) {
            if (!hasVisibleFrame(body.frameConfig)) {
                return NextResponse.json(
                    { error: 'That frame would not show up on anyone\'s photo. Pick a border style or upload a frame image.' },
                    { status: 400 }
                );
            }
            const frameJson = JSON.stringify(body.frameConfig);
            if (frameJson.length > 200_000) {
                return NextResponse.json({ error: 'Frame data is too large.' }, { status: 400 });
            }
            sets.push(`frame_config = $${i++}`);
            values.push(frameJson);
        }

        // Preview thumbnail travels with the frame, so it can be refreshed alongside it.
        if ('previewUrl' in body) {
            const preview = typeof body.previewUrl === 'string' && body.previewUrl.trim() ? body.previewUrl.trim() : null;
            if (preview && !/^https:\/\//i.test(preview)) {
                return NextResponse.json({ error: 'Preview URL must be https.' }, { status: 400 });
            }
            sets.push(`preview_url = $${i++}`);
            values.push(preview);
        }

        let newSlug: string | null = null;
        if (typeof body.slug === 'string' && body.slug.trim()) {
            newSlug = slugify(body.slug);
            if (!newSlug) {
                return NextResponse.json({ error: 'That link name is not valid. Use letters and numbers.' }, { status: 400 });
            }
            if (newSlug !== currentSlug) {
                sets.push(`slug = $${i++}`);
                values.push(newSlug);
            } else {
                newSlug = null;
            }
        }

        if (sets.length === 0) {
            return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
        }

        values.push(id);
        try {
            const result = await pool.query(
                `UPDATE campaigns SET ${sets.join(', ')} WHERE id = $${i} RETURNING slug, title, description, frame_config, preview_url`,
                values
            );

            // Keep every previously shared /c/[old] working. Resolve redirects by
            // campaign id so a second rename (a→b→c) still sends a→c.
            if (newSlug) {
                try {
                    // If this slug was someone else's old name, the new owner wins.
                    await pool.query(
                        `DELETE FROM campaign_slug_redirects WHERE old_slug = $1`,
                        [newSlug]
                    );
                    await pool.query(
                        `INSERT INTO campaign_slug_redirects (old_slug, campaign_id)
                         VALUES ($1, $2)
                         ON CONFLICT (old_slug) DO UPDATE SET campaign_id = EXCLUDED.campaign_id`,
                        [currentSlug, id]
                    );
                } catch (redirErr) {
                    // Table may not exist yet on a deploy that raced the migration.
                    // The slug update already succeeded; failing closed on redirects
                    // is worse than logging and shipping the rename.
                    console.error('slug redirect write failed', redirErr);
                }
            }

            const response = NextResponse.json(result.rows[0]);
            return withOptionalManageCookie(response, id, resolved.mintSession);
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
