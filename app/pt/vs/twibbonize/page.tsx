import type { Metadata } from 'next';
import { VsTwibbonizeShell } from '@/components/seo/VsTwibbonizeShell';
import { VS_PT } from '@/lib/vsTwibbonizeCopy';

const URL = 'https://ollabs.studio/pt/vs/twibbonize';

export const metadata: Metadata = {
    title: VS_PT.metaTitle,
    description: VS_PT.metaDescription,
    keywords: ['alternativa twibbonize', 'twibbon sem marca d\'água', 'moldura foto perfil grátis', 'ollabs vs twibbonize'],
    alternates: {
        canonical: URL,
        languages: {
            en: 'https://ollabs.studio/vs/twibbonize',
            'pt-BR': URL,
            'x-default': 'https://ollabs.studio/vs/twibbonize',
        },
    },
    openGraph: { type: 'website', url: URL, siteName: 'Ollabs', title: VS_PT.metaTitle, description: VS_PT.metaDescription, locale: 'pt_BR', images: ['/og.png'] },
};

export default function VsTwibbonizePtPage() {
    return <VsTwibbonizeShell copy={VS_PT} canonical={URL} />;
}
