const BASE_URL = 'https://ollabs.studio';

const PT_TO_EN: Record<string, string> = {
    igrejas: 'churches',
    escolas: 'schools',
    times: 'sports-teams',
    ongs: 'nonprofits',
    eventos: 'events',
    conscientizacao: 'awareness-campaigns',
};

export function englishSlugFromPt(ptSlug: string): string {
    return PT_TO_EN[ptSlug] || ptSlug;
}

const EN_TO_PT: Record<string, string> = Object.fromEntries(
    Object.entries(PT_TO_EN).map(([ptSlug, enSlug]) => [enSlug, ptSlug])
);

/** Builds the hreflang cluster for a use-case page. English and Portuguese only. */
export function useCaseLanguageAlternates(enSlug: string): Record<string, string> {
    const englishUrl = `${BASE_URL}/for/${enSlug}`;
    const languages: Record<string, string> = {
        en: englishUrl,
        'x-default': englishUrl,
    };

    if (EN_TO_PT[enSlug]) languages['pt-BR'] = `${BASE_URL}/pt/for/${EN_TO_PT[enSlug]}`;

    return languages;
}
