import { MetadataRoute } from 'next';
import { pool } from '@/lib/neon';
import { USE_CASES } from '@/lib/useCases';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ollabs.studio';

    const routes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/create`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/for`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        ...USE_CASES.map((u) => ({
            url: `${baseUrl}/for/${u.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
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
        return [...routes, ...campaignRoutes];
    } catch (e) {
        console.error('Failed to generate sitemap', e);
        return routes;
    }
}
