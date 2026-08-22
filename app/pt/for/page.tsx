import type { Metadata } from 'next';
import { LocalizedForHub } from '@/components/seo/LocalizedForHub';
import { USE_CASES_PT } from '@/lib/useCasesPt';

const URL = 'https://ollabs.studio/pt/for';

export const metadata: Metadata = {
    title: 'Para quem é o Ollabs | Campanhas com moldura de perfil',
    description: 'Molduras de foto de perfil para igrejas, escolas, times, ONGs, eventos e campanhas de conscientização.',
    alternates: {
        canonical: URL,
        languages: {
            en: 'https://ollabs.studio/for',
            'pt-BR': URL,
            id: 'https://ollabs.studio/id/for',
            es: 'https://ollabs.studio/es/for',
            tl: 'https://ollabs.studio/tl/for',
            'x-default': 'https://ollabs.studio/for',
        },
    },
    openGraph: { type: 'website', url: URL, title: 'Para quem é o Ollabs', description: 'Campanhas com moldura de perfil para reunir a sua comunidade.', siteName: 'Ollabs', locale: 'pt_BR', images: ['/og.png'] },
};

export default function ForPtHub() {
    return (
        <LocalizedForHub
            useCases={USE_CASES_PT}
            locale="pt"
            title="Feito para reunir pessoas"
            intro="Seja qual for a sua comunidade, o Ollabs transforma a ideia em uma moldura e um link."
            linkLabel="Ver como funciona"
            footerCopy="© 2026 Ollabs. Reúna a sua galera."
        />
    );
}
