import type { Metadata } from 'next';
import Link from 'next/link';
import { LocaleLandingPage } from '@/components/seo/LocaleLandingPage';
import { getMessages } from '@/lib/i18n/messages';

export const metadata: Metadata = {
    title: 'Ollabs: marco de foto de perfil gratis para campañas',
    description:
        'Crea un marco de foto de perfil para tu campaña. Comparte un enlace. Gratis, sin registro, sin marca de agua.',
    alternates: {
        canonical: 'https://ollabs.studio/es',
        languages: { en: 'https://ollabs.studio', es: 'https://ollabs.studio/es' },
    },
    openGraph: {
        locale: 'es_MX',
        url: 'https://ollabs.studio/es',
        title: 'Ollabs: marco de foto de perfil gratis',
    },
};

export default function SpanishLandingPage() {
    const t = getMessages('en').landingEs;
    return (
        <LocaleLandingPage
            t={t}
            htmlLang="es"
            extraFooterLinks={
                <>
                    {' · '}
                    <Link href="/pt" hrefLang="pt-BR" className="font-semibold text-brand-deep hover:underline">
                        Português
                    </Link>
                </>
            }
        />
    );
}
