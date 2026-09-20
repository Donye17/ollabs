import { pool } from '@/lib/neon';
import { preferLiveCampaign } from '@/lib/campaignSlugChoice';

/**
 * Public supporter writes (/use, /view) used to key only on campaigns.slug.
 * After a custom-link rename the original /c/[old] URL still works: the page
 * 301s via campaign_slug_redirects. The publish screen, though, already pasted
 * that original slug into WhatsApp, and ISR can keep serving the pre-rename
 * HTML (CampaignClient still posts to /use with the old slug) for up to a
 * minute. Those posts 404ed, so the save never counted, first-supporter mail
 * never sent, and CampaignClient latched countedRef so it never retried.
 *
 * Live slug wins when both exist (someone reused the name). Otherwise follow
 * the redirect the same way app/c/[slug]/page.tsx does.
 */

export type VisibleCampaign = {
    id: string;
    slug: string;
    title: string;
    owner_token: string | null;
    organizer_email: string | null;
    goal: number | null;
    milestone_notified: number;
};

const VISIBLE = `is_public = true AND is_hidden IS NOT TRUE`;

export async function findVisibleCampaignBySlugOrRedirect(
    slug: string
): Promise<VisibleCampaign | null> {
    const live = await pool.query(
        `SELECT id, slug, title, owner_token, organizer_email, goal,
                COALESCE(milestone_notified, 0) AS milestone_notified
         FROM campaigns
         WHERE slug = $1 AND ${VISIBLE}
         LIMIT 1`,
        [slug]
    );
    if (live.rows[0]) return live.rows[0] as VisibleCampaign;

    try {
        const redirected = await pool.query(
            `SELECT c.id, c.slug, c.title, c.owner_token, c.organizer_email, c.goal,
                    COALESCE(c.milestone_notified, 0) AS milestone_notified
             FROM campaign_slug_redirects r
             JOIN campaigns c ON c.id = r.campaign_id
             WHERE r.old_slug = $1
               AND c.is_public = true
               AND c.is_hidden IS NOT TRUE
             LIMIT 1`,
            [slug]
        );
        return preferLiveCampaign(null, (redirected.rows[0] as VisibleCampaign) ?? null);
    } catch (e) {
        // Missing table before migration 0012: same fallback as the public page.
        console.error('slug redirect lookup failed', e);
        return null;
    }
}

export async function findCampaignIdBySlugOrRedirect(
    slug: string
): Promise<{ id: string; slug: string; is_hidden: boolean } | null> {
    const live = await pool.query(
        `SELECT id, slug, is_hidden FROM campaigns WHERE slug = $1 LIMIT 1`,
        [slug]
    );
    const liveRow = live.rows[0]
        ? { id: live.rows[0].id, slug: live.rows[0].slug, is_hidden: !!live.rows[0].is_hidden }
        : null;
    if (liveRow) return liveRow;

    try {
        const redirected = await pool.query(
            `SELECT c.id, c.slug, c.is_hidden
             FROM campaign_slug_redirects r
             JOIN campaigns c ON c.id = r.campaign_id
             WHERE r.old_slug = $1
             LIMIT 1`,
            [slug]
        );
        const redirectRow = redirected.rows[0]
            ? { id: redirected.rows[0].id, slug: redirected.rows[0].slug, is_hidden: !!redirected.rows[0].is_hidden }
            : null;
        return preferLiveCampaign(null, redirectRow);
    } catch (e) {
        console.error('slug redirect lookup failed', e);
        return null;
    }
}
