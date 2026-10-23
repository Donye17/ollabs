/**
 * URLs we are willing to store and later render as first-party images
 * (Explore thumbs, campaign OG previews, day-frame overrides).
 *
 * Client uploads go through /api/upload onto Vercel Blob. Anything else
 * (data:, javascript:, a random https host) must not land in campaign_uses
 * or preview_url: Explore and WhatsApp unfurls would show it as ours.
 */

const BLOB_HOST = 'public.blob.vercel-storage.com';
const MAX_LEN = 500;

export function isPublicBlobUrl(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    const url = value.trim();
    if (!url || url.length > MAX_LEN) return false;
    try {
        const u = new URL(url);
        if (u.protocol !== 'https:') return false;
        if (u.username || u.password) return false;
        if (!u.pathname || u.pathname === '/') return false;

        const host = u.hostname.toLowerCase();
        if (host === BLOB_HOST) return true;
        if (!host.endsWith(`.${BLOB_HOST}`)) return false;
        const sub = host.slice(0, -(BLOB_HOST.length + 1));
        // Store id is a single DNS label (no extra dots, no empty).
        return sub.length > 0 && !sub.includes('.');
    } catch {
        return false;
    }
}
