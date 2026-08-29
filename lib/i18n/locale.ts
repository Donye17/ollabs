/**
 * Lightweight locale for Ollabs.
 *
 * Not a full i18n framework. A cookie, dictionaries for converting surfaces
 * (campaign, create/publish), and an SEO landing at /pt. /hi is a noindexed
 * stub. Product UI in Spanish, Indonesian, and Tagalog still works via the
 * locale cookie. Those languages no longer have marketing landings.
 */

export type Locale = 'en' | 'pt' | 'id' | 'es' | 'tl';

export const LOCALES: Locale[] = ['en', 'pt', 'id', 'es', 'tl'];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'ollabs_locale';

export function isLocale(value: string | null | undefined): value is Locale {
    return value === 'en' || value === 'pt' || value === 'id' || value === 'es' || value === 'tl';
}

/** Prefer an explicit locale, then cookie, then navigator (pt* / id* / es* / tl*), else English. */
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
        if (lower.startsWith('es')) return 'es';
        if (lower.startsWith('fil') || lower.startsWith('tl')) return 'tl';
    }
    return DEFAULT_LOCALE;
}

export function htmlLang(locale: Locale): string {
    if (locale === 'pt') return 'pt-BR';
    if (locale === 'id') return 'id';
    if (locale === 'es') return 'es';
    if (locale === 'tl') return 'fil';
    return 'en';
}

export function ogLocale(locale: Locale): string {
    if (locale === 'pt') return 'pt_BR';
    if (locale === 'id') return 'id_ID';
    if (locale === 'es') return 'es_MX';
    if (locale === 'tl') return 'fil_PH';
    return 'en_US';
}

/** Path for a locale's SEO landing, or null to stay on the current page. */
export function localeLandingPath(locale: Locale): string | null {
    if (locale === 'pt') return '/pt';
    return null;
}
