/**
 * Locale-aware Support verb for public hubs.
 * Keeps the campaign title on the second line (never "Support — title").
 */

import { prefersIndonesian, prefersPortuguese, prefersSpanish, prefersTagalog } from '@/lib/share';

export function supportVerb(localeHint?: string | null): string {
    const l = (localeHint || '').toLowerCase();
    if (l.startsWith('pt') || (!localeHint && prefersPortuguese())) return 'Apoiar';
    if (l.startsWith('id') || (!localeHint && prefersIndonesian())) return 'Dukung';
    if (l.startsWith('es') || (!localeHint && prefersSpanish())) return 'Apoyar';
    if (l.startsWith('tl') || l.startsWith('fil') || (!localeHint && prefersTagalog())) {
        return 'Supportahan';
    }
    return 'Support';
}

export function supportersLabel(count: number, localeHint?: string | null): string {
    const n = count.toLocaleString();
    const l = (localeHint || '').toLowerCase();
    if (l.startsWith('pt') || (!localeHint && prefersPortuguese())) {
        return `${n} apoiadores`;
    }
    if (l.startsWith('id') || (!localeHint && prefersIndonesian())) {
        return `${n} pendukung`;
    }
    if (l.startsWith('es') || (!localeHint && prefersSpanish())) {
        return `${n} seguidores`;
    }
    return `${n} supporters`;
}
