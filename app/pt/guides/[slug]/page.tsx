import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuidePageShell } from '@/components/guides/GuidePageShell';
import { getGuide, guidesInLocale } from '@/lib/guides';

export const revalidate = 86400;

export function generateStaticParams() {
    return guidesInLocale('pt').map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const guide = getGuide(slug);
    if (!guide?.pt) return {};
    const url = `https://ollabs.studio/pt/guides/${guide.slug}`;
    return {
        title: guide.pt.title,
        description: guide.pt.description,
        alternates: {
            canonical: url,
            languages: {
                en: `https://ollabs.studio/guides/${guide.slug}`,
                'pt-BR': url,
                'x-default': `https://ollabs.studio/guides/${guide.slug}`,
            },
        },
        openGraph: {
            type: 'article',
            locale: 'pt_BR',
            url,
            title: guide.pt.title,
            description: guide.pt.description,
            siteName: 'Ollabs',
            publishedTime: guide.publishedAt,
            modifiedTime: guide.updatedAt || guide.publishedAt,
            images: ['/og.png'],
        },
    };
}

export default async function PtGuidePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const guide = getGuide(slug);
    if (!guide?.pt) notFound();
    return <GuidePageShell guide={guide} locale="pt" />;
}
