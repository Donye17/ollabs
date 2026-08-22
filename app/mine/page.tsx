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
            <section className="pt-[calc(3.5rem+env(safe-area-inset-top,0px)+1.25rem)] pb-6 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="font-display text-2xl sm:text-4xl font-extrabold mb-2 sm:mb-3">My campaigns</h1>
                    <p className="text-[15px] sm:text-base text-ink/70 leading-relaxed">Your campaigns, and quick links back to each dashboard.</p>
                    <Link
                        href="/hub"
                        className="inline-flex mt-5 sm:mt-6 min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-ink hover:brightness-105 active:brightness-95 transition-all"
                    >
                        Edit your hub · /u/your-handle
                    </Link>
                </div>
            </section>
            <section className="px-4 sm:px-6 pb-[max(6rem,env(safe-area-inset-bottom))]">
                <MyCampaignsClient />
                <p className="text-center text-sm text-muted mt-6 max-w-2xl mx-auto">
                    <Link href="/updates" className="text-brand-deep font-semibold hover:underline">
                        What&apos;s new
                    </Link>
                    {' · '}
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
