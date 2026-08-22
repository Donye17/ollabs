// Organizer hub helpers: handle rules, reserved words, and public-page shape.
//
// /u/[handle] is the campaign directory. The frame tool stays on /c/[slug].
// A hub only exists after optional login + claiming a handle.

export const HANDLE_MIN = 3;
export const HANDLE_MAX = 30;
export const HUB_LINKS_MAX = 20;
export const HUB_LINK_TITLE_MAX = 80;
export const HUB_BIO_MAX = 280;
export const HUB_DISPLAY_NAME_MAX = 60;

/** App routes and brand words that must never become a public handle. */
export const RESERVED_HANDLES = new Set([
    'admin',
    'api',
    'c',
    'create',
    'day',
    'explore',
    'for',
    'help',
    'hub',
    'id',
    'login',
    'me',
    'mine',
    'ollabs',
    'privacy',
    'pt',
    'recover',
    'settings',
    'support',
    'terms',
    'u',
    'vs',
    'www',
]);

export type HubLinkInput = {
    title: string;
    url: string;
};

export type HubCampaignSummary = {
    slug: string;
    title: string;
    supporter_count: number | null;
    preview_url: string | null;
};

export type PublicHub = {
    handle: string;
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    featured: HubCampaignSummary | null;
    campaigns: HubCampaignSummary[];
    links: { id: string; title: string; url: string }[];
    updatedAt: string | null;
};

/** Normalize to lowercase a-z / digits / hyphens. Empty string if nothing left. */
export function normalizeHandle(raw: unknown): string {
    if (typeof raw !== 'string') return '';
    return raw
        .trim()
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, HANDLE_MAX);
}

export function isValidHandle(handle: string): boolean {
    if (handle.length < HANDLE_MIN || handle.length > HANDLE_MAX) return false;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(handle)) return false;
    if (RESERVED_HANDLES.has(handle)) return false;
    return true;
}

export function handleError(handle: string): string | null {
    if (!handle) return 'Pick a handle.';
    if (handle.length < HANDLE_MIN) return `At least ${HANDLE_MIN} characters.`;
    if (handle.length > HANDLE_MAX) return `At most ${HANDLE_MAX} characters.`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(handle)) {
        return 'Use letters, numbers, and hyphens only.';
    }
    if (RESERVED_HANDLES.has(handle)) return 'That handle is reserved.';
    return null;
}

export function isSafeHttpUrl(raw: string): boolean {
    try {
        const u = new URL(raw);
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
        return false;
    }
}

/** Whether crawlers should index this hub (has something useful to show). */
export function hubIsIndexable(hub: {
    featured: unknown;
    campaigns: unknown[];
    links: unknown[];
    bio: string | null;
}): boolean {
    if (hub.featured) return true;
    if (hub.campaigns.length > 0) return true;
    if (hub.links.length > 0) return true;
    if (hub.bio && hub.bio.trim().length > 0) return true;
    return false;
}
