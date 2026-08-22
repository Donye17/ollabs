import { MetadataRoute } from 'next';
import { pool } from '@/lib/neon';
import { USE_CASES } from '@/lib/useCases';
import { DAYS } from '@/lib/days';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ollabs.studio';

    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
            alternates: { languages: { en: baseUrl, 'pt-BR': `${baseUrl}/pt`, id: `${baseUrl}/id` } },
        },
        {
            url: `${baseUrl}/pt`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.95,
            alternates: { languages: { en: baseUrl, 'pt-BR': `${baseUrl}/pt`, id: `${baseUrl}/id` } },
        },
        {
            url: `${baseUrl}/id`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.95,
            alternates: { languages: { en: baseUrl, 'pt-BR': `${baseUrl}/pt`, id: `${baseUrl}/id` } },
        },
        { url: `${baseUrl}/create`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/for`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        ...USE_CASES.map((u) => ({
            url: `${baseUrl}/for/${u.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
        { url: `${baseUrl}/day`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        ...DAYS.map((d) => ({
            url: `${baseUrl}/day/${d.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        })),
        { url: `${baseUrl}/day/national-coffee-day/independents`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
        { url: `${baseUrl}/vs/twibbonize`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
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
