/**
 * Locale-aware Join verb for public hubs.
 * Keeps the campaign title on the second line (never "Join — title").
 *
 * "Support" reads as donate in English; Join matches the real job: open the
 * frame and put your photo in it.
 */

import { prefersIndonesian, prefersPortuguese, prefersSpanish, prefersTagalog } from '@/lib/share';

export function supportVerb(localeHint?: string | null): string {
    const l = (localeHint || '').toLowerCase();
    if (l.startsWith('pt') || (!localeHint && prefersPortuguese())) return 'Participar';
    if (l.startsWith('id') || (!localeHint && prefersIndonesian())) return 'Gabung';
    if (l.startsWith('es') || (!localeHint && prefersSpanish())) return 'Unirme';
    if (l.startsWith('tl') || l.startsWith('fil') || (!localeHint && prefersTagalog())) {
        return 'Sumali';
    }
    return 'Join';
}

export function supportersLabel(count: number, localeHint?: string | null): string {
    const n = count.toLocaleString();
    const l = (localeHint || '').toLowerCase();
    if (l.startsWith('pt') || (!localeHint && prefersPortuguese())) {
        return `${n} participantes`;
    }
    if (l.startsWith('id') || (!localeHint && prefersIndonesian())) {
        return `${n} bergabung`;
    }
    if (l.startsWith('es') || (!localeHint && prefersSpanish())) {
        return `${n} unidos`;
    }
    if (l.startsWith('tl') || l.startsWith('fil') || (!localeHint && prefersTagalog())) {
        return `${n} sumali`;
    }
    return `${n} joined`;
}
