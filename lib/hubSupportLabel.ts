/**
 * Locale-aware Join verb for public hubs.
 * Keeps the campaign title on the second line, never in the same line as Join.
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

function wantsPortuguese(localeHint?: string | null): boolean {
    const l = (localeHint || '').toLowerCase();
    return l.startsWith('pt') || (!localeHint && prefersPortuguese());
}

/** One sentence so a hub is a page about a person, not only a button. */
export function hubExplainer(localeHint?: string | null): string {
    if (wantsPortuguese(localeHint)) {
        return 'Um hub reúne as campanhas desta pessoa: a bio, a moldura em destaque e um link para participar.';
    }
    return 'A hub gathers this organizer\'s campaigns: a short bio, the featured frame, and one link to join.';
}

export function moreCampaignsLabel(localeHint?: string | null): string {
    if (wantsPortuguese(localeHint)) return 'Mais campanhas';
    return 'More campaigns';
}

export function hubNotReadyLabel(localeHint?: string | null): string {
    if (wantsPortuguese(localeHint)) return 'Este hub ainda não está pronto.';
    return 'This hub is not ready yet.';
}
