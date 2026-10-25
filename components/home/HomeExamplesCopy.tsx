"use client";

import Link from 'next/link';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { EXAMPLE_PUBLIC_HUB } from '@/lib/hub';

export function HomeExamplesCopy() {
    const { messages } = useLocale();
    const t = messages.home;

    return (
        <>
            <h2 className="font-display text-center text-2xl sm:text-3xl font-bold tracking-tight mb-2 max-w-lg mx-auto px-5">
                {t.topCampaigns}
            </h2>
            <p className="font-sans text-left text-[15px] text-ink/65 mb-3 max-w-lg mx-auto px-5 leading-relaxed">
                {t.topCampaignsBody}
            </p>
            <p className="mb-8 max-w-lg mx-auto px-5">
                <Link
                    href={`/u/${EXAMPLE_PUBLIC_HUB.handle}`}
                    className="inline-flex min-h-11 items-center font-semibold text-brand-deep"
                >
                    {t.seeHub}
                </Link>
            </p>
        </>
    );
}

export function HomeCalendarLink() {
    const { messages } = useLocale();

    return (
        <p className="mt-8 text-left max-w-lg mx-auto px-5 font-sans text-[15px] leading-relaxed">
            <Link href="/day" className="font-semibold text-brand-deep hover:underline">
                {messages.home.calendarLink}
            </Link>
        </p>
    );
}
