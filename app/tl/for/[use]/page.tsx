import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCasePageShell } from '@/components/seo/UseCasePageShell';
import { USE_CASES_TL, getUseCaseTl } from '@/lib/useCasesTl';
import { englishSlugFromTl, useCaseLanguageAlternates } from '@/lib/useCaseHreflang';

export const revalidate = 86400;

const labels = {
    forPrefix: 'Para sa',
    createCampaign: 'Gumawa ng campaign',
    howItWorksLink: 'Paano ito gumagana',
    howItWorksTitle: 'Paano ito gumagana',
    steps: [
        { n: 1, title: 'Gawin ang frame', body: 'Pumili ng kulay o i-upload ang inyong artwork.' },
        { n: 2, title: 'Ibahagi ang link', body: 'Ipadala sa Messenger, group chat, email, at social media.' },
        { n: 3, title: 'Sabay-sabay sumali', body: 'Idadagdag ng bawat supporter ang frame sa sariling larawan.' },
    ],
    questionsTitle: 'Mga tanong',
    readyTitle: 'Handa nang pagsamahin ang inyong mga tao?',
    readyBody: 'Wala pang isang minuto. Hindi kailangan ng account.',
    alsoGreat: 'Mainam din para sa',
    footerCopy: '© 2026 Ollabs. Pagsamahin ang inyong mga tao.',
};

export function generateStaticParams() {
    return USE_CASES_TL.map((u) => ({ use: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ use: string }> }): Promise<Metadata> {
    const { use } = await params;
    const uc = getUseCaseTl(use);
    if (!uc) return {};
    const title = uc.h1;
    const description = `${uc.subtitle} Libre at hindi kailangan ng account.`;
    const url = `https://ollabs.studio/tl/for/${uc.slug}`;
    const enSlug = englishSlugFromTl(uc.slug);
    return {
        title,
        description,
        keywords: [uc.keyword, 'profile picture frame', 'libreng twibbon', 'campaign frame'],
        alternates: { canonical: url, languages: useCaseLanguageAlternates(enSlug) },
        openGraph: { type: 'website', url, title, description, siteName: 'Ollabs', locale: 'fil_PH', images: ['/og.png'] },
    };
}

export default async function UseCaseTlPage({ params }: { params: Promise<{ use: string }> }) {
    const { use } = await params;
    const uc = getUseCaseTl(use);
    if (!uc) notFound();

    return (
        <UseCasePageShell
            uc={uc}
            labels={labels}
            related={USE_CASES_TL.filter((u) => u.slug !== uc.slug)}
            relatedHref={(slug) => `/tl/for/${slug}`}
        />
    );
}
