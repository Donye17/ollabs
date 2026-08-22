import type { Metadata } from 'next';
import { LocalizedForHub } from '@/components/seo/LocalizedForHub';
import { USE_CASES_ID } from '@/lib/useCasesId';

const URL = 'https://ollabs.studio/id/for';

export const metadata: Metadata = {
    title: 'Untuk siapa Ollabs | Kampanye bingkai foto profil',
    description: 'Bingkai foto profil untuk kampus, masjid, komunitas, sekolah, acara, dan kampanye sosial.',
    alternates: {
        canonical: URL,
        languages: {
            en: 'https://ollabs.studio/for',
            'pt-BR': 'https://ollabs.studio/pt/for',
            id: URL,
            es: 'https://ollabs.studio/es/for',
            tl: 'https://ollabs.studio/tl/for',
            'x-default': 'https://ollabs.studio/for',
        },
    },
    openGraph: { type: 'website', url: URL, title: 'Untuk siapa Ollabs', description: 'Kampanye bingkai profil untuk menyatukan komunitas Anda.', siteName: 'Ollabs', locale: 'id_ID', images: ['/og.png'] },
};

export default function ForIdHub() {
    return (
        <LocalizedForHub
            useCases={USE_CASES_ID}
            locale="id"
            title="Dibuat untuk kumpulkan orang"
            intro="Apa pun komunitas Anda, Ollabs menyederhanakannya menjadi satu bingkai dan satu link."
            linkLabel="Lihat caranya"
            footerCopy="© 2026 Ollabs. Kumpulkan orang Anda."
        />
    );
}
