"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { LOCALE_COOKIE, resolveLocale, type Locale } from '@/lib/i18n/locale';

const DISMISS_KEY = 'ollabs_locale_banner_dismissed';

/**
 * Soft language offer. Never hard-redirects on first paint — that fights
 * WhatsApp WebViews. Choosing Portuguese can navigate to /pt for SEO entry.
 */
export function LanguageBanner() {
    const pathname = usePathname() || '/';
    const onPtSite = pathname === '/pt' || pathname.startsWith('/pt/');
    const { locale, setLocale, messages } = useLocale();
    const [visible, setVisible] = useState(false);
    const [suggested, setSuggested] = useState<Locale | null>(null);

    useEffect(() => {
        try {
            if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
        } catch { /* ignore */ }

        const nav = resolveLocale({
            languages: typeof navigator !== 'undefined' ? navigator.languages : [],
        });

        if (!onPtSite && nav === 'pt') {
            const cookie = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
            if (cookie?.[1] === 'en') return;
            setSuggested('pt');
            setVisible(true);
            return;
        }

        if (onPtSite && nav === 'en' && locale === 'pt') {
            setSuggested('en');
            setVisible(true);
        }
    }, [onPtSite, locale]);

    if (!visible || !suggested) return null;

    const dismiss = () => {
        try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
        setVisible(false);
    };

    const accept = () => {
        setLocale(suggested);
        dismiss();
        if (suggested === 'pt' && !onPtSite) {
            window.location.href = '/pt';
            return;
        }
        if (suggested === 'en' && onPtSite) {
            window.location.href = '/';
        }
    };

    const copy = suggested === 'pt'
        ? {
            suggest: 'Parece que você fala português. Quer ver o Ollabs em português?',
            switchTo: 'Usar português',
            dismiss: 'Manter inglês',
        }
        : messages.banner;

    return (
        <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] inset-x-0 z-50 px-3 pointer-events-none sm:bottom-4">
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
            <span className="sr-only"><Link href="/pt">Português</Link></span>
        </div>
    );
}
