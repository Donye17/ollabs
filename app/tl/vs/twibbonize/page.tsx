import type { Metadata } from 'next';
import { VsTwibbonizeShell } from '@/components/seo/VsTwibbonizeShell';
import { VS_TL } from '@/lib/vsTwibbonizeCopy';

const URL = 'https://ollabs.studio/tl/vs/twibbonize';

export const metadata: Metadata = {
    title: VS_TL.metaTitle,
    description: VS_TL.metaDescription,
    keywords: ['alternatibo sa twibbonize', 'libreng twibbon', 'profile picture frame', 'ollabs vs twibbonize'],
    alternates: {
        canonical: URL,
        languages: {
            en: 'https://ollabs.studio/vs/twibbonize',
            'pt-BR': 'https://ollabs.studio/pt/vs/twibbonize',
            id: 'https://ollabs.studio/id/vs/twibbonize',
            es: 'https://ollabs.studio/es/vs/twibbonize',
            tl: URL,
            'x-default': 'https://ollabs.studio/vs/twibbonize',
        },
    },
    openGraph: { type: 'website', url: URL, siteName: 'Ollabs', title: VS_TL.metaTitle, description: VS_TL.metaDescription, locale: 'fil_PH', images: ['/og.png'] },
};

export default function VsTwibbonizeTlPage() {
    return <VsTwibbonizeShell copy={VS_TL} canonical={URL} />;
}
