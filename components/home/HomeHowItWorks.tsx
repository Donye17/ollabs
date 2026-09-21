"use client";

import React from 'react';
import { useLocale } from '@/components/i18n/LocaleProvider';

/** Product-led flow strip. No icon cards. The steps are the story. */
export function HomeHowItWorks() {
    const { messages } = useLocale();
    const t = messages.home;
    const flow = [
        { n: '1', title: t.how1Title, body: t.how1Body },
        { n: '2', title: t.how2Title, body: t.how2Body },
        { n: '3', title: t.how3Title, body: t.how3Body },
    ];

    return (
        <section className="py-16 sm:py-20 border-t border-ink/10">
            <div className="max-w-lg mx-auto px-5">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-center tracking-tight mb-10">
                    {t.howTitle}
                </h2>
                <ol className="grid grid-cols-1 gap-6 list-none">
                    {flow.map((step) => (
                        <li key={step.n} className="text-left">
                            <p className="font-sans text-sm font-semibold text-muted mb-1">
                                {step.n}. {step.title}
                            </p>
                            <p className="font-sans text-[15px] text-ink/70 leading-relaxed">
                                {step.body}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
