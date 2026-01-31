import { EditorPage } from '@/components/EditorPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Your Custom Avatar Frame',
    description: 'Use our free tool to design, customize, and export high-quality avatar frames for Discord, Twitter, and LinkedIn profile pictures.',
}

export default function Home() {
    return <EditorPage />;
}
