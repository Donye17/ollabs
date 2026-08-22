import type { Metadata } from 'next';
import { VsTwibbonizeShell } from '@/components/seo/VsTwibbonizeShell';
import { VS_ID } from '@/lib/vsTwibbonizeCopy';

const URL = 'https://ollabs.studio/id/vs/twibbonize';

export const metadata: Metadata = {
    title: VS_ID.metaTitle,
    description: VS_ID.metaDescription,
    keywords: ['alternatif twibbonize', 'twibbon tanpa watermark', 'bingkai foto profil gratis', 'ollabs vs twibbonize'],
    alternates: { canonical: URL, languages: { id: URL, en: 'https://ollabs.studio/vs/twibbonize' } },
    openGraph: { type: 'website', url: URL, siteName: 'Ollabs', title: VS_ID.metaTitle, description: VS_ID.metaDescription, locale: 'id_ID', images: ['/og.png'] },
};

export default function VsTwibbonizeIdPage() {
    return <VsTwibbonizeShell copy={VS_ID} canonical={URL} />;
}
