/**
 * Lightweight locale for Ollabs.
 *
 * Not a full i18n framework. A cookie, dictionaries for converting surfaces
 * (campaign, create/publish), and SEO landings at /pt and /id. Marketing
 * English stays the default site.
 */

export type Locale = 'en' | 'pt' | 'id';

export const LOCALES: Locale[] = ['en', 'pt', 'id'];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'ollabs_locale';

export function isLocale(value: string | null | undefined): value is Locale {
    return value === 'en' || value === 'pt' || value === 'id';
}

/** Prefer an explicit locale, then cookie, then navigator (pt* / id*), else English. */
export function resolveLocale(opts: {
    explicit?: string | null;
    cookie?: string | null;
    languages?: readonly string[];
}): Locale {
    if (isLocale(opts.explicit)) return opts.explicit;
    if (isLocale(opts.cookie)) return opts.cookie;
    const langs = opts.languages || [];
    for (const l of langs) {
        if (typeof l !== 'string') continue;
        const lower = l.toLowerCase();
        if (lower.startsWith('pt')) return 'pt';
        if (lower.startsWith('id')) return 'id';
    }
    return DEFAULT_LOCALE;
}

export function htmlLang(locale: Locale): string {
    if (locale === 'pt') return 'pt-BR';
    if (locale === 'id') return 'id';
    return 'en';
}

export function ogLocale(locale: Locale): string {
    if (locale === 'pt') return 'pt_BR';
    if (locale === 'id') return 'id_ID';
    return 'en_US';
}

/** Path for a locale's SEO landing, or null for English (home). */
export function localeLandingPath(locale: Locale): string | null {
    if (locale === 'pt') return '/pt';
    if (locale === 'id') return '/id';
    return null;
}
