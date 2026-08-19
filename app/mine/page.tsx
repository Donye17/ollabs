import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { MyCampaignsClient } from '@/components/MyCampaignsClient';

export const metadata: Metadata = {
    title: 'My campaigns',
    description: 'Your Ollabs campaigns and quick links back to their dashboards.',
    robots: { index: false, follow: false },
};

export default function MinePage() {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className="pt-32 pb-8 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="font-display text-4xl font-extrabold mb-3">My campaigns</h1>
                    <p className="text-ink/70">Your campaigns, and quick links back to each dashboard.</p>
                </div>
            </section>
            <section className="px-6 pb-24">
                <MyCampaignsClient />
                <p className="text-center text-sm text-muted mt-6 max-w-2xl mx-auto">
                    Made a campaign on another device?{' '}
                    <Link href="/login" className="text-brand-deep font-semibold hover:underline">
                        Sign in with a code
                    </Link>
                    {' '}or{' '}
                    <Link href="/recover" className="text-brand-deep font-semibold hover:underline">
                        get a recovery link by email
                    </Link>
                </p>
            </section>
        </main>
    );
}
