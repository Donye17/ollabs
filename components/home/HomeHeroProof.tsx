'use client';

import { useLocale } from '@/components/i18n/LocaleProvider';
import { formatCount } from '@/lib/i18n/locale';

/** Same sentence that used to sit under the Top campaigns fan, now inside the hero line. */
export function HomeHeroProofText({ count }: { count: number }) {
    const { locale, messages } = useLocale();
    if (!count) return null;
    const proof = messages.home.framedTheirs.replace('{count}', formatCount(count, locale));
    return <span>{proof}</span>;
}
