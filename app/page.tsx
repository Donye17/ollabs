import { EditorPage } from '@/components/EditorPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Your Custom Avatar Frame',
    description: 'Use our free tool to design, customize, and export high-quality avatar frames for Discord, Twitter, and LinkedIn profile pictures.',
}

export default function Home({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const remixId = typeof searchParams.remix === 'string' ? searchParams.remix : undefined;
    return <EditorPage remixId={remixId} />;
}
