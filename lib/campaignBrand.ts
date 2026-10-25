/** Free campaign branding and arrival buckets. Display only. Never a gate. */

export const ACCENT_IDS = ['brand', 'coral', 'magenta', 'green', 'purple', 'orange'] as const;
export type AccentId = (typeof ACCENT_IDS)[number];

export const REFERRER_BUCKETS = ['whatsapp', 'instagram', 'facebook', 'direct'] as const;
export type ReferrerBucket = (typeof REFERRER_BUCKETS)[number];

/** Tailwind border class for the campaign accent. Tokens only, no raw hex. */
export const ACCENT_BORDER: Record<AccentId, string> = {
    brand: 'border-brand',
    coral: 'border-coral',
    magenta: 'border-frame-magenta',
    green: 'border-frame-green',
    purple: 'border-frame-purple',
    orange: 'border-frame-orange',
};

export const ACCENT_BG: Record<AccentId, string> = {
    brand: 'bg-brand',
    coral: 'bg-coral',
    magenta: 'bg-frame-magenta',
    green: 'bg-frame-green',
    purple: 'bg-frame-purple',
    orange: 'bg-frame-orange',
};

export function parseAccent(value: unknown): AccentId | null {
    if (typeof value !== 'string') return null;
    return (ACCENT_IDS as readonly string[]).includes(value) ? (value as AccentId) : null;
}

/** Public https logo only. Empty clears it. */
export function parseLogoUrl(value: unknown): string | null {
    if (value == null || value === '') return null;
    if (typeof value !== 'string') return null;
    const url = value.trim();
    if (url.length > 500 || !url.startsWith('https://') || /\s/.test(url)) return null;
    return url;
}

/**
 * Where a supporter arrived, when we can tell.
 * An empty referrer stays "direct". The profile-photo hint assumes WhatsApp
 * for a missing referrer, but that guess would hide real direct visits here.
 */
export function referrerBucket(input: {
    utm?: string | null;
    referrer?: string | null;
    inApp?: string | null;
}): ReferrerBucket {
    const inApp = (input.inApp || '').toLowerCase();
    if (inApp === 'whatsapp' || inApp === 'instagram' || inApp === 'facebook') return inApp;
    const utm = (input.utm || '').toLowerCase();
    if (utm === 'whatsapp' || utm.includes('whatsapp')) return 'whatsapp';
    if (utm === 'instagram') return 'instagram';
    if (utm === 'facebook' || utm === 'messenger') return 'facebook';
    const ref = (input.referrer || '').toLowerCase();
    if (ref.includes('whatsapp') || ref.includes('wa.me')) return 'whatsapp';
    if (ref.includes('instagram')) return 'instagram';
    if (ref.includes('facebook') || ref.includes('fb.com') || ref.includes('fb.me')) return 'facebook';
    return 'direct';
}

export function emptyReferrers(): Record<ReferrerBucket, number> {
    return { whatsapp: 0, instagram: 0, facebook: 0, direct: 0 };
}

export function readReferrers(value: unknown): Record<ReferrerBucket, number> {
    const out = emptyReferrers();
    if (!value || typeof value !== 'object') return out;
    const row = value as Record<string, unknown>;
    for (const key of REFERRER_BUCKETS) {
        const n = Number(row[key]);
        out[key] = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
    }
    return out;
}
