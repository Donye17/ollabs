/** Detect known social hosts for hub link icons. */

export type SocialKind = 'instagram' | 'tiktok' | 'youtube' | 'whatsapp' | 'x' | 'facebook' | null;

export function detectSocial(url: string): SocialKind {
    try {
        const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
        if (host === 'instagram.com' || host.endsWith('.instagram.com')) return 'instagram';
        if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) return 'tiktok';
        if (
            host === 'youtube.com'
            || host.endsWith('.youtube.com')
            || host === 'youtu.be'
            || host === 'm.youtube.com'
        ) {
            return 'youtube';
        }
        if (
            host === 'wa.me'
            || host === 'api.whatsapp.com'
            || host === 'chat.whatsapp.com'
            || host.endsWith('.whatsapp.com')
        ) {
            return 'whatsapp';
        }
        if (host === 'x.com' || host === 'twitter.com' || host.endsWith('.twitter.com')) return 'x';
        if (host === 'facebook.com' || host.endsWith('.facebook.com') || host === 'fb.com') {
            return 'facebook';
        }
        return null;
    } catch {
        return null;
    }
}
