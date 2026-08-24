import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuidePageShell } from '@/components/guides/GuidePageShell';
import { getGuide } from '@/lib/guides';

const SLUG = 'start-a-campaign';

export const metadata: Metadata = {
    title: 'How to start a campaign',
    description:
        'Upload a frame, name your campaign, publish, and share on WhatsApp in the first hour. Free, no signup for supporters.',
    alternates: { canonical: 'https://ollabs.studio/guides/start-a-campaign' },
    openGraph: {
        type: 'article',
        url: 'https://ollabs.studio/guides/start-a-campaign',
        title: 'How to start a campaign',
        description: 'Step-by-step guide to publishing a profile picture frame campaign on Ollabs.',
        siteName: 'Ollabs',
        images: ['/og.png'],
    },
};

export default function StartCampaignGuidePage() {
    const guide = getGuide(SLUG);
    if (!guide) notFound();
    return <GuidePageShell guide={guide} />;
}
