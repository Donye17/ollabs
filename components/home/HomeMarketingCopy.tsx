"use client";

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/components/i18n/LocaleProvider';

const audiences = [
    { label: 'Fundraisers', href: '/for/fundraisers' },
    { label: 'Nonprofits', href: '/for/nonprofits' },
    { label: 'Sports teams', href: '/for/sports-teams' },
    { label: 'Churches', href: '/for/churches' },
    { label: 'Schools', href: '/for/schools' },
    { label: 'Events', href: '/for/events' },
];

const audiencesPt: Record<string, string> = {
    '/for/fundraisers': 'Arrecadação',
    '/for/nonprofits': 'ONGs',
    '/for/sports-teams': 'Times',
    '/for/churches': 'Igrejas',
    '/for/schools': 'Escolas',
    '/for/events': 'Eventos',
};

/** Below-fold homepage copy that follows EN / PT. Same 32rem column as the hero. */
export function HomeMarketingCopy() {
    const { locale, messages } = useLocale();
    const t = messages.home;

    return (
        <>
            <section className="py-14 border-t border-ink/10">
                <div className="max-w-lg mx-auto px-5">
                    <p className="font-sans text-sm text-muted font-semibold mb-4 text-center">
                        {t.madeFor}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
                        {audiences.map((a) => (
                            <Link
                                key={a.href}
                                href={a.href}
                                className="inline-flex min-h-11 items-center px-2 font-medium text-ink hover:text-brand-deep transition-colors"
                            >
                                {locale === 'pt' ? audiencesPt[a.href] ?? a.label : a.label}
                            </Link>
                        ))}
                    </div>
                    <div className="mt-2 text-center">
                        <Link href="/for" className="inline-flex min-h-11 items-center font-sans text-sm font-semibold text-brand-deep hover:underline">
                            {t.seeAllUseCases}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 border-t border-ink/10">
                <div className="max-w-lg mx-auto px-5">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-center tracking-tight">
                        {t.freeTitle}
                    </h2>
                    <p className="font-sans text-[15px] text-ink/70 leading-relaxed text-left">
                        {t.freeBody}
                    </p>
                </div>
            </section>
        </>
    );
}

export function HomeBottomCta() {
    const { messages } = useLocale();
    const t = messages.home;

    return (
        <section className="py-20 border-t border-ink/10">
            <div className="max-w-lg mx-auto px-5">
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-center tracking-tight">
                    {t.ctaTitle}
                </h2>
                <p className="font-sans text-[15px] leading-relaxed text-ink/70 mb-8 text-left">{t.ctaBody}</p>
                <Link
                    href="/create"
                    className="inline-flex min-h-11 w-full justify-center px-8 rounded-xl bg-brand text-ink font-sans font-bold text-[15px] items-center gap-2 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-all"
                >
                    {t.create}
                    <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
            </div>
        </section>
    );
}
