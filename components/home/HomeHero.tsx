"use client";

import { HomeLiveDemo } from '@/components/home/HomeLiveDemo';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

/**
 * First viewport is the tool. Copy follows EN / PT. One column so the
 * headline, lede, field and button share the same left edge.
 */
export function HomeHero() {
    const { messages } = useLocale();
    const t = messages.home;

    return (
        <section className={`relative ${PAGE_TOP_UNDER_NAV} pb-10`}>
            <div className="max-w-lg mx-auto px-5">
                <h1 className="font-display text-[1.75rem] sm:text-4xl font-extrabold leading-[1.12] tracking-tight text-center text-balance mb-3">
                    {t.headlineBefore}
                    <span className="text-brand">{t.headlineAccent}</span>.
                </h1>
                <p className="font-sans text-[15px] sm:text-base text-muted leading-relaxed text-left mb-6">
                    {t.lede}
                </p>
                <HomeLiveDemo />
            </div>
        </section>
    );
}
