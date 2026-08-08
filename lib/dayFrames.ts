import { pool } from '@/lib/neon';

// Server-side lookup for admin-set day artwork. Kept out of lib/days.ts so that
// file stays a pure data module importable from client components.

/**
 * slug -> image url for every day with an override.
 *
 * Returns an empty map on failure rather than throwing: a database hiccup
 * should drop a page back to its bundled frame, not take the page down.
 */
export async function getFrameOverrides(): Promise<Map<string, string>> {
    try {
        const res = await pool.query(`SELECT slug, image_url FROM day_frame_overrides`);
        return new Map(res.rows.map((r) => [r.slug as string, r.image_url as string]));
    } catch (e) {
        console.error('day frame overrides unavailable', e);
        return new Map();
    }
}

export async function getFrameOverride(slug: string): Promise<string | null> {
    try {
        const res = await pool.query(
            `SELECT image_url FROM day_frame_overrides WHERE slug = $1 LIMIT 1`,
            [slug]
        );
        return (res.rows[0]?.image_url as string) ?? null;
    } catch (e) {
        console.error('day frame override unavailable', e);
        return null;
    }
}
