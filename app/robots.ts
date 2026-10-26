import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            // Do not move /c or /u to disallow. Thin campaigns and hubs carry
            // a noindex tag, and a page blocked from crawling never has that
            // tag read, so the URLs would sit in the index indefinitely.
            // Hubs with a real bio are indexable. They still have to be crawled.
            allow: [
                '/',
                '/ads.txt',
                '/create',
                '/c',
                '/u',
                '/pt',
                '/hi',
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
