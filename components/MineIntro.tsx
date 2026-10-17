'use client';

import Link from 'next/link';
import { useLocale } from '@/components/i18n/LocaleProvider';

export function MineIntro() {
    const t = useLocale().messages.mine;
    return (
        <div className="max-w-2xl lg:max-w-3xl mx-auto text-center">
            <h1 className="font-display text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">{t.title}</h1>
            <p className="text-[15px] sm:text-base text-ink/70 leading-relaxed">{t.lede}</p>
        </div>
    );
}

export function MineFooter() {
    const t = useLocale().messages.mine;
    return (
        <p className="text-center text-sm text-muted mt-6 max-w-2xl mx-auto">
            <Link href="/updates" className="text-brand-deep font-semibold hover:underline">
                {t.whatsNew}
            </Link>
            {' · '}
            {t.otherDevice}{' '}
            <Link href="/login" className="text-brand-deep font-semibold hover:underline">
                {t.signInCode}
            </Link>
            {' '}{t.or}{' '}
            <Link href="/recover" className="text-brand-deep font-semibold hover:underline">
                {t.recoveryEmail}
            </Link>
        </p>
    );
}
