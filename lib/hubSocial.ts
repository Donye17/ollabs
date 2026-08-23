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

/** Quick-add presets for the hub link editor. */
export const HUB_LINK_PRESETS: {
    id: string;
    title: string;
    placeholder: string;
    hint: string;
}[] = [
    { id: 'instagram', title: 'Instagram', placeholder: 'https://instagram.com/yourname', hint: 'Profile or post' },
    { id: 'tiktok', title: 'TikTok', placeholder: 'https://tiktok.com/@yourname', hint: 'Profile' },
    { id: 'youtube', title: 'YouTube', placeholder: 'https://youtube.com/@yourname', hint: 'Channel or video' },
    { id: 'whatsapp', title: 'WhatsApp', placeholder: 'https://wa.me/55…', hint: 'Chat or group' },
    { id: 'x', title: 'X', placeholder: 'https://x.com/yourname', hint: 'Profile' },
    { id: 'facebook', title: 'Facebook', placeholder: 'https://facebook.com/…', hint: 'Page or profile' },
    { id: 'other', title: 'Other link', placeholder: 'https://', hint: 'Any URL' },
];
