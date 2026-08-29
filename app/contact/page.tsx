import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

export const metadata: Metadata = {
    title: 'Contact Ollabs',
    description: 'How to reach Ollabs for support, press, bug reports, and to report a campaign that breaks the rules.',
    alternates: { canonical: 'https://ollabs.studio/contact' },
    openGraph: {
        type: 'website',
        url: 'https://ollabs.studio/contact',
        title: 'Contact Ollabs',
        description: 'How to reach Ollabs for support, press, bug reports, and to report a campaign that breaks the rules.',
        siteName: 'Ollabs',
        images: ['/og.png'],
    },
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-paper text-ink font-sans">
            <NavBar />
            <main className={`max-w-3xl mx-auto px-4 sm:px-6 ${PAGE_TOP_UNDER_NAV} pb-[max(4rem,env(safe-area-inset-bottom))]`}>
                <p className="text-sm font-semibold text-muted mb-2">
                    Contact
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">
                    Contact Ollabs
                </h1>
                <p className="text-[15px] sm:text-base text-ink/75 leading-relaxed mb-10">
                    How to reach the person who runs this site, report a problem, or flag a campaign that breaks the rules.
                </p>

                <div className="space-y-8 text-ink/75 leading-relaxed">
                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">Who runs it</h2>
                        <p>
                            Ollabs is run independently by Donye. It is not a registered company.
                            There is no team mailbox behind these addresses: messages go to Donye,
                            who builds and maintains the product.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">General and press</h2>
                        <p>
                            <a
                                href="mailto:hello@ollabs.studio"
                                className="text-brand-deep font-semibold hover:underline"
                            >
                                hello@ollabs.studio
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">Bugs and feature requests</h2>
                        <p>
                            <a
                                href="mailto:feedback@ollabs.studio"
                                className="text-brand-deep font-semibold hover:underline"
                            >
                                feedback@ollabs.studio
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">Response time</h2>
                        <p>
                            We reply within two business days. We read everything, but we do not guarantee a reply.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">Reporting a campaign</h2>
                        <p>
                            Open the campaign page and scroll to the bottom. Use{' '}
                            <span className="font-semibold text-ink">Report this campaign</span>.
                            You can add a short reason, or submit with the field empty. You will see a
                            thanks note once it is sent.
                        </p>
                        <p className="mt-3">
                            We review reports. Enough reports from different people can hide the campaign
                            from public lists. If you cannot find the report control, email{' '}
                            <a
                                href="mailto:hello@ollabs.studio"
                                className="text-brand-deep font-semibold hover:underline"
                            >
                                hello@ollabs.studio
                            </a>
                            {' '}with the campaign link.
                        </p>
                    </section>
                </div>

                <p className="text-center text-xs text-muted mt-12">
                    <Link href="/" className="hover:text-brand-deep transition-colors">
                        Home
                    </Link>
                    {' · '}
                    <Link href="/guides" className="hover:text-brand-deep transition-colors">
                        Guides
                    </Link>
                    {' · '}
                    <Link href="/about" className="hover:text-brand-deep transition-colors">
                        About
                    </Link>
                    {' · '}
                    <Link href="/privacy" className="hover:text-brand-deep transition-colors">
                        Privacy
                    </Link>
                    {' · '}
                    <Link href="/terms" className="hover:text-brand-deep transition-colors">
                        Terms
                    </Link>
                </p>
            </main>
        </div>
    );
}
