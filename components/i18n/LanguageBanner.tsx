"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/i18n/LocaleProvider';
import {
    LOCALE_COOKIE,
    localeLandingPath,
    type Locale,
} from '@/lib/i18n/locale';
import { shouldHideLanguageBanner, shouldShowMobileOrganizerNav, MOBILE_NAV_H } from '@/lib/mobileNav';
import { track } from '@/lib/analytics';

const DISMISS_KEY = 'ollabs_locale_banner_dismissed';

type MarketingLocale = Locale | 'tl' | 'hi' | 'es';

function marketingLandingPath(locale: MarketingLocale): string | null {
    if (locale === 'hi') return '/hi';
    return localeLandingPath(locale);
}

/** Browser-first locale for soft banner offers (product locales plus /hi). */
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
    if (pathname === '/hi' || pathname.startsWith('/hi/')) return 'hi';
    return null;
}

/**
 * Soft language offer. Never hard-redirects on first paint, that fights
 * WhatsApp WebViews. Portuguese can still open /pt. Spanish, Indonesian, and
 * Tagalog set the product-locale cookie and stay on the current page.
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
        if (landingLocale === 'hi' && nav === 'en') {
            setSuggested('en');
            setVisible(true);
        }
    }, [onLocaleLanding, landingLocale, locale]);

    if (!visible || !suggested) return null;
    // Never cover Save / Share / Create / Publish thumb bars.
    if (shouldHideLanguageBanner(pathname)) return null;

    const aboveOrganizerNav = shouldShowMobileOrganizerNav(pathname);

    const dismiss = () => {
        track('language_banner_dismiss', { suggested: suggested || 'unknown' });
        try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
        setVisible(false);
    };

    const accept = () => {
        track('language_banner_accept', { suggested });
        if (
            suggested === 'pt'
            || suggested === 'id'
            || suggested === 'en'
            || suggested === 'es'
            || suggested === 'tl'
        ) {
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
        <div
            className={`fixed inset-x-0 z-30 px-3 pointer-events-none sm:bottom-4 ${
                aboveOrganizerNav ? '' : 'bottom-[calc(1rem+env(safe-area-inset-bottom,0px))]'
            }`}
            style={
                aboveOrganizerNav
                    ? {
                          bottom: `calc(${MOBILE_NAV_H} + 0.75rem + env(safe-area-inset-bottom, 0px))`,
                      }
                    : undefined
            }
        >
            <div className="pointer-events-auto max-w-lg mx-auto bg-ink text-paper rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
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
                <Link href="/hi">Hindi</Link>
            </span>
        </div>
    );
}
