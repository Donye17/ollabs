'use client';

import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { useLocale } from '@/components/i18n/LocaleProvider';

type Props = {
    /** Extra class on the outer footer (e.g. safe-area padding). */
    className?: string;
};

/**
 * Compact marketing footer. Guides live here so day/vs/explore match home.
 * Keep lean: no second Product column.
 */
export function SiteFooter({ className = '' }: Props) {
    const { locale, messages } = useLocale();
    const t = messages.footer;
    const guidesHref = locale === 'pt' ? '/pt/guides' : '/guides';
    return (
        <footer
            className={`border-t border-ink/10 bg-paper py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] ${className}`}
        >
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
                <BrandMark href="/" size={24} />
                <nav className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1" aria-label={t.label}>
                    <Link href={guidesHref} className="min-h-11 inline-flex items-center px-2 hover:text-brand-deep transition-colors">
                        {t.guides}
                    </Link>
                    <span aria-hidden className="text-ink/20">
                        ·
                    </span>
                    <Link href="/about" className="min-h-11 inline-flex items-center px-2 hover:text-brand-deep transition-colors">
                        {t.about}
                    </Link>
                    <span aria-hidden className="text-ink/20">
                        ·
                    </span>
                    <Link href="/contact" className="min-h-11 inline-flex items-center px-2 hover:text-brand-deep transition-colors">
                        {t.contact}
                    </Link>
                    <span aria-hidden className="text-ink/20">
                        ·
                    </span>
                    <Link href="/for" className="min-h-11 inline-flex items-center px-2 hover:text-brand-deep transition-colors">
                        {t.useCases}
                    </Link>
                    <span aria-hidden className="text-ink/20">
                        ·
                    </span>
                    <Link href="/privacy" className="min-h-11 inline-flex items-center px-2 hover:text-brand-deep transition-colors">
                        {t.privacy}
                    </Link>
                    <span aria-hidden className="text-ink/20">
                        ·
                    </span>
                    <Link href="/terms" className="min-h-11 inline-flex items-center px-2 hover:text-brand-deep transition-colors">
                        {t.terms}
                    </Link>
                </nav>
                <p className="text-center sm:text-right">&copy; {new Date().getFullYear()} Ollabs</p>
            </div>
        </footer>
    );
}
