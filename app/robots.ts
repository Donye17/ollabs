import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: ['/', '/create', '/c'],
            disallow: ['/api/'],
        },
        sitemap: 'https://ollabs.studio/sitemap.xml',
    };
}
