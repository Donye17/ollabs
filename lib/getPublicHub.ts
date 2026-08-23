import { cache } from 'react';
import { pool } from '@/lib/neon';
import { normalizeHandle, type PublicHub } from '@/lib/hub';
import { resolveHubTheme } from '@/lib/hubThemes';

/** Load a published hub by handle. Returns null if missing or handle invalid. */
export const getPublicHub = cache(async (rawHandle: string): Promise<PublicHub | null> => {
    const handle = normalizeHandle(rawHandle);
    if (!handle) return null;

    try {
        const orgRes = await pool.query(
            `SELECT id, handle, display_name, bio, avatar_url,
                    featured_campaign_id, hub_updated_at, hub_theme,
                    COALESCE(hub_hidden_campaign_ids, '[]'::jsonb) AS hub_hidden_campaign_ids
             FROM organizers
             WHERE handle = $1
             LIMIT 1`,
            [handle]
        );
        const org = orgRes.rows[0];
        if (!org) return null;

        const hiddenRaw = org.hub_hidden_campaign_ids;
        const hiddenIds = new Set<string>(
            Array.isArray(hiddenRaw)
                ? hiddenRaw.map(String)
                : typeof hiddenRaw === 'string'
                  ? (JSON.parse(hiddenRaw) as string[])
                  : []
        );

        const [linksRes, campsRes] = await Promise.all([
            pool.query(
                `SELECT id, title, url
                 FROM organizer_hub_links
                 WHERE organizer_id = $1
                 ORDER BY sort_order ASC, created_at ASC`,
                [org.id]
            ),
            pool.query(
                `SELECT id, slug, title, supporter_count, preview_url
                 FROM campaigns
                 WHERE creator_id = $1
                   AND is_public = true
                   AND is_hidden IS NOT TRUE
                 ORDER BY created_at DESC
                 LIMIT 50`,
                [org.id]
            ),
        ]);

        type Camp = {
            id: string;
            slug: string;
            title: string;
            supporter_count: number | null;
            preview_url: string | null;
        };

        const campaigns = campsRes.rows as Camp[];

        const featuredId = org.featured_campaign_id as string | null;
        let featured = featuredId
            ? campaigns.find((c) => c.id === featuredId) ?? null
            : null;

        // If they never picked one, promote the newest visible campaign.
        if (!featured) {
            featured = campaigns.find((c) => !hiddenIds.has(c.id)) ?? null;
        }

        const displayName =
            (org.display_name as string | null)?.trim() ||
            `@${org.handle}`;

        const theme = resolveHubTheme(org.hub_theme as string | null).id;

        return {
            handle: org.handle as string,
            displayName,
            bio: (org.bio as string | null) ?? null,
            avatarUrl: (org.avatar_url as string | null) ?? null,
            featured: featured
                ? {
                      slug: featured.slug,
                      title: featured.title,
                      supporter_count: featured.supporter_count,
                      preview_url: featured.preview_url,
                      id: featured.id,
                  }
                : null,
            campaigns: campaigns
                .filter((c) => !featured || c.slug !== featured.slug)
                .filter((c) => !hiddenIds.has(c.id))
                .map((c) => ({
                    slug: c.slug,
                    title: c.title,
                    supporter_count: c.supporter_count,
                    preview_url: c.preview_url,
                    id: c.id,
                })),
            links: linksRes.rows.map((l: { id: string; title: string; url: string }) => ({
                id: l.id,
                title: l.title,
                url: l.url,
            })),
            updatedAt: (org.hub_updated_at as string | null) ?? null,
            theme,
        };
    } catch (e) {
        console.error('Failed to load public hub', e);
        return null;
    }
});
