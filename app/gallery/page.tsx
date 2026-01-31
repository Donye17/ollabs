import type { Metadata } from 'next';
import { GalleryPageClient } from '@/components/GalleryPageClient';

export const metadata: Metadata = {
    title: 'Community Gallery | Ollabs',
    description: 'Explore thousands of unique avatar frames created by the Ollabs community. Vote, comment, and use them for your profile.',
    openGraph: {
        title: 'Ollabs Community Gallery',
        description: 'Discover and customize your avatar with community-created frames.',
        url: '/gallery',
    }
};

export default function GalleryPage() {
    return <GalleryPageClient />;
}
