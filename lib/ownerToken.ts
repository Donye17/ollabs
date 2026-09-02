/**
 * Campaign owner-token helpers.
 *
 * New campaigns store SHA-256 of the manage key (owner_token_hash) and may
 * still carry plaintext owner_token during the dual-read migration so old
 * email links keep working. Verification accepts either form and backfills
 * the hash when a plaintext match is found without one.
 */

import { pool } from '@/lib/neon';
import { constantTimeEqual, sha256Hex } from '@/lib/auth';

export type OwnedCampaign = {
    id: string;
    slug: string;
};

export async function hashOwnerToken(plaintext: string): Promise<string> {
    return sha256Hex(plaintext);
}

async function backfillOwnerTokenHash(id: string, hash: string): Promise<void> {
    try {
        await pool.query(
            `UPDATE campaigns SET owner_token_hash = $2 WHERE id = $1 AND owner_token_hash IS NULL`,
            [id, hash]
        );
    } catch { /* column may not exist yet on a stale preview */ }
}

/**
 * Welcome-email and bookmarked manage URLs keep the slug from publish time.
 * Public /c/[old] already follows campaign_slug_redirects; manage did not, so
 * picking a custom link (the dashboard invites this) made the emailed
 * /c/[old]/manage?k= key 404. Token still has to match; the old slug is only
 * a pointer to the campaign.
 */
async function findCampaignByOwnerTokenViaRedirect(
    oldSlug: string,
    plaintext: string,
    hash: string
): Promise<OwnedCampaign | null> {
    try {
        const res = await pool.query(
            `SELECT c.id, c.slug, c.owner_token, c.owner_token_hash
             FROM campaign_slug_redirects r
             JOIN campaigns c ON c.id = r.campaign_id
             WHERE r.old_slug = $1
             LIMIT 1`,
            [oldSlug]
        );
        const row = res.rows[0] as {
            id: string;
            slug: string;
            owner_token: string | null;
            owner_token_hash: string | null;
        } | undefined;
        if (!row) return null;
        if (!(await tokensMatch(plaintext, row.owner_token, row.owner_token_hash))) {
            return null;
        }
        if (!row.owner_token_hash) await backfillOwnerTokenHash(row.id, hash);
        return { id: row.id, slug: row.slug };
    } catch {
        // Redirect table missing on a stale preview, same as public /c pages.
        return null;
    }
}

/** Look up a campaign by slug + manage key (plaintext k= from the URL). */
export async function findCampaignByOwnerToken(
    slug: string,
    plaintext: string
): Promise<OwnedCampaign | null> {
    if (!plaintext || plaintext.length < 16) return null;
    const hash = await hashOwnerToken(plaintext);

    const byHash = await pool.query(
        `SELECT id, slug FROM campaigns
         WHERE slug = $1 AND owner_token_hash = $2
         LIMIT 1`,
        [slug, hash]
    );
    if (byHash.rows[0]) {
        return { id: byHash.rows[0].id, slug: byHash.rows[0].slug };
    }

    // Legacy plaintext column (pre-hash campaigns and dual-write period).
    const byPlain = await pool.query(
        `SELECT id, slug, owner_token_hash FROM campaigns
         WHERE slug = $1 AND owner_token = $2
         LIMIT 1`,
        [slug, plaintext]
    );
    if (byPlain.rows[0]) {
        if (!byPlain.rows[0].owner_token_hash) {
            await backfillOwnerTokenHash(byPlain.rows[0].id, hash);
        }
        return { id: byPlain.rows[0].id, slug: byPlain.rows[0].slug };
    }

    return findCampaignByOwnerTokenViaRedirect(slug, plaintext, hash);
}

export async function tokensMatch(plaintext: string, storedPlain: string | null, storedHash: string | null): Promise<boolean> {
    if (storedHash) {
        const h = await hashOwnerToken(plaintext);
        if (constantTimeEqual(h, storedHash)) return true;
    }
    if (storedPlain && constantTimeEqual(plaintext, storedPlain)) return true;
    return false;
}

/** Cookie name for short-lived manage sessions (after k= is verified once). */
export const MANAGE_SESSION_COOKIE = 'ollabs_manage';
/** Manage session lifetime. Owner token links still work forever. */
export const MANAGE_SESSION_HOURS = 72;

export async function createManageSession(campaignId: string): Promise<string> {
    const token = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '');
    const hash = await sha256Hex(token);
    await pool.query(
        `INSERT INTO campaign_manage_sessions (token_hash, campaign_id, created_at, expires_at)
         VALUES ($1, $2, NOW(), NOW() + ($3 || ' hours')::interval)`,
        [hash, campaignId, String(MANAGE_SESSION_HOURS)]
    );
    return token;
}

export async function findCampaignByManageSession(
    slug: string,
    sessionToken: string
): Promise<OwnedCampaign | null> {
    if (!sessionToken) return null;
    const hash = await sha256Hex(sessionToken);
    try {
        // After k= is stripped, organizers bookmark /c/[slug]/manage. A later
        // custom-link rename would 404 that cookie session if we required the
        // live slug only.
        const res = await pool.query(
            `SELECT c.id, c.slug
             FROM campaign_manage_sessions s
             JOIN campaigns c ON c.id = s.campaign_id
             WHERE s.token_hash = $1
               AND s.expires_at > NOW()
               AND (
                 c.slug = $2
                 OR EXISTS (
                   SELECT 1 FROM campaign_slug_redirects r
                   WHERE r.old_slug = $2 AND r.campaign_id = c.id
                 )
               )
             LIMIT 1`,
            [hash, slug]
        );
        return res.rows[0] ? { id: res.rows[0].id, slug: res.rows[0].slug } : null;
    } catch {
        const res = await pool.query(
            `SELECT c.id, c.slug
             FROM campaign_manage_sessions s
             JOIN campaigns c ON c.id = s.campaign_id
             WHERE s.token_hash = $1
               AND c.slug = $2
               AND s.expires_at > NOW()
             LIMIT 1`,
            [hash, slug]
        );
        return res.rows[0] ? { id: res.rows[0].id, slug: res.rows[0].slug } : null;
    }
}

export function manageSessionCookieOptions(token: string) {
    return {
        name: MANAGE_SESSION_COOKIE,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: MANAGE_SESSION_HOURS * 60 * 60,
    };
}
