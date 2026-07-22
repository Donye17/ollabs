import type { Metadata } from 'next';
import { ManageClient } from '@/components/campaign/ManageClient';

export const dynamic = 'force-dynamic';

// Private owner dashboard. Never index it.
export const metadata: Metadata = {
    title: 'Manage campaign | Ollabs',
    robots: { index: false, follow: false },
};

export default async function ManagePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <ManageClient slug={slug} />;
}
