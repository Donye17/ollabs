import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { UpdatesList } from '@/components/updates/UpdatesList';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

export const metadata: Metadata = {
    title: 'What\'s new',
    description:
        'Recent Ollabs updates: new features, improvements, and fixes for profile picture frame campaigns.',
    alternates: { canonical: 'https://ollabs.studio/updates' },
    openGraph: {
        type: 'website',
        url: 'https://ollabs.studio/updates',
        title: 'What\'s new at Ollabs',
        description: 'See what we shipped recently on Ollabs.',
        siteName: 'Ollabs',
        images: ['/og.png'],
    },
};

export default function UpdatesPage() {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className={`${PAGE_TOP_UNDER_NAV} pb-[max(4rem,env(safe-area-inset-bottom))] px-4 sm:px-6`}>
                <div className="max-w-2xl mx-auto">
                    <p className="text-sm font-semibold text-muted mb-2">
                        Updates
                    </p>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-3">
                        What&apos;s new
                    </h1>
                    <p className="text-[15px] sm:text-base text-ink/70 leading-relaxed mb-8">
                        Ollabs is actively maintained. Here is what changed recently, in plain language.
                    </p>
                    <UpdatesList />
                    <p className="text-center text-xs text-muted mt-8">
                        <Link href="/" className="hover:text-brand-deep transition-colors">
                            Back to home
                        </Link>
                        {' · '}
                        <Link href="/privacy" className="hover:text-brand-deep transition-colors">
                            Privacy
                        </Link>
                        {' · '}
                        <Link href="/about" className="hover:text-brand-deep transition-colors">
                            About
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
