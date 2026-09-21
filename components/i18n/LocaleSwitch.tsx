"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from '@/components/i18n/LocaleProvider';
import type { Locale } from '@/lib/i18n/locale';

/**
 * Compact EN | PT. Switching to Portuguese on `/` stays on `/`.
 * `/pt` is the SEO landing, not the product UI. English from `/pt` goes home.
 */
export function LocaleSwitch() {
    const { locale, setLocale, messages } = useLocale();
    const pathname = usePathname() || '/';
    const router = useRouter();

    const pick = (next: Locale) => {
        setLocale(next);
        const onPtLanding = pathname === '/pt' || pathname.startsWith('/pt/');
        if (next === 'en' && onPtLanding) {
            router.push('/');
        }
    };

    const btn = (code: 'en' | 'pt', label: string) => {
        const active = locale === code;
        return (
            <button
                type="button"
                onClick={() => pick(code)}
                aria-pressed={active}
                className={`min-h-11 min-w-11 px-1.5 rounded-lg font-sans text-xs font-bold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    active ? 'text-ink' : 'text-muted hover:text-brand-deep'
                }`}
            >
                {label}
            </button>
        );
    };

    return (
        <div
            role="group"
            aria-label={messages.nav.language}
            className="inline-flex items-center shrink-0"
        >
            {btn('en', messages.nav.english)}
            <span className="text-muted/35 text-xs select-none" aria-hidden>
                |
            </span>
            {btn('pt', messages.nav.portuguese)}
        </div>
    );
}
