/**
 * Random supporter thumbnails for Explore and home podium. Explore picks one
 * photo client-side on each mount; home does the same per podium slot.
 */
export const SUPPORTER_PHOTOS_LATERAL = `
LEFT JOIN LATERAL (
    SELECT COALESCE(array_agg(sub.image_url), ARRAY[]::text[]) AS supporter_photos
    FROM (
        SELECT cu.image_url
        FROM campaign_uses cu
        WHERE cu.campaign_id = c.id
          AND cu.image_url IS NOT NULL
          AND btrim(cu.image_url) <> ''
        ORDER BY random()
        LIMIT 12
    ) sub
) sp ON true`;

export function parseSupporterPhotos(raw: unknown): string[] {
    if (!Array.isArray(raw)) return [];
    return raw.filter((u): u is string => typeof u === 'string' && u.trim().length > 0);
}
