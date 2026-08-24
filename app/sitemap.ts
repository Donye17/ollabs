import { MetadataRoute } from 'next';
import { pool } from '@/lib/neon';
import { USE_CASES } from '@/lib/useCases';
import { USE_CASES_PT } from '@/lib/useCasesPt';
import { USE_CASES_ID } from '@/lib/useCasesId';
import { USE_CASES_ES } from '@/lib/useCasesEs';
import { USE_CASES_TL } from '@/lib/useCasesTl';
import {
    englishSlugFromEs,
    englishSlugFromId,
    englishSlugFromPt,
    englishSlugFromTl,
    useCaseLanguageAlternates,
} from '@/lib/useCaseHreflang';
import { DAYS } from '@/lib/days';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ollabs.studio';
    const homeLanguages = {
        en: baseUrl,
        'pt-BR': `${baseUrl}/pt`,
        id: `${baseUrl}/id`,
        tl: `${baseUrl}/tl`,
        hi: `${baseUrl}/hi`,
        es: `${baseUrl}/es`,
        'x-default': baseUrl,
    };
    const twibbonizeLanguages = {
        en: `${baseUrl}/vs/twibbonize`,
        'pt-BR': `${baseUrl}/pt/vs/twibbonize`,
        id: `${baseUrl}/id/vs/twibbonize`,
        es: `${baseUrl}/es/vs/twibbonize`,
        tl: `${baseUrl}/tl/vs/twibbonize`,
        'x-default': `${baseUrl}/vs/twibbonize`,
    };
    const forLanguages = {
        en: `${baseUrl}/for`,
        'pt-BR': `${baseUrl}/pt/for`,
        id: `${baseUrl}/id/for`,
        es: `${baseUrl}/es/for`,
        tl: `${baseUrl}/tl/for`,
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
        {
            url: `${baseUrl}/id`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.95,
            alternates: { languages: homeLanguages },
        },
        { url: `${baseUrl}/tl`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: homeLanguages } },
        { url: `${baseUrl}/hi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: homeLanguages } },
        { url: `${baseUrl}/es`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: homeLanguages } },
        { url: `${baseUrl}/pt/vs/twibbonize`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85, alternates: { languages: twibbonizeLanguages } },
        { url: `${baseUrl}/id/vs/twibbonize`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85, alternates: { languages: twibbonizeLanguages } },
        { url: `${baseUrl}/es/vs/twibbonize`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85, alternates: { languages: twibbonizeLanguages } },
        { url: `${baseUrl}/tl/vs/twibbonize`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85, alternates: { languages: twibbonizeLanguages } },
        { url: `${baseUrl}/vs/linktree`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${baseUrl}/create`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/updates`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
        { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/for`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8, alternates: { languages: forLanguages } },
        { url: `${baseUrl}/pt/for`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.82, alternates: { languages: forLanguages } },
        { url: `${baseUrl}/id/for`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.82, alternates: { languages: forLanguages } },
        { url: `${baseUrl}/es/for`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.82, alternates: { languages: forLanguages } },
        { url: `${baseUrl}/tl/for`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.82, alternates: { languages: forLanguages } },
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
        ...USE_CASES_ID.map((u) => ({
            url: `${baseUrl}/id/for/${u.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.82,
            alternates: { languages: useCaseLanguageAlternates(englishSlugFromId(u.slug)) },
        })),
        ...USE_CASES_ES.map((u) => ({
            url: `${baseUrl}/es/for/${u.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.82,
            alternates: { languages: useCaseLanguageAlternates(englishSlugFromEs(u.slug)) },
        })),
        ...USE_CASES_TL.map((u) => ({
            url: `${baseUrl}/tl/for/${u.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.82,
            alternates: { languages: useCaseLanguageAlternates(englishSlugFromTl(u.slug)) },
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
        { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/guides/hub`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/guides/start-a-campaign`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ];

    try {
        const result = await pool.query(
            `SELECT slug, created_at FROM campaigns WHERE is_public = true AND is_hidden IS NOT TRUE ORDER BY created_at DESC LIMIT 5000`
        );
        const campaignRoutes: MetadataRoute.Sitemap = result.rows.map((row) => ({
            url: `${baseUrl}/c/${row.slug}`,
            lastModified: row.created_at ? new Date(row.created_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        // Hubs with something to show (bio, link, or a public campaign). Empty
        // handle claims stay noindex via the page metadata and are omitted here.
        let hubRoutes: MetadataRoute.Sitemap = [];
        try {
            const hubs = await pool.query(
                `SELECT o.handle, o.hub_updated_at, o.created_at
                 FROM organizers o
                 WHERE o.handle IS NOT NULL
                   AND (
                     (o.bio IS NOT NULL AND length(trim(o.bio)) > 0)
                     OR EXISTS (
                       SELECT 1 FROM organizer_hub_links l WHERE l.organizer_id = o.id
                     )
                     OR EXISTS (
                       SELECT 1 FROM campaigns c
                       WHERE c.creator_id = o.id::text
                         AND c.is_public = true
                         AND c.is_hidden IS NOT TRUE
                     )
                   )
                 ORDER BY o.hub_updated_at DESC NULLS LAST
                 LIMIT 2000`
            );
            hubRoutes = hubs.rows.map((row) => ({
                url: `${baseUrl}/u/${row.handle}`,
                lastModified: row.hub_updated_at
                    ? new Date(row.hub_updated_at)
                    : row.created_at
                      ? new Date(row.created_at)
                      : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.65,
            }));
        } catch (hubErr) {
            // Table may not exist until migration 0013 is applied.
            console.error('Failed to list hubs for sitemap', hubErr);
        }

        return [...routes, ...campaignRoutes, ...hubRoutes];
    } catch (e) {
        console.error('Failed to generate sitemap', e);
        return routes;
    }
}
