import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: ['/', '/create', '/c', '/u', '/pt', '/id', '/for', '/day', '/explore'],
            disallow: ['/api/', '/hub', '/mine', '/login', '/recover', '/admin'],
        },
        sitemap: 'https://ollabs.studio/sitemap.xml',
    };
}
