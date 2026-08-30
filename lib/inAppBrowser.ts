/**
 * WhatsApp and Instagram in-app browsers. 812 of 1,524 sessions in the August
 * spike had no referrer, which is the signature of these WebViews.
 *
 * Detection is best-effort from UA. Do not block the supporter flow: the share
 * sheet already works on iOS, and a modal on arrival costs people who would
 * have saved anyway.
 */

export type InAppKind = 'whatsapp' | 'instagram' | 'facebook';

export function detectInAppBrowser(ua?: string): InAppKind | null {
    if (typeof navigator === 'undefined' && !ua) return null;
    const raw = (ua || navigator.userAgent || '').toLowerCase();
    if (raw.includes('whatsapp')) return 'whatsapp';
    if (raw.includes('instagram')) return 'instagram';
    if (raw.includes('fbav') || raw.includes('fban') || raw.includes('fb_iab')) return 'facebook';
    return null;
}

/** Arrival platform for the one-line "how to set this as a profile picture". */
export function arrivalPlatform(ua?: string, referrer?: string): InAppKind | 'generic' {
    const kind = detectInAppBrowser(ua);
    if (kind) return kind;
    const ref = (referrer ?? (typeof document !== 'undefined' ? document.referrer : '')).toLowerCase();
    if (ref.includes('instagram')) return 'instagram';
    if (ref.includes('facebook') || ref.includes('fb.com') || ref.includes('fb.me')) return 'facebook';
    if (ref.includes('whatsapp') || ref.includes('wa.me')) return 'whatsapp';
    // Majority of supporters arrive from a WhatsApp tap with an empty referrer.
    return 'whatsapp';
}

export const INAPP_BAR_KEY = 'ollabs_inapp_bar_seen';
export const INAPP_RECOVERY_KEY = 'ollabs_inapp_recovery_seen';

export function sessionFlag(key: string): boolean {
    try {
        return sessionStorage.getItem(key) === '1';
    } catch {
        return false;
    }
}

export function setSessionFlag(key: string) {
    try {
        sessionStorage.setItem(key, '1');
    } catch { /* ignore */ }
}

/** Android intent that asks the system to open this HTTPS URL outside the WebView. */
export function androidIntentUrl(pageUrl: string): string {
    try {
        const u = new URL(pageUrl);
        return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;end`;
    } catch {
        return pageUrl;
    }
}
