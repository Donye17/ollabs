import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuidePageShell } from '@/components/guides/GuidePageShell';
import { getGuide } from '@/lib/guides';

const SLUG = 'hub';

export const metadata: Metadata = {
    title: 'What is a campaign hub?',
    description:
        'Your Ollabs hub is one link for your bio: Join button, bio, and links. Learn when to use /u/your-handle vs a campaign link.',
    alternates: { canonical: 'https://ollabs.studio/guides/hub' },
    openGraph: {
        type: 'article',
        url: 'https://ollabs.studio/guides/hub',
        title: 'What is a campaign hub?',
        description:
            'Your Ollabs hub is one link for your bio. The Join button opens your featured frame.',
        siteName: 'Ollabs',
        images: ['/og.png'],
    },
};

export default function HubGuidePage() {
    const guide = getGuide(SLUG);
    if (!guide) notFound();
    return <GuidePageShell guide={guide} />;
}
