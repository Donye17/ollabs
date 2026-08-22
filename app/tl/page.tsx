import type { Metadata } from 'next';
import Link from 'next/link';
import { LocaleLandingPage } from '@/components/seo/LocaleLandingPage';
import { getMessages } from '@/lib/i18n/messages';

export const metadata: Metadata = {
    title: 'Ollabs: libreng twibbon at profile frame',
    description:
        'Gumawa ng profile picture frame para sa kampanya. I-share ang isang link. Libre, walang signup, walang watermark.',
    alternates: {
        canonical: 'https://ollabs.studio/tl',
        languages: { en: 'https://ollabs.studio', tl: 'https://ollabs.studio/tl' },
    },
    openGraph: {
        locale: 'fil_PH',
        url: 'https://ollabs.studio/tl',
        title: 'Ollabs: libreng twibbon at profile frame',
    },
};

export default function TagalogLandingPage() {
    const t = getMessages('en').landingTl;
    return (
        <LocaleLandingPage
            t={t}
            htmlLang="fil"
            extraFooterLinks={
                <>
                    {' · '}
                    <Link href="/pt" hrefLang="pt-BR" className="font-semibold text-brand-deep hover:underline">
                        Português
                    </Link>
                    {' · '}
                    <Link href="/id" hrefLang="id" className="font-semibold text-brand-deep hover:underline">
                        Bahasa Indonesia
                    </Link>
                </>
            }
        />
    );
}
