import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HubPublicView } from '@/components/hub/HubPublicView';
import { getPublicHub } from '@/lib/getPublicHub';

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
            ? `Support ${hub.featured.title}. Add the frame to your profile picture.`
            : `Campaigns and links from ${hub.displayName}.`);

    // Prefer featured frame art for WhatsApp unfurls; avatar is a weaker signal.
    const ogImage = hub.featured?.preview_url || hub.avatarUrl || null;

    return {
        title,
        description,
        // 17 hubs exist and one has a bio over 80 characters. Not enough
        // publisher content to index or to carry ads. See docs/ADSENSE_REMEDIATION.md.
        robots: { index: false, follow: true },
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
