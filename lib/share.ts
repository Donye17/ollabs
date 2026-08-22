// Share helpers shared by the publish screen and the campaign page.
//
// Both screens now open WhatsApp directly rather than asking the person to
// copy a link and go find the app themselves. Worth writing down why, because
// it is the highest-leverage measurement we have:
//
// Of the 88 campaigns that ever got a supporter, the median got its first one
// 4.5 minutes after publishing, 84% inside the first hour, and not one single
// campaign got its first supporter after 24 hours. A campaign either gets
// shared in the minutes right after it is built or it never does. Meanwhile
// 58% of campaigns created since Aug 15 have zero supporters, and those dead
// campaigns average 1.61 views each, so the link was never sent anywhere.
//
// The publish screen offered a Copy button and a QR code. That asks a person
// on a phone, very often already inside WhatsApp's in-app browser, to copy,
// leave the app, find the right group, long press and paste. Every step there
// is somewhere to lose them, at the one moment that decides the outcome.

import type { Locale } from '@/lib/i18n/locale';

/**
 * Whether to write share copy in Portuguese.
 *
 * Deliberately narrow: this switches a couple of sentences of WhatsApp paste
 * text. Prefer an explicit UI locale when one is set.
 */
export function prefersPortuguese(): boolean {
    if (typeof navigator === 'undefined') return false;
    const langs = [navigator.language, ...(navigator.languages || [])];
    return langs.some((l) => typeof l === 'string' && l.toLowerCase().startsWith('pt'));
}

export function prefersIndonesian(): boolean {
    if (typeof navigator === 'undefined') return false;
    const langs = [navigator.language, ...(navigator.languages || [])];
    return langs.some((l) => typeof l === 'string' && l.toLowerCase().startsWith('id'));
}

/** Resolve which language the WhatsApp paste should use. */
export function shareLocale(locale?: Locale | null): 'en' | 'pt' | 'id' {
    if (locale === 'pt' || locale === 'id' || locale === 'en') return locale;
    if (prefersPortuguese()) return 'pt';
    if (prefersIndonesian()) return 'id';
    return 'en';
}

/** @deprecated Prefer shareLocale. Kept for call sites that only care about PT. */
export function shareInPortuguese(locale?: Locale | null): boolean {
    return shareLocale(locale) === 'pt';
}

/** What an organizer sends when they have just published their campaign. */
export function organizerShareText(title: string, locale?: Locale | null): string {
    const lang = shareLocale(locale);
    if (lang === 'pt') return `Coloque a moldura "${title}" na sua foto de perfil:`;
    if (lang === 'id') return `Pasang bingkai "${title}" di foto profil kamu:`;
    return `Add the "${title}" frame to your profile picture:`;
}

/** What a supporter sends after adding the frame to their own photo. */
export function supporterShareText(title: string, locale?: Locale | null): string {
    const lang = shareLocale(locale);
    if (lang === 'pt') return `Adicionei a moldura "${title}" na minha foto. Adicione a sua:`;
    if (lang === 'id') return `Aku sudah pasang bingkai "${title}" di fotoku. Pasang juga:`;
    return `I just added the "${title}" frame to my photo on Ollabs. Add yours:`;
}

/**
 * A wa.me link with the message and URL already written.
 *
 * wa.me with no phone number opens WhatsApp's own contact picker, which is
 * exactly right here: the organizer chooses the group, and the message is
 * already composed so there is nothing to type.
 */
export function whatsappUrl(text: string, url: string): string {
    return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
}

/**
 * Whether this browser can hand a PNG to the OS share sheet.
 *
 * This matters more than it looks. On iOS, an <a download> is ignored inside
 * the WhatsApp and Instagram in-app browsers, which is where a large share of
 * these visitors are, so "Download" can quietly do nothing. Handing the file
 * to the share sheet gives them Save Image, or sending the picture straight
 * into a chat, and it works in those browsers.
 */
export function canShareFiles(files: File[]): boolean {
    if (typeof navigator === 'undefined') return false;
    const n = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
    if (typeof n.share !== 'function' || typeof n.canShare !== 'function') return false;
    try {
        return n.canShare({ files });
    } catch {
        return false;
    }
}
