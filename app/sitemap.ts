import { MetadataRoute } from 'next';
import { USE_CASES } from '@/lib/useCases';
import { USE_CASES_PT } from '@/lib/useCasesPt';
import {
    englishSlugFromPt,
    useCaseLanguageAlternates,
} from '@/lib/useCaseHreflang';
import { DAYS } from '@/lib/days';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ollabs.studio';
    const homeLanguages = {
        en: baseUrl,
        'pt-BR': `${baseUrl}/pt`,
        'x-default': baseUrl,
    };
    const twibbonizeLanguages = {
        en: `${baseUrl}/vs/twibbonize`,
        'pt-BR': `${baseUrl}/pt/vs/twibbonize`,
        'x-default': `${baseUrl}/vs/twibbonize`,
    };
    const forLanguages = {
        en: `${baseUrl}/for`,
        'pt-BR': `${baseUrl}/pt/for`,
        'x-default': `${baseUrl}/for`,
    };

    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
            alternates: { languages: homeLanguages },
        },
        {
            url: `${baseUrl}/pt`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.95,
            alternates: { languages: homeLanguages },
        },
        { url: `${baseUrl}/pt/vs/twibbonize`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85, alternates: { languages: twibbonizeLanguages } },
        { url: `${baseUrl}/vs/linktree`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${baseUrl}/create`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/updates`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
        { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/for`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8, alternates: { languages: forLanguages } },
        { url: `${baseUrl}/pt/for`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.82, alternates: { languages: forLanguages } },
        ...USE_CASES.map((u) => ({
            url: `${baseUrl}/for/${u.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
            alternates: { languages: useCaseLanguageAlternates(u.slug) },
        })),
        ...USE_CASES_PT.map((u) => ({
            url: `${baseUrl}/pt/for/${u.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.82,
            alternates: { languages: useCaseLanguageAlternates(englishSlugFromPt(u.slug)) },
        })),
        { url: `${baseUrl}/day`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        ...DAYS.map((d) => ({
            url: `${baseUrl}/day/${d.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        })),
        { url: `${baseUrl}/day/national-coffee-day/independents`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
        { url: `${baseUrl}/vs/twibbonize`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8, alternates: { languages: twibbonizeLanguages } },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.55 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.4 },
        { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/guides/hub`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/guides/start-a-campaign`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ];

    return routes;
}
