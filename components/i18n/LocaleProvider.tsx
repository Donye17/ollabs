"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMessages, type Messages } from '@/lib/i18n/messages';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, resolveLocale, type Locale } from '@/lib/i18n/locale';

type LocaleContextValue = {
    locale: Locale;
    messages: Messages;
    setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(locale: Locale) {
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function LocaleProvider({
    children,
    initialLocale,
}: {
    children: React.ReactNode;
    /** From a /pt layout or server cookie read. */
    initialLocale?: Locale;
}) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale || DEFAULT_LOCALE);

    useEffect(() => {
        if (initialLocale) {
            writeCookie(initialLocale);
            return;
        }
        const next = resolveLocale({
            cookie: readCookie(LOCALE_COOKIE),
            languages: typeof navigator !== 'undefined' ? navigator.languages : [],
        });
        setLocaleState(next);
    }, [initialLocale]);

    const setLocale = useCallback((next: Locale) => {
        if (!isLocale(next)) return;
        writeCookie(next);
        setLocaleState(next);
    }, []);

    const value = useMemo(
        () => ({ locale, messages: getMessages(locale), setLocale }),
        [locale, setLocale]
    );

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
    const ctx = useContext(LocaleContext);
    if (!ctx) {
        return {
            locale: DEFAULT_LOCALE,
            messages: getMessages(DEFAULT_LOCALE),
            setLocale: () => {},
        };
    }
    return ctx;
}
