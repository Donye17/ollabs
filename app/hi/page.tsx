import type { Metadata } from 'next';
import Link from 'next/link';
import { LocaleLandingPage } from '@/components/seo/LocaleLandingPage';
import { getMessages } from '@/lib/i18n/messages';

export const metadata: Metadata = {
    title: 'Ollabs: मुफ़्त twibbon और profile frame',
    description:
        'कैंपेन के लिए profile picture frame बनाएं। एक link शेयर करें। मुफ़्त, बिना signup, बिना watermark।',
    alternates: {
        canonical: 'https://ollabs.studio/hi',
        languages: { en: 'https://ollabs.studio', hi: 'https://ollabs.studio/hi' },
    },
    openGraph: {
        locale: 'hi_IN',
        url: 'https://ollabs.studio/hi',
        title: 'Ollabs: मुफ़्त twibbon और profile frame',
    },
};

export default function HindiLandingPage() {
    const t = getMessages('en').landingHi;
    return (
        <LocaleLandingPage
            t={t}
            htmlLang="hi"
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
