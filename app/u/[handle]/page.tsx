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

    const title = `${hub.displayName} · Ollabs`;
    const description =
        hub.bio?.trim() ||
        (hub.featured
            ? `Support ${hub.featured.title} — add the frame to your profile picture.`
            : `Campaigns and links from ${hub.displayName}.`);

    const index = hubIsIndexable(hub);

    return {
        title,
        description,
        robots: index ? { index: true, follow: true } : { index: false, follow: false },
        openGraph: {
            title,
            description,
            url: `https://ollabs.studio/u/${hub.handle}`,
            ...(hub.avatarUrl ? { images: [{ url: hub.avatarUrl }] } : {}),
            type: 'profile',
        },
        twitter: {
            card: hub.avatarUrl ? 'summary' : 'summary',
            title,
            description,
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
