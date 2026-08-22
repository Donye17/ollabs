/**
 * Lightweight locale for Ollabs.
 *
 * Not a full i18n framework. Two locales, a cookie, and dictionaries for the
 * surfaces that convert: campaign supporter chrome, create/publish, and the
 * Portuguese landing. Marketing English stays the default site; /pt is the
 * SEO entry for Brazil.
 */

export type Locale = 'en' | 'pt';

export const LOCALES: Locale[] = ['en', 'pt'];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'ollabs_locale';

export function isLocale(value: string | null | undefined): value is Locale {
    return value === 'en' || value === 'pt';
}

/** Prefer an explicit locale, then cookie, then navigator (pt*), else English. */
export function resolveLocale(opts: {
    explicit?: string | null;
    cookie?: string | null;
    languages?: readonly string[];
}): Locale {
    if (isLocale(opts.explicit)) return opts.explicit;
    if (isLocale(opts.cookie)) return opts.cookie;
    const langs = opts.languages || [];
    if (langs.some((l) => typeof l === 'string' && l.toLowerCase().startsWith('pt'))) {
        return 'pt';
    }
    return DEFAULT_LOCALE;
}

export function htmlLang(locale: Locale): string {
    return locale === 'pt' ? 'pt-BR' : 'en';
}

export function ogLocale(locale: Locale): string {
    return locale === 'pt' ? 'pt_BR' : 'en_US';
}
