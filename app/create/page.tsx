import { EditorPage } from '@/components/EditorPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create a campaign | Ollabs',
    description: 'Design a profile-picture frame for your cause, team, or event and share one link. No login required.',
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://ollabs.studio' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Create', 'item': 'https://ollabs.studio/create' },
    ],
};

export default function Create() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <EditorPage />
        </>
    );
}
