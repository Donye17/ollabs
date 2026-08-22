import type { Metadata } from 'next';
import { VsTwibbonizeShell } from '@/components/seo/VsTwibbonizeShell';
import { VS_ES } from '@/lib/vsTwibbonizeCopy';

const URL = 'https://ollabs.studio/es/vs/twibbonize';

export const metadata: Metadata = {
    title: VS_ES.metaTitle,
    description: VS_ES.metaDescription,
    keywords: ['alternativa twibbonize', 'twibbon sin marca de agua', 'marco foto perfil gratis', 'ollabs vs twibbonize'],
    alternates: { canonical: URL, languages: { es: URL, en: 'https://ollabs.studio/vs/twibbonize' } },
    openGraph: { type: 'website', url: URL, siteName: 'Ollabs', title: VS_ES.metaTitle, description: VS_ES.metaDescription, locale: 'es_ES', images: ['/og.png'] },
};

export default function VsTwibbonizeEsPage() {
    return <VsTwibbonizeShell copy={VS_ES} canonical={URL} />;
}
