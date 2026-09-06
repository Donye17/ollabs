/**
 * URLs for "Change the frame": reopen Create against a live campaign.
 *
 * Manage strips k= from the address bar after minting a 72h cookie, so a
 * later visit can be cookie-authenticated with no key in React state.
 * Those links must still enter edit mode. An empty k= used to skip bootstrap
 * and publish a second campaign.
 */

export function editFrameHref(slug: string, token?: string | null): string {
    const params = new URLSearchParams();
    params.set('edit', slug);
    if (token) params.set('k', token);
    return `/create?${params.toString()}`;
}

export function manageDashboardHref(slug: string, token?: string | null): string {
    if (token) return `/c/${slug}/manage?k=${encodeURIComponent(token)}`;
    return `/c/${slug}/manage`;
}

export function manageApiHref(slug: string, token?: string | null): string {
    const base = `/api/campaigns/${encodeURIComponent(slug)}/manage`;
    return token ? `${base}?token=${encodeURIComponent(token)}` : base;
}

export function readStoredManageKey(slug: string): string | null {
    try {
        return sessionStorage.getItem(`ollabs_manage_k:${slug}`);
    } catch {
        return null;
    }
}
