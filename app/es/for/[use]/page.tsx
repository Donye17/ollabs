import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCasePageShell } from '@/components/seo/UseCasePageShell';
import { USE_CASES_ES, getUseCaseEs } from '@/lib/useCasesEs';
import { englishSlugFromEs, useCaseLanguageAlternates } from '@/lib/useCaseHreflang';
import { getSeoExampleCampaign, USE_CASE_CATEGORY } from '@/lib/seoExampleCampaign';

export const revalidate = 86400;

const labels = {
    forPrefix: 'Para',
    createCampaign: 'Crear una campaña',
    howItWorksLink: 'Cómo funciona',
    howItWorksTitle: 'Cómo funciona',
    steps: [
        { n: 1, title: 'Haz el marco', body: 'Elige un color o sube tu arte en el creador.' },
        { n: 2, title: 'Manda un enlace', body: 'Comparte en WhatsApp, email y redes.' },
        { n: 3, title: 'Todos entran', body: 'Cada persona pone su foto y el contador sube.' },
    ],
    questionsTitle: 'Preguntas',
    readyTitle: '¿Listo para reunir a tu gente?',
    readyBody: 'Toma menos de un minuto. Sin cuenta.',
    alsoGreat: 'También sirve para',
    footerCopy: '© 2026 Ollabs. Reúne a tu gente.',
    exampleTitle: 'Campaña de ejemplo',
};

export function generateStaticParams() {
    return USE_CASES_ES.map((u) => ({ use: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ use: string }> }): Promise<Metadata> {
    const { use } = await params;
    const uc = getUseCaseEs(use);
    if (!uc) return {};
    const title = uc.h1;
    const description = `${uc.subtitle} Gratis, sin registro, sin marca de agua.`;
    const url = `https://ollabs.studio/es/for/${uc.slug}`;
    const enSlug = englishSlugFromEs(uc.slug);
    return {
        title,
        description,
        keywords: [uc.keyword, 'marco foto perfil', 'twibbon gratis', 'alternativa twibbonize'],
        alternates: {
            canonical: url,
            languages: useCaseLanguageAlternates(enSlug),
        },
        openGraph: { type: 'website', url, title, description, siteName: 'Ollabs', locale: 'es_ES', images: ['/og.png'] },
    };
}

export default async function UseCaseEsPage({ params }: { params: Promise<{ use: string }> }) {
    const { use } = await params;
    const uc = getUseCaseEs(use);
    if (!uc) notFound();

    const enSlug = englishSlugFromEs(uc.slug);
    const example = await getSeoExampleCampaign(USE_CASE_CATEGORY[enSlug] ?? null);

    return (
        <UseCasePageShell
            uc={uc}
            labels={labels}
            related={USE_CASES_ES.filter((u) => u.slug !== uc.slug)}
            relatedHref={(slug) => `/es/for/${slug}`}
            example={example}
        />
    );
}
