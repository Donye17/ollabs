import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuidePageShell } from '@/components/guides/GuidePageShell';
import { GUIDES, getGuide } from '@/lib/guides';

export const revalidate = 86400;

export function generateStaticParams() {
    return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const guide = getGuide(slug);
    if (!guide) return {};
    const url = `https://ollabs.studio/guides/${guide.slug}`;
    return {
        title: guide.title,
        description: guide.description,
        alternates: { canonical: url },
        openGraph: {
            type: 'article',
            url,
            title: guide.title,
            description: guide.description,
            siteName: 'Ollabs',
            publishedTime: guide.publishedAt,
            modifiedTime: guide.updatedAt || guide.publishedAt,
            images: ['/og.png'],
        },
    };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const guide = getGuide(slug);
    if (!guide) notFound();
    return <GuidePageShell guide={guide} />;
}
