import type { Metadata } from 'next';
import { SetLocale } from '@/components/i18n/SetLocale';

export const metadata: Metadata = {
    title: 'Ollabs: twibbon gratis & bingkai foto profil untuk kampanye',
    description:
        'Buat bingkai foto profil (twibbon) untuk kampanye, komunitas, atau event. Bagikan satu link, orang pasang di foto dalam hitungan detik. Gratis, tanpa daftar, tanpa watermark.',
    alternates: {
        canonical: 'https://ollabs.studio/id',
        languages: {
            id: 'https://ollabs.studio/id',
            'pt-BR': 'https://ollabs.studio/pt',
            en: 'https://ollabs.studio',
            'x-default': 'https://ollabs.studio',
        },
    },
    openGraph: {
        locale: 'id_ID',
        url: 'https://ollabs.studio/id',
        title: 'Ollabs: twibbon gratis & bingkai foto profil untuk kampanye',
        description:
            'Buat bingkai foto profil (twibbon) untuk kampanye atau event. Bagikan satu link. Gratis, tanpa watermark.',
    },
};

export default function IdLayout({ children }: { children: React.ReactNode }) {
    return (
        <div lang="id">
            <SetLocale locale="id" />
            {children}
        </div>
    );
}
