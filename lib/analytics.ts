// Thin wrapper over GA4 (gtag). No-ops if analytics is not loaded.
export function track(name: string, params?: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;
    const g = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof g === 'function') {
        try { g('event', name, params || {}); } catch { /* ignore */ }
    }
}

// Append UTM params so shared links attribute referral traffic by platform in GA4.
export function withUtm(url: string, source: string): string {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}utm_source=${encodeURIComponent(source)}&utm_medium=social&utm_campaign=ollabs_frame`;
}
