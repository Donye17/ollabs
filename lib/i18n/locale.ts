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

/** Split an Accept-Language header into language tags, ignoring q-weights. */
export function parseAcceptLanguage(header: string | null | undefined): string[] {
    if (!header) return [];
    return header
        .split(',')
        .map((part) => part.split(';')[0].trim())
        .filter(Boolean);
}

/**
 * Locale implied by a campaign's stored ISO country.
 *
 * Brazilian campaigns default to Portuguese even when WhatsApp's in-app
 * browser reports English, which it often does. Campaign country beats the
 * browser because the person who tapped the link did not come here to pick a
 * language.
 */
export function localeFromCampaignCountry(country: string | null | undefined): Locale | null {
    if (!country) return null;
    const code = country.trim().toUpperCase();
    if (code === 'BR' || code === 'PT') return 'pt';
    return null;
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

/**
 * Locale for a public campaign page.
 *
 * 1. Stored country: BR or PT → Portuguese, even if WhatsApp reports English.
 * 2. No stored country → Portuguese. 97% of frame uses are Brazil, and most
 *    live campaigns were never tagged. Defaulting to English was the bug.
 * 3. Tagged some other country → cookie / Accept-Language, else English.
 *
 * Cookie never overrides (1) or (2). A supporter in WhatsApp should not
 * inherit an organizer's English cookie from a previous visit on the same phone.
 */
export function resolveSupporterLocale(opts: {
    campaignCountry?: string | null;
    cookie?: string | null;
    languages?: readonly string[];
}): Locale {
    const fromCountry = localeFromCampaignCountry(opts.campaignCountry);
    if (fromCountry) return fromCountry;
    if (!opts.campaignCountry) return 'pt';
    return resolveLocale({
        cookie: opts.cookie,
        languages: opts.languages,
    });
}

export function htmlLang(locale: Locale): string {
    if (locale === 'pt') return 'pt-BR';
    if (locale === 'id') return 'id';
    if (locale === 'es') return 'es';
    if (locale === 'tl') return 'fil';
    return 'en';
}

/** Grouped digits in the locale's script. pt-BR is 1.926, not 1,926. */
export function formatCount(n: number, locale: Locale): string {
    return n.toLocaleString(htmlLang(locale));
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
