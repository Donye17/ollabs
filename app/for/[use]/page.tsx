import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCasePageShell } from '@/components/seo/UseCasePageShell';
import { USE_CASES, getUseCase } from '@/lib/useCases';
import { useCaseLanguageAlternates } from '@/lib/useCaseHreflang';
import { getSeoExampleCampaign, USE_CASE_CATEGORY } from '@/lib/seoExampleCampaign';

export const revalidate = 86400;

export function generateStaticParams() {
    return USE_CASES.map((u) => ({ use: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ use: string }> }): Promise<Metadata> {
    const { use } = await params;
    const uc = getUseCase(use);
    if (!uc) return {};
    const title = uc.h1;
    const description = `${uc.subtitle} Free, no signup, no watermark. Make a frame and share one link.`;
    const url = `https://ollabs.studio/for/${uc.slug}`;
    return {
        title,
        description,
        keywords: [uc.keyword, 'profile picture frame', 'pfp frame', 'twibbon alternative', `${uc.audience.toLowerCase()} profile frame`],
        alternates: { canonical: url, languages: useCaseLanguageAlternates(uc.slug) },
        openGraph: { type: 'website', url, title, description, siteName: 'Ollabs', images: ['/og.png'] },
        twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
    };
}

const labels = {
    forPrefix: 'For',
    createCampaign: 'Create a campaign',
    howItWorksLink: 'How it works',
    howItWorksTitle: 'How it works',
    steps: [
        { n: 1, title: 'Make a frame', body: 'Pick a color or upload your own design in the builder.' },
        { n: 2, title: 'Share one link', body: 'Post it in emails, texts, and socials. Everyone uses the same link.' },
        { n: 3, title: 'They add it', body: 'Supporters drop in a photo, download it framed, and your counter climbs.' },
    ],
    questionsTitle: 'Questions',
    readyTitle: 'Ready to bring your people together?',
    readyBody: 'Make a campaign in under a minute. No account needed.',
    exploreCampaigns: 'Explore campaigns',
    alsoGreat: 'Also great for',
    footerCopy: '© 2026 Ollabs. Bring your people together.',
    exampleTitle: 'Example campaign',
};

export default async function UseCasePage({ params }: { params: Promise<{ use: string }> }) {
    const { use } = await params;
    const uc = getUseCase(use);
    if (!uc) notFound();

    const example = await getSeoExampleCampaign(USE_CASE_CATEGORY[uc.slug] ?? null);

    return (
        <UseCasePageShell
            uc={uc}
            labels={labels}
            related={USE_CASES.filter((u) => u.slug !== uc.slug)}
            relatedHref={(slug) => `/for/${slug}`}
            example={example}
        />
    );
}
