import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            // Do not move /c or /u to disallow. Those pages carry
            // robots: { index: false, follow: true } in their metadata, and a
            // page blocked from crawling never has its noindex tag read, so the
            // URLs would sit in the index indefinitely. Crawlable + noindex is
            // deliberate. See docs/ADSENSE_REMEDIATION.md.
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
