import type { Metadata } from 'next';
import { LocalizedForHub } from '@/components/seo/LocalizedForHub';
import { USE_CASES_TL } from '@/lib/useCasesTl';

const URL = 'https://ollabs.studio/tl/for';

export const metadata: Metadata = {
    title: 'Para kanino ang Ollabs | Mga profile frame campaign',
    description: 'Mga profile picture frame para sa simbahan, paaralan, event, komunidad, at awareness campaign.',
    alternates: {
        canonical: URL,
        languages: {
            en: 'https://ollabs.studio/for',
            'pt-BR': 'https://ollabs.studio/pt/for',
            id: 'https://ollabs.studio/id/for',
            es: 'https://ollabs.studio/es/for',
            tl: URL,
            'x-default': 'https://ollabs.studio/for',
        },
    },
    openGraph: { type: 'website', url: URL, title: 'Para kanino ang Ollabs', description: 'Mga profile frame campaign para pagsamahin ang inyong komunidad.', siteName: 'Ollabs', locale: 'fil_PH', images: ['/og.png'] },
};

export default function ForTlHub() {
    return (
        <LocalizedForHub
            useCases={USE_CASES_TL}
            locale="tl"
            title="Ginawa para pagsamahin ang mga tao"
            intro="Anuman ang inyong komunidad, pinapasimple ng Ollabs ang campaign sa isang frame at isang link."
            linkLabel="Tingnan kung paano"
            footerCopy="© 2026 Ollabs. Pagsamahin ang inyong mga tao."
        />
    );
}
