"use client";

import Link from 'next/link';
import { useLocale } from '@/components/i18n/LocaleProvider';

export function HomeExamplesCopy() {
    const { messages } = useLocale();
    const t = messages.home;

    return (
        <>
            <h2 className="font-display text-center text-lg font-bold tracking-tight mb-4 max-w-lg mx-auto px-5">
                {t.topCampaigns}
            </h2>
        </>
    );
}

export function HomeCalendarLink() {
    const { messages } = useLocale();

    return (
        <p className="mt-4 text-center max-w-lg mx-auto px-5 font-sans text-sm leading-relaxed">
            <Link href="/day" className="inline-flex min-h-11 items-center text-sm font-medium text-ink/80 hover:underline">
                {messages.home.calendarLink}
            </Link>
        </p>
    );
}
