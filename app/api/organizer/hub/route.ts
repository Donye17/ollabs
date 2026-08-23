import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionOrganizer } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import {
    HUB_BIO_MAX,
    HUB_DISPLAY_NAME_MAX,
    HUB_LINK_TITLE_MAX,
    HUB_LINKS_MAX,
    handleError,
    isSafeHttpUrl,
    normalizeHandle,
    type HubLinkInput,
} from '@/lib/hub';
import { isHubThemeId } from '@/lib/hubThemes';

export const dynamic = 'force-dynamic';

type CampaignRow = {
    id: string;
    slug: string;
    title: string;
    supporter_count: number | null;
    preview_url: string | null;
};

function parseHiddenIds(raw: unknown): string[] {
    if (Array.isArray(raw)) return raw.map(String);
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.map(String) : [];
        } catch {
            return [];
        }
    }
    return [];
}

async function loadHubBundle(organizerId: string) {
    const [orgRes, linksRes, campsRes] = await Promise.all([
        pool.query(
            `SELECT id, email, handle, display_name, bio, avatar_url,
                    featured_campaign_id, hub_updated_at, hub_theme,
                    COALESCE(hub_hidden_campaign_ids, '[]'::jsonb) AS hub_hidden_campaign_ids,
                    COALESCE(support_click_count, 0) AS support_click_count,
                    upgrade_interested_at
             FROM organizers WHERE id = $1 LIMIT 1`,
            [organizerId]
        ),
        pool.query(
            `SELECT id, title, url, sort_order, COALESCE(click_count, 0) AS click_count
             FROM organizer_hub_links
             WHERE organizer_id = $1
             ORDER BY sort_order ASC, created_at ASC`,
            [organizerId]
        ),
        pool.query(
            `SELECT id, slug, title, supporter_count, preview_url
             FROM campaigns
             WHERE creator_id = $1
               AND is_public = true
               AND is_hidden IS NOT TRUE
             ORDER BY created_at DESC
             LIMIT 50`,
            [organizerId]
        ),
    ]);

    const org = orgRes.rows[0];
    if (!org) return null;

    const campaigns = campsRes.rows as CampaignRow[];
    const featuredId = org.featured_campaign_id as string | null;
    const featured = featuredId
        ? campaigns.find((c) => c.id === featuredId) ?? null
        : null;
    const hiddenCampaignIds = parseHiddenIds(org.hub_hidden_campaign_ids);

    return {
        email: org.email as string,
        handle: (org.handle as string | null) ?? null,
        displayName: (org.display_name as string | null) ?? null,
        bio: (org.bio as string | null) ?? null,
        avatarUrl: (org.avatar_url as string | null) ?? null,
        featuredCampaignId: featuredId,
        hubTheme: (org.hub_theme as string | null) || 'default',
        hiddenCampaignIds,
        supportClickCount: Number(org.support_click_count) || 0,
        upgradeInterested: !!org.upgrade_interested_at,
        featured: featured
            ? {
                  slug: featured.slug,
                  title: featured.title,
                  supporter_count: featured.supporter_count,
                  preview_url: featured.preview_url,
              }
            : null,
        campaigns: campaigns.map((c) => ({
            id: c.id,
            slug: c.slug,
            title: c.title,
            supporter_count: c.supporter_count,
            preview_url: c.preview_url,
        })),
        links: linksRes.rows.map((l: {
            id: string;
            title: string;
            url: string;
            sort_order: number;
            click_count: number;
        }) => ({
            id: l.id,
            title: l.title,
            url: l.url,
            sortOrder: l.sort_order,
            clickCount: Number(l.click_count) || 0,
        })),
        hubUpdatedAt: (org.hub_updated_at as string | null) ?? null,
    };
}

// GET /api/organizer/hub — signed-in organizer's hub draft + campaigns.
export async function GET(request: NextRequest) {
    try {
        const organizer = await getSessionOrganizer(request);
        if (!organizer) {
            return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
        }
        const hub = await loadHubBundle(organizer.id);
        if (!hub) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }
        return NextResponse.json(hub);
    } catch (error) {
        console.error('Failed to load organizer hub:', error);
        return NextResponse.json({ error: 'Failed to load your hub' }, { status: 500 });
    }
}

// PATCH /api/organizer/hub — claim/update handle, profile, featured campaign, links.
export async function PATCH(request: NextRequest) {
    try {
        if (!rateLimit(`hubedit:${clientIp(request)}`, 30, 15 * 60 * 1000)) {
            return NextResponse.json(
                { error: 'Too many saves. Please wait a few minutes.' },
                { status: 429 }
            );
        }

        const organizer = await getSessionOrganizer(request);
        if (!organizer) {
            return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
        }

        const body = await request.json().catch(() => ({}));

        // ---- handle -------------------------------------------------------
        let nextHandle: string | null | undefined;
        if ('handle' in body) {
            if (body.handle === null || body.handle === '') {
                nextHandle = null;
            } else {
                const normalized = normalizeHandle(body.handle);
                const err = handleError(normalized);
                if (err) return NextResponse.json({ error: err }, { status: 400 });
                nextHandle = normalized;
            }
        }

        // ---- display name / bio / avatar ----------------------------------
        let displayName: string | null | undefined;
        if ('displayName' in body) {
            if (body.displayName == null || String(body.displayName).trim() === '') {
                displayName = null;
            } else {
                displayName = String(body.displayName).trim().slice(0, HUB_DISPLAY_NAME_MAX);
            }
        }

        let bio: string | null | undefined;
        if ('bio' in body) {
            if (body.bio == null || String(body.bio).trim() === '') {
                bio = null;
            } else {
                bio = String(body.bio).trim().slice(0, HUB_BIO_MAX);
            }
        }

        let avatarUrl: string | null | undefined;
        if ('avatarUrl' in body) {
            if (body.avatarUrl == null || body.avatarUrl === '') {
                avatarUrl = null;
            } else if (typeof body.avatarUrl === 'string' && body.avatarUrl.startsWith('https://')) {
                avatarUrl = body.avatarUrl.slice(0, 500);
            } else {
                return NextResponse.json({ error: 'Avatar must be an https URL.' }, { status: 400 });
            }
        }

        // ---- featured campaign --------------------------------------------
        let featuredCampaignId: string | null | undefined;
        if ('featuredCampaignId' in body) {
            if (body.featuredCampaignId == null || body.featuredCampaignId === '') {
                featuredCampaignId = null;
            } else {
                const owned = await pool.query(
                    `SELECT id FROM campaigns
                     WHERE id = $1 AND creator_id = $2 AND is_hidden IS NOT TRUE
                     LIMIT 1`,
                    [String(body.featuredCampaignId), organizer.id]
                );
                if (!owned.rows[0]) {
                    return NextResponse.json(
                        { error: 'That campaign is not on your account.' },
                        { status: 400 }
                    );
                }
                featuredCampaignId = owned.rows[0].id;
            }
        }

        // ---- theme --------------------------------------------------------
        let hubTheme: string | undefined;
        if ('hubTheme' in body) {
            if (!isHubThemeId(body.hubTheme)) {
                return NextResponse.json({ error: 'Unknown theme.' }, { status: 400 });
            }
            hubTheme = body.hubTheme;
        }

        // ---- hidden campaigns (hub list only; not account-wide is_hidden) -
        let hiddenCampaignIds: string[] | undefined;
        if ('hiddenCampaignIds' in body) {
            if (!Array.isArray(body.hiddenCampaignIds)) {
                return NextResponse.json({ error: 'hiddenCampaignIds must be a list.' }, { status: 400 });
            }
            const ids = body.hiddenCampaignIds.map(String).slice(0, 50);
            if (ids.length > 0) {
                const owned = await pool.query(
                    `SELECT id FROM campaigns WHERE creator_id = $1 AND id = ANY($2::uuid[])`,
                    [organizer.id, ids]
                );
                hiddenCampaignIds = owned.rows.map((r: { id: string }) => r.id);
            } else {
                hiddenCampaignIds = [];
            }
        }

        // ---- links (full replace when provided) ---------------------------
        let links: HubLinkInput[] | undefined;
        if ('links' in body) {
            if (!Array.isArray(body.links)) {
                return NextResponse.json({ error: 'Links must be a list.' }, { status: 400 });
            }
            if (body.links.length > HUB_LINKS_MAX) {
                return NextResponse.json(
                    { error: `At most ${HUB_LINKS_MAX} links.` },
                    { status: 400 }
                );
            }
            const cleaned: HubLinkInput[] = [];
            for (const raw of body.links) {
                const title = String(raw?.title ?? '').trim().slice(0, HUB_LINK_TITLE_MAX);
                const url = String(raw?.url ?? '').trim();
                if (!title || !url) {
                    return NextResponse.json(
                        { error: 'Each link needs a title and a URL.' },
                        { status: 400 }
                    );
                }
                if (!isSafeHttpUrl(url)) {
                    return NextResponse.json(
                        { error: 'Links must start with http:// or https://.' },
                        { status: 400 }
                    );
                }
                cleaned.push({ title, url });
            }
            links = cleaned;
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            if (nextHandle !== undefined) {
                if (nextHandle !== null) {
                    const clash = await client.query(
                        `SELECT id FROM organizers
                         WHERE handle = $1 AND id <> $2
                         LIMIT 1`,
                        [nextHandle, organizer.id]
                    );
                    if (clash.rows[0]) {
                        await client.query('ROLLBACK');
                        return NextResponse.json(
                            { error: 'That handle is already taken.' },
                            { status: 409 }
                        );
                    }
                }
            }

            const sets: string[] = ['hub_updated_at = NOW()'];
            const vals: unknown[] = [];
            const push = (col: string, value: unknown) => {
                vals.push(value);
                sets.push(`${col} = $${vals.length}`);
            };

            if (nextHandle !== undefined) push('handle', nextHandle);
            if (displayName !== undefined) push('display_name', displayName);
            if (bio !== undefined) push('bio', bio);
            if (avatarUrl !== undefined) push('avatar_url', avatarUrl);
            if (featuredCampaignId !== undefined) push('featured_campaign_id', featuredCampaignId);
            if (hubTheme !== undefined) push('hub_theme', hubTheme);
            if (hiddenCampaignIds !== undefined) {
                vals.push(JSON.stringify(hiddenCampaignIds));
                sets.push(`hub_hidden_campaign_ids = $${vals.length}::jsonb`);
            }

            // Paid upgrades are deferred; this only records interest for demand.
            if (body.upgradeInterest === true) {
                sets.push(`upgrade_interested_at = COALESCE(upgrade_interested_at, NOW())`);
            }

            vals.push(organizer.id);
            await client.query(
                `UPDATE organizers SET ${sets.join(', ')} WHERE id = $${vals.length}`,
                vals
            );

            if (links !== undefined) {
                await client.query(
                    `DELETE FROM organizer_hub_links WHERE organizer_id = $1`,
                    [organizer.id]
                );
                for (let i = 0; i < links.length; i++) {
                    await client.query(
                        `INSERT INTO organizer_hub_links (organizer_id, title, url, sort_order)
                         VALUES ($1, $2, $3, $4)`,
                        [organizer.id, links[i].title, links[i].url, i]
                    );
                }
            }

            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }

        const hub = await loadHubBundle(organizer.id);
        return NextResponse.json(hub);
    } catch (error) {
        console.error('Failed to save organizer hub:', error);
        return NextResponse.json({ error: 'Could not save your hub' }, { status: 500 });
    }
}
