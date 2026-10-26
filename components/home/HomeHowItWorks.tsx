"use client";

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

/** Product-led flow. Three steps sit in a row once the screen is wide enough. */
export function HomeHowItWorks() {
    const { locale, messages } = useLocale();
    const t = messages.home;
    const flow = [
        { n: '1', title: t.how1Title, body: t.how1Body },
        { n: '2', title: t.how2Title, body: t.how2Body },
        { n: '3', title: t.how3Title, body: t.how3Body },
    ];

    return (
        <section className="border-t border-ink/10 py-12 sm:py-16">
            <div className="mx-auto max-w-5xl px-5">
                <h2 className="mb-8 text-center font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    {t.howTitle}
                </h2>
                <ol className="grid list-none grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                    {flow.map((step) => (
                        <li key={step.n} className="text-left">
                            <p className="mb-1 font-sans text-sm font-semibold text-ink/80">
                                {step.n}. {step.title}
                            </p>
                            <p className="font-sans text-[15px] leading-relaxed text-ink/80">
                                {step.body}
                            </p>
                        </li>
                    ))}
                </ol>
                <p className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center font-sans text-sm leading-relaxed text-ink/80">
                    <span className="font-semibold text-ink">{t.madeFor}</span>
                    {audiences.map((a, i) => (
                        <span key={a.href} className="inline-flex items-center gap-1.5">
                            {i > 0 && <span className="text-ink/40">·</span>}
                            <Link href={a.href} className="inline-flex min-h-11 items-center text-ink/80 hover:underline">
                                {locale === 'pt' ? audiencesPt[a.href] ?? a.label : a.label}
                            </Link>
                        </span>
                    ))}
                </p>
                <p className="mt-1 text-center">
                    <Link
                        href="/for"
                        className="inline-flex min-h-11 items-center font-sans text-sm text-ink/80 hover:underline"
                    >
                        {t.seeAllUseCases}
                    </Link>
                </p>
            </div>
        </section>
    );
}
