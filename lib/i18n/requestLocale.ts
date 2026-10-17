import { cookies } from 'next/headers';
import { getMessages, type Messages } from '@/lib/i18n/messages';
import { LOCALE_COOKIE, resolveLocale, type Locale } from '@/lib/i18n/locale';

/** Locale for server metadata. Cookie wins. Crawlers with no cookie stay on English. */
export async function requestLocale(): Promise<Locale> {
    const jar = await cookies();
    return resolveLocale({ cookie: jar.get(LOCALE_COOKIE)?.value ?? null });
}

export async function requestMessages(): Promise<{ locale: Locale; messages: Messages }> {
    const locale = await requestLocale();
    return { locale, messages: getMessages(locale) };
}
