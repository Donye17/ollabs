import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: [
                '/',
                '/ads.txt',
                '/create',
                '/c',
                '/u',
                '/pt',
                '/id',
                '/tl',
                '/hi',
                '/es',
                '/for',
                '/day',
                '/vs',
                '/updates',
                '/about',
                '/explore',
                '/guides',
            ],
            disallow: ['/api/', '/hub', '/mine', '/login', '/recover', '/admin'],
        },
        sitemap: 'https://ollabs.studio/sitemap.xml',
    };
}
