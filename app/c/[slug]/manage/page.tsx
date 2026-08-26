import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { ManageClient } from '@/components/campaign/ManageClient';

export const dynamic = 'force-dynamic';

// Private owner dashboard. Never index it.
export const metadata: Metadata = {
    title: 'Manage campaign',
    robots: { index: false, follow: false },
};

export default async function ManagePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <ManageClient slug={slug} />
        </main>
    );
}
