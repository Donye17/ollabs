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
    return <GalleryPageClient />;
}
