import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { RecoverClient } from '@/components/RecoverClient';

export const metadata: Metadata = {
    title: 'Find my campaigns',
    description: 'Lost the link to your Ollabs campaign dashboard? Enter your email and we will send it back to you.',
    robots: { index: false, follow: false },
};

export default function RecoverPage() {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className="pt-32 pb-8 px-6">
                <div className="max-w-md mx-auto text-center">
                    <h1 className="font-display text-4xl font-extrabold mb-3">Find my campaigns</h1>
                    <p className="text-ink/70">
                        Switched devices or cleared your browser? If you gave your email when you created a
                        campaign, we can send your dashboard links back.
                    </p>
                </div>
            </section>
            <section className="px-6 pb-24">
                <RecoverClient />
                <p className="text-center text-sm text-muted mt-6">
                    Looking for campaigns saved in this browser? <Link href="/mine" className="text-brand-deep font-semibold hover:underline">My campaigns</Link>
                </p>
            </section>
        </main>
    );
}
