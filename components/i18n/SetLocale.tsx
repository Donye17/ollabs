"use client";

import { useEffect } from 'react';
import { useLocale } from '@/components/i18n/LocaleProvider';
import type { Locale } from '@/lib/i18n/locale';

/** Lock the UI locale for a route tree (e.g. /pt) without nesting providers. */
export function SetLocale({ locale }: { locale: Locale }) {
    const { setLocale } = useLocale();
    useEffect(() => {
        setLocale(locale);
    }, [locale, setLocale]);
    return null;
}
