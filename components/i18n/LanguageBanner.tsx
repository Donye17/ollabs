"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/i18n/LocaleProvider';
import {
    LOCALE_COOKIE,
    localeLandingPath,
    resolveLocale,
    type Locale,
} from '@/lib/i18n/locale';

const DISMISS_KEY = 'ollabs_locale_banner_dismissed';

type MarketingLocale = Locale | 'tl' | 'hi' | 'es';

function marketingLandingPath(locale: MarketingLocale): string | null {
    if (locale === 'tl') return '/tl';
    if (locale === 'hi') return '/hi';
    if (locale === 'es') return '/es';
    return localeLandingPath(locale);
}

/** Browser-first locale for soft banner offers (includes TL/HI/ES landings). */
function resolveMarketingLocale(languages: readonly string[]): MarketingLocale {
    for (const l of languages) {
        if (typeof l !== 'string') continue;
        const lower = l.toLowerCase();
        if (lower.startsWith('pt')) return 'pt';
        if (lower.startsWith('id')) return 'id';
        if (lower.startsWith('fil') || lower.startsWith('tl')) return 'tl';
        if (lower.startsWith('hi')) return 'hi';
        if (lower.startsWith('es')) return 'es';
    }
    return 'en';
}

function onMarketingLanding(pathname: string): MarketingLocale | null {
    if (pathname === '/pt' || pathname.startsWith('/pt/')) return 'pt';
    if (pathname === '/id' || pathname.startsWith('/id/')) return 'id';
    if (pathname === '/tl' || pathname.startsWith('/tl/')) return 'tl';
    if (pathname === '/hi' || pathname.startsWith('/hi/')) return 'hi';
    if (pathname === '/es' || pathname.startsWith('/es/')) return 'es';
    return null;
}

/**
 * Soft language offer. Never hard-redirects on first paint — that fights
 * WhatsApp WebViews. Choosing PT/ID can navigate to /pt or /id for SEO entry.
 */
export function LanguageBanner() {
    const pathname = usePathname() || '/';
    const landingLocale = onMarketingLanding(pathname);
    const onLocaleLanding = landingLocale != null;
    const { locale, setLocale, messages } = useLocale();
    const [visible, setVisible] = useState(false);
    const [suggested, setSuggested] = useState<MarketingLocale | null>(null);

    useEffect(() => {
        try {
            if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
        } catch { /* ignore */ }

        const nav = resolveMarketingLocale(
            typeof navigator !== 'undefined' ? navigator.languages : []
        );

        const cookie = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
        const cookieLocale = cookie?.[1];

        // On the English site: offer a locale landing when the browser says so,
        // unless they already chose English explicitly.
        if (!onLocaleLanding && nav !== 'en') {
            if (cookieLocale === 'en') return;
            setSuggested(nav);
            setVisible(true);
            return;
        }

        // On a locale landing: offer English when the browser is English-first.
        if (landingLocale === 'pt' && nav === 'en' && locale === 'pt') {
            setSuggested('en');
            setVisible(true);
            return;
        }
        if (landingLocale === 'id' && nav === 'en' && locale === 'id') {
            setSuggested('en');
            setVisible(true);
            return;
        }
        if ((landingLocale === 'tl' || landingLocale === 'hi' || landingLocale === 'es') && nav === 'en') {
            setSuggested('en');
            setVisible(true);
        }
    }, [onLocaleLanding, landingLocale, locale]);

    if (!visible || !suggested) return null;

    const dismiss = () => {
        try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
        setVisible(false);
    };

    const accept = () => {
        if (suggested === 'pt' || suggested === 'id' || suggested === 'en') {
            setLocale(suggested);
        }
        dismiss();
        const landing = marketingLandingPath(suggested);
        if (landing && !onLocaleLanding) {
            window.location.href = landing;
            return;
        }
        if (suggested === 'en' && onLocaleLanding) {
            window.location.href = '/';
        }
    };

    const copy =
        suggested === 'pt'
            ? {
                suggest: 'Parece que você fala português. Quer ver o Ollabs em português?',
                switchTo: 'Usar português',
                dismiss: 'Manter inglês',
            }
            : suggested === 'id'
              ? {
                  suggest: 'Sepertinya kamu pakai bahasa Indonesia. Mau lihat Ollabs dalam Bahasa?',
                  switchTo: 'Pakai Bahasa',
                  dismiss: 'Tetap English',
              }
              : suggested === 'tl'
                ? {
                    suggest: 'Mukhang Tagalog ang wika mo. Gusto mo bang makita ang Ollabs sa Filipino?',
                    switchTo: 'Gamitin ang Filipino',
                    dismiss: 'Keep English',
                }
                : suggested === 'hi'
                  ? {
                      suggest: 'लगता है आप हिंदी बोलते हैं। क्या Ollabs हिंदी में देखना चाहेंगे?',
                      switchTo: 'हिंदी में देखें',
                      dismiss: 'Keep English',
                  }
                  : suggested === 'es'
                    ? {
                        suggest: 'Parece que hablas español. ¿Quieres ver Ollabs en español?',
                        switchTo: 'Usar español',
                        dismiss: 'Keep English',
                    }
                    : messages.banner;

    return (
        <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] inset-x-0 z-50 px-3 pointer-events-none sm:bottom-4">
            <div className="pointer-events-auto max-w-lg mx-auto bg-ink text-paper rounded-2xl px-4 py-3 shadow-lg flex flex-col sm:flex-row sm:items-center gap-3">
                <p className="text-sm flex-1 leading-snug">{copy.suggest}</p>
                <div className="flex gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={accept}
                        className="flex-1 sm:flex-none min-h-[40px] px-3 rounded-xl bg-brand text-ink text-xs font-bold"
                    >
                        {copy.switchTo}
                    </button>
                    <button
                        type="button"
                        onClick={dismiss}
                        className="flex-1 sm:flex-none min-h-[40px] px-3 rounded-xl border border-paper/20 text-xs font-semibold text-paper/80"
                    >
                        {copy.dismiss}
                    </button>
                </div>
            </div>
            <span className="sr-only">
                <Link href="/pt">Português</Link>
                <Link href="/id">Bahasa Indonesia</Link>
                <Link href="/tl">Filipino</Link>
                <Link href="/hi">Hindi</Link>
                <Link href="/es">Español</Link>
            </span>
        </div>
    );
}
