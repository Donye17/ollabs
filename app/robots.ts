import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: ['/', '/create', '/c', '/u', '/pt', '/for', '/day', '/explore'],
            disallow: ['/api/', '/hub', '/mine', '/login', '/recover', '/admin'],
        },
        sitemap: 'https://ollabs.studio/sitemap.xml',
    };
}
