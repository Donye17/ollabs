import type { Metadata } from 'next';
import { LocalizedForHub } from '@/components/seo/LocalizedForHub';
import { USE_CASES_ES } from '@/lib/useCasesEs';

const URL = 'https://ollabs.studio/es/for';

export const metadata: Metadata = {
    title: 'Para quién es Ollabs | Campañas con marco de perfil',
    description: 'Marcos de foto de perfil para iglesias, escuelas, equipos, ONGs, eventos y campañas de conciencia.',
    alternates: {
        canonical: URL,
        languages: {
            en: 'https://ollabs.studio/for',
            'pt-BR': 'https://ollabs.studio/pt/for',
            id: 'https://ollabs.studio/id/for',
            es: URL,
            tl: 'https://ollabs.studio/tl/for',
            'x-default': 'https://ollabs.studio/for',
        },
    },
    openGraph: { type: 'website', url: URL, title: 'Para quién es Ollabs', description: 'Campañas con marco de perfil para reunir a tu comunidad.', siteName: 'Ollabs', locale: 'es_ES', images: ['/og.png'] },
};

export default function ForEsHub() {
    return (
        <LocalizedForHub
            useCases={USE_CASES_ES}
            locale="es"
            title="Hecho para reunir personas"
            intro="Sea cual sea tu comunidad, Ollabs convierte la idea en un marco y un enlace."
            linkLabel="Ver cómo funciona"
            footerCopy="© 2026 Ollabs. Reúne a tu gente."
        />
    );
}
