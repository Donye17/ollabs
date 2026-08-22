import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCasePageShell } from '@/components/seo/UseCasePageShell';
import { USE_CASES_ID, getUseCaseId } from '@/lib/useCasesId';
import { englishSlugFromId, useCaseLanguageAlternates } from '@/lib/useCaseHreflang';

export const revalidate = 86400;

const labels = {
    forPrefix: 'Untuk',
    createCampaign: 'Buat kampanye',
    howItWorksLink: 'Cara kerjanya',
    howItWorksTitle: 'Cara kerjanya',
    steps: [
        { n: 1, title: 'Buat bingkai', body: 'Pilih warna atau upload desain di builder.' },
        { n: 2, title: 'Bagikan satu link', body: 'Kirim di WhatsApp, email, dan media sosial.' },
        { n: 3, title: 'Semua ikut', body: 'Pendukung pasang foto dan penghitung naik.' },
    ],
    questionsTitle: 'Pertanyaan',
    readyTitle: 'Siap kumpulkan orang?',
    readyBody: 'Kurang dari satu menit. Tanpa daftar.',
    alsoGreat: 'Juga cocok untuk',
    footerCopy: '© 2026 Ollabs. Kumpulkan barengannya.',
};

export function generateStaticParams() {
    return USE_CASES_ID.map((u) => ({ use: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ use: string }> }): Promise<Metadata> {
    const { use } = await params;
    const uc = getUseCaseId(use);
    if (!uc) return {};
    const title = uc.h1;
    const description = `${uc.subtitle} Gratis, tanpa daftar, tanpa watermark.`;
    const url = `https://ollabs.studio/id/for/${uc.slug}`;
    const enSlug = englishSlugFromId(uc.slug);
    return {
        title,
        description,
        keywords: [uc.keyword, 'bingkai foto profil', 'twibbon gratis', 'alternatif twibbonize'],
        alternates: { canonical: url, languages: useCaseLanguageAlternates(enSlug) },
        openGraph: { type: 'website', url, title, description, siteName: 'Ollabs', locale: 'id_ID', images: ['/og.png'] },
    };
}

export default async function UseCaseIdPage({ params }: { params: Promise<{ use: string }> }) {
    const { use } = await params;
    const uc = getUseCaseId(use);
    if (!uc) notFound();

    return (
        <UseCasePageShell
            uc={uc}
            labels={labels}
            related={USE_CASES_ID.filter((u) => u.slug !== uc.slug)}
            relatedHref={(slug) => `/id/for/${slug}`}
        />
    );
}
