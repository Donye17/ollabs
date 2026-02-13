import type { Metadata } from 'next';
import { GalleryPageClient } from '@/components/GalleryPageClient';

export const metadata: Metadata = {
    title: 'Top Avatar Frames & PFP Borders | Ollabs Gallery',
    description: 'Explore thousands of unique avatar frames, neon borders, and aesthetic PFP overlays created by the community. Validated for Discord and Instagram.',
    keywords: ['avatar frame gallery', 'pfp border templates', 'discord pfp ideas', 'aesthetic profile pictures', 'anime avatar frames'],
    openGraph: {
        title: 'Ollabs Community Gallery - Best PFP Borders',
        description: 'Discover and customize your avatar with thousands of community-created frames.',
        url: 'https://ollabs.studio/gallery',
    }
};

export default function GalleryPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://ollabs.studio'
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Gallery',
                'item': 'https://ollabs.studio/gallery'
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <GalleryPageClient />
        </>
    );
}
