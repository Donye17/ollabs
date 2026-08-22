/**
 * Best-effort publisher country from the edge.
 *
 * Vercel sets x-vercel-ip-country on deployed requests. We store this at
 * campaign create time so we can see which countries are publishing without
 * waiting on GA4 geo reports.
 */
export function publisherCountry(request: Request): string | null {
    const raw =
        request.headers.get('x-vercel-ip-country') ||
        request.headers.get('cf-ipcountry') ||
        request.headers.get('x-country-code');
    if (!raw) return null;
    const code = raw.trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code) || code === 'XX' || code === 'T1') return null;
    return code;
}

/** Human-readable country name for a stored ISO code (falls back to the code). */
export function countryLabel(code: string | null | undefined): string | null {
    if (!code) return null;
    try {
        const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase());
        return name || code;
    } catch {
        return code;
    }
}
