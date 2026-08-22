import { EN_SLUG, englishUseCaseSlug } from '@/lib/useCasesEs';

const BASE_URL = 'https://ollabs.studio';

const PT_TO_EN: Record<string, string> = {
    igrejas: 'churches',
    escolas: 'schools',
    times: 'sports-teams',
    ongs: 'nonprofits',
    eventos: 'events',
    conscientizacao: 'awareness-campaigns',
};

const ID_TO_EN: Record<string, string> = {
    kampus: 'universities',
    sekolah: 'schools',
    acara: 'events',
    kampanye: 'awareness-campaigns',
    komunitas: 'nonprofits',
    masjid: 'churches',
};

const TL_TO_EN: Record<string, string> = {
    simbahan: 'churches',
    paaralan: 'schools',
    'mga-event': 'events',
    komunidad: 'nonprofits',
    kamalayan: 'awareness-campaigns',
};

export function englishSlugFromPt(ptSlug: string): string {
    return PT_TO_EN[ptSlug] || ptSlug;
}

export function englishSlugFromId(idSlug: string): string {
    return ID_TO_EN[idSlug] || idSlug;
}

export function englishSlugFromTl(tlSlug: string): string {
    return TL_TO_EN[tlSlug] || tlSlug;
}

export const englishSlugFromEs = englishUseCaseSlug;

const reverseMap = (map: Record<string, string>): Record<string, string> =>
    Object.fromEntries(Object.entries(map).map(([localeSlug, enSlug]) => [enSlug, localeSlug]));

const EN_TO_PT = reverseMap(PT_TO_EN);
const EN_TO_ID = reverseMap(ID_TO_EN);
const EN_TO_ES = reverseMap(EN_SLUG);
const EN_TO_TL = reverseMap(TL_TO_EN);

/** Builds the complete hreflang cluster shared by every available translation. */
export function useCaseLanguageAlternates(enSlug: string): Record<string, string> {
    const englishUrl = `${BASE_URL}/for/${enSlug}`;
    const languages: Record<string, string> = {
        en: englishUrl,
        'x-default': englishUrl,
    };

    if (EN_TO_PT[enSlug]) languages['pt-BR'] = `${BASE_URL}/pt/for/${EN_TO_PT[enSlug]}`;
    if (EN_TO_ID[enSlug]) languages.id = `${BASE_URL}/id/for/${EN_TO_ID[enSlug]}`;
    if (EN_TO_ES[enSlug]) languages.es = `${BASE_URL}/es/for/${EN_TO_ES[enSlug]}`;
    if (EN_TO_TL[enSlug]) languages.tl = `${BASE_URL}/tl/for/${EN_TO_TL[enSlug]}`;

    return languages;
}
