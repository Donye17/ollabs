import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCasePageShell } from '@/components/seo/UseCasePageShell';
import { USE_CASES_PT, getUseCasePt } from '@/lib/useCasesPt';
import { englishSlugFromPt, useCaseLanguageAlternates } from '@/lib/useCaseHreflang';
import { getSeoExampleCampaign, USE_CASE_CATEGORY } from '@/lib/seoExampleCampaign';

export const revalidate = 86400;

const labels = {
    forPrefix: 'Para',
    createCampaign: 'Criar uma campanha',
    howItWorksLink: 'Como funciona',
    howItWorksTitle: 'Como funciona',
    steps: [
        { n: 1, title: 'Faça a moldura', body: 'Escolha uma cor ou envie sua arte no criador.' },
        { n: 2, title: 'Mande um link', body: 'Compartilhe no WhatsApp, email e redes.' },
        { n: 3, title: 'Todo mundo entra', body: 'Cada pessoa coloca na foto e o contador sobe.' },
    ],
    questionsTitle: 'Perguntas',
    readyTitle: 'Pronto para reunir sua galera?',
    readyBody: 'Leva menos de um minuto. Sem conta.',
    alsoGreat: 'Também serve para',
    footerCopy: '© 2026 Ollabs. Reúna a sua galera.',
    exampleTitle: 'Exemplo de campanha',
};

export function generateStaticParams() {
    return USE_CASES_PT.map((u) => ({ use: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ use: string }> }): Promise<Metadata> {
    const { use } = await params;
    const uc = getUseCasePt(use);
    if (!uc) return {};
    const title = uc.h1;
    const description = `${uc.subtitle} Grátis, sem cadastro, sem marca d'água.`;
    const url = `https://ollabs.studio/pt/for/${uc.slug}`;
    const enSlug = englishSlugFromPt(uc.slug);
    return {
        title,
        description,
        keywords: [uc.keyword, 'moldura foto perfil', 'twibbon grátis', 'alternativa twibbonize'],
        alternates: { canonical: url, languages: useCaseLanguageAlternates(enSlug) },
        openGraph: { type: 'website', url, title, description, siteName: 'Ollabs', locale: 'pt_BR', images: ['/og.png'] },
    };
}

export default async function UseCasePtPage({ params }: { params: Promise<{ use: string }> }) {
    const { use } = await params;
    const uc = getUseCasePt(use);
    if (!uc) notFound();

    const enSlug = englishSlugFromPt(uc.slug);
    const example = await getSeoExampleCampaign(USE_CASE_CATEGORY[enSlug] ?? null);

    return (
        <UseCasePageShell
            uc={uc}
            labels={labels}
            related={USE_CASES_PT.filter((u) => u.slug !== uc.slug)}
            relatedHref={(slug) => `/pt/for/${slug}`}
            example={example}
        />
    );
}
