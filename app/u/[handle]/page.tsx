import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HubPublicView } from '@/components/hub/HubPublicView';
import { getPublicHub } from '@/lib/getPublicHub';
import { hubIsIndexable } from '@/lib/hub';

export const revalidate = 60;

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { handle } = await params;
    const hub = await getPublicHub(handle);
    if (!hub) return { title: 'Not found', robots: { index: false, follow: false } };

    // The root template already appends " | Ollabs". A second brand in the
    // title was showing up as "Name · Ollabs | Ollabs".
    const title = hub.displayName;
    const bio = hub.bio?.trim() || '';
    const featuredDescription = hub.featured?.description?.trim() || '';
    const description =
        bio ||
        featuredDescription ||
        (hub.featured
            ? `Join ${hub.featured.title}. Add the frame to your profile picture. Free, no signup.`
            : `Campaigns and links from ${hub.displayName}.`);

    // Prefer featured frame art for WhatsApp unfurls; avatar is a weaker signal.
    const ogImage = hub.featured?.preview_url || hub.avatarUrl || null;
    // Index only a hub whose own bio is a real sentence. Everyone else stays
    // crawlable so Google can read this tag. Do not disallow /u in robots.ts.
    const indexable = hubIsIndexable(hub);

    return {
        title,
        description,
        robots: { index: indexable, follow: true },
        openGraph: {
            title,
            description,
            url: `https://ollabs.studio/u/${hub.handle}`,
            ...(ogImage ? { images: [{ url: ogImage }] } : {}),
            type: 'profile',
        },
        twitter: {
            card: ogImage ? 'summary_large_image' : 'summary',
            title,
            description,
            ...(ogImage ? { images: [ogImage] } : {}),
        },
        alternates: {
            canonical: `https://ollabs.studio/u/${hub.handle}`,
        },
    };
}

export default async function OrganizerHubPage({ params }: Props) {
    const { handle } = await params;
    const hub = await getPublicHub(handle);
    if (!hub) notFound();
    return <HubPublicView hub={hub} />;
}
