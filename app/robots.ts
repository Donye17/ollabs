import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: ['/', '/create', '/share'],
            disallow: ['/private/', '/admin'],
        },
        sitemap: 'https://ollabs.studio/sitemap.xml',
    };
}
