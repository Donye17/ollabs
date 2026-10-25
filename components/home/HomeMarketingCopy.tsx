"use client";

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/components/i18n/LocaleProvider';

/** Closing line. The free and no-account promise already lives in the hero. */
export function HomeBottomCta() {
    const { messages } = useLocale();
    const t = messages.home;

    return (
        <section className="py-20 border-t border-ink/10">
            <div className="max-w-lg mx-auto px-5">
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-center tracking-tight">
                    {t.ctaTitle}
                </h2>
                <p className="font-sans text-[15px] leading-relaxed text-ink/80 mb-8 text-left">{t.ctaBody}</p>
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
