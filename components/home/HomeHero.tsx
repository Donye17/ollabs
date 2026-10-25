"use client";

import type { ReactNode } from 'react';
import { HomeLiveDemo } from '@/components/home/HomeLiveDemo';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

/**
 * First viewport is the tool. Copy follows EN / PT. One column so the
 * headline, lede, field and button share the same left edge.
 * Cyan stays on the Create button. The headline does not borrow it.
 */
export function HomeHero({ proof }: { proof?: ReactNode }) {
    const { messages } = useLocale();
    const t = messages.home;

    return (
        <section className={`relative ${PAGE_TOP_UNDER_NAV} pb-10`}>
            <div className="max-w-lg mx-auto px-5">
                <h1 className="font-display text-[1.75rem] sm:text-4xl font-extrabold leading-[1.12] tracking-tight text-center text-balance mb-3">
                    {t.headlineBefore}
                    {t.headlineAccent}.
                </h1>
                <p className="font-sans text-[15px] sm:text-base text-ink/80 leading-relaxed text-left mb-6">
                    {t.lede}
                    {proof ? <> {proof}</> : null}
                </p>
                <HomeLiveDemo />
            </div>
        </section>
    );
}
