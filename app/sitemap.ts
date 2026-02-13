import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { frames } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

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
        const result = await db.select({
            id: frames.id,
            createdAt: frames.createdAt
        })
            .from(frames)
            .where(eq(frames.isPublic, true))
            .orderBy(desc(frames.createdAt))
            .limit(5000);

        const frameRoutes: MetadataRoute.Sitemap = result.flatMap((row) => [
            {
                url: `${baseUrl}/share/${row.id}`,
                lastModified: row.createdAt ? new Date(row.createdAt) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.6,
            },
            {
                url: `${baseUrl}/create?id=${row.id}`,
                lastModified: row.createdAt ? new Date(row.createdAt) : new Date(),
                changeFrequency: 'monthly',
                priority: 0.8,
            }
        ]);

        return [...routes, ...frameRoutes];
    } catch (e) {
        console.error("Failed to generate sitemap", e);
        return routes;
    }
}
