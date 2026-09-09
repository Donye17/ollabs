import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { AlertCircle } from 'lucide-react';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';
import { isRecoveryToken } from '@/lib/recoverToken';
import { RecoverTokenClient } from '@/components/RecoverTokenClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Your campaigns',
    robots: { index: false, follow: false },
};

/**
 * Recovery landing. Do not redeem the token here.
 *
 * The mailed URL is fetched by Outlook Safe Links, Slack unfurls, WhatsApp
 * link previews, and other scanners before the organizer taps it. Redeeming
 * on GET burned the one-time token and put every campaign's manage key in
 * the scanner's response body. Confirm happens in RecoverTokenClient via POST.
 */
export default async function RecoverTokenPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    const valid = isRecoveryToken(token);

    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className={`${PAGE_TOP_UNDER_NAV} pb-8 px-6`}>
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="font-display text-4xl font-extrabold mb-3">
                        {valid ? 'Your campaigns' : 'This link has expired'}
                    </h1>
                    <p className="text-ink/70">
                        {valid
                            ? 'Bookmark the dashboard links after you open them. Each one is the key to that campaign.'
                            : 'Recovery links work once and expire after 24 hours.'}
                    </p>
                </div>
            </section>

            <section className="px-6 pb-24">
                <div className="max-w-2xl mx-auto">
                    {valid ? (
                        <RecoverTokenClient token={token} />
                    ) : (
                        <div className="bg-cream border border-ink/10 rounded-2xl p-10 text-center">
                            <AlertCircle className="w-8 h-8 text-muted mx-auto mb-3" />
                            <p className="text-sm text-ink/70 mb-6">
                                Request a fresh link and we will email it straight over.
                            </p>
                            <Link
                                href="/recover"
                                className="inline-flex h-11 px-6 rounded-xl bg-brand text-ink font-bold items-center hover:brightness-105 transition-all"
                            >
                                Send a new link
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
