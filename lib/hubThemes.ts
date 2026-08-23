/**
 * Fixed hub theme presets. Not a marketplace — a few campaign-tinted looks
 * so /u pages feel owned without custom CSS.
 */

export type HubThemeId = 'default' | 'ink' | 'coral' | 'forest' | 'sunset';

export type HubTheme = {
    id: HubThemeId;
    label: string;
    /** Page background (Tailwind-ish hex — applied inline for public hubs). */
    pageBg: string;
    pageFg: string;
    muted: string;
    cardBg: string;
    cardBorder: string;
    supportBg: string;
    supportFg: string;
    accentWash: string;
};

export const HUB_THEMES: Record<HubThemeId, HubTheme> = {
    default: {
        id: 'default',
        label: 'Sky',
        pageBg: '#F7F4EE',
        pageFg: '#06141F',
        muted: '#6B7280',
        cardBg: '#F0EBE3',
        cardBorder: 'rgba(6,20,31,0.1)',
        supportBg: '#01BEF6',
        supportFg: '#06141F',
        accentWash:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(1,190,246,0.22), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(255,92,57,0.08), transparent 50%)',
    },
    ink: {
        id: 'ink',
        label: 'Ink',
        pageBg: '#06141F',
        pageFg: '#F7F4EE',
        muted: '#9CA3AF',
        cardBg: '#0F2433',
        cardBorder: 'rgba(247,244,238,0.12)',
        supportBg: '#01BEF6',
        supportFg: '#06141F',
        accentWash:
            'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(1,190,246,0.28), transparent 55%)',
    },
    coral: {
        id: 'coral',
        label: 'Coral',
        pageBg: '#FFF5F2',
        pageFg: '#06141F',
        muted: '#6B7280',
        cardBg: '#FFE8E1',
        cardBorder: 'rgba(255,92,57,0.2)',
        supportBg: '#FF5C39',
        supportFg: '#FFFFFF',
        accentWash:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,92,57,0.25), transparent 55%)',
    },
    forest: {
        id: 'forest',
        label: 'Forest',
        pageBg: '#F2F7F4',
        pageFg: '#0A1F16',
        muted: '#5B6B63',
        cardBg: '#E4EFE8',
        cardBorder: 'rgba(10,31,22,0.1)',
        supportBg: '#1B7A4E',
        supportFg: '#F7F4EE',
        accentWash:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(27,122,78,0.2), transparent 55%)',
    },
    sunset: {
        id: 'sunset',
        label: 'Sunset',
        pageBg: '#FFF8F0',
        pageFg: '#1A0F08',
        muted: '#7A6558',
        cardBg: '#FFEFD9',
        cardBorder: 'rgba(26,15,8,0.1)',
        supportBg: '#E85D04',
        supportFg: '#FFFFFF',
        accentWash:
            'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(232,93,4,0.22), transparent 50%), radial-gradient(ellipse 50% 40% at 100% 80%, rgba(1,190,246,0.12), transparent 50%)',
    },
};

export const HUB_THEME_IDS = Object.keys(HUB_THEMES) as HubThemeId[];

export function resolveHubTheme(raw: string | null | undefined): HubTheme {
    if (raw && raw in HUB_THEMES) return HUB_THEMES[raw as HubThemeId];
    return HUB_THEMES.default;
}

export function isHubThemeId(value: unknown): value is HubThemeId {
    return typeof value === 'string' && value in HUB_THEMES;
}
