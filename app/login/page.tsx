import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { NavBar } from '@/components/NavBar';
import { LoginClient } from '@/components/auth/LoginClient';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

export const metadata: Metadata = {
    title: 'Organizer sign in',
    description: 'Sign in with a code to reach your Ollabs campaign dashboards from any device.',
    robots: { index: false, follow: false },
};

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className={`${PAGE_TOP_UNDER_NAV} pb-6 px-6`}>
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-3">Organizer sign in</h1>
                    <p className="text-ink/70">
                        Only for people running a campaign, so your dashboards follow you between devices.
                        Supporters never need an account.
                    </p>
                </div>
            </section>
            <section className="px-6 pb-8">
                <Suspense fallback={<div className="max-w-md mx-auto h-48 rounded-2xl bg-cream border border-ink/10 animate-pulse" />}>
                    <LoginClient />
                </Suspense>
                <p className="text-center text-sm text-muted mt-6 max-w-md mx-auto">
                    Never made a campaign?{' '}
                    <Link href="/create" className="text-brand-deep font-semibold hover:underline">
                        Start one, no account needed
                    </Link>
                </p>
            </section>
        </main>
    );
}
