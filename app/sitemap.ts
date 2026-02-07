import { MetadataRoute } from 'next';
import { pool } from '@/lib/neon';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ollabs.studio';

    // Static routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/create`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    try {
        // Fetch all public frames
        // Fetch all public frames
        const result = await pool.query(
            `SELECT id, created_at 
             FROM frames 
             WHERE is_public = true 
             ORDER BY created_at DESC 
             LIMIT 1000`
        );

        const frameRoutes: MetadataRoute.Sitemap = result.rows.map((row) => ({
            url: `${baseUrl}/share/${row.id}`,
            lastModified: new Date(row.created_at),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        return [...routes, ...frameRoutes];
    } catch (e) {
        console.error("Failed to generate sitemap", e);
        return routes;
    }
}
