import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

export const metadata: Metadata = {
    title: 'About',
    description:
        'Ollabs is a free profile-picture frame maker for campaigns and causes. Learn who we are, how we stay free, and how to reach us.',
    alternates: { canonical: 'https://ollabs.studio/about' },
    openGraph: {
        type: 'website',
        url: 'https://ollabs.studio/about',
        title: 'About Ollabs',
        description:
            'A free way to run a profile-picture campaign. No signup for supporters, no watermark on their photo.',
        siteName: 'Ollabs',
        images: ['/og.png'],
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-paper text-ink font-sans">
            <NavBar />
            <main className={`max-w-3xl mx-auto px-4 sm:px-6 ${PAGE_TOP_UNDER_NAV} pb-[max(4rem,env(safe-area-inset-bottom))]`}>
                <p className="text-sm font-semibold text-muted mb-2">
                    About
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">
                    From collabs, for coming together
                </h1>
                <p className="text-[15px] sm:text-base text-ink/75 leading-relaxed mb-10">
                    Ollabs is a free tool for organizers who want their people to share one profile-picture frame.
                    Make a frame, share one link, and supporters add it to their photo in seconds.
                </p>

                <div className="space-y-8 text-ink/75 leading-relaxed">
                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">What we do</h2>
                        <p>
                            Churches, schools, teams, fundraisers, and community groups use Ollabs to run a visual
                            campaign without asking everyone to install an app or create an account. Supporters open
                            the link on their phone, drop in a photo, and save or share the framed result.
                        </p>
                        <p className="mt-3">
                            The name is a play on “collabs,” because the point is people showing up together, not a
                            social network with likes and feeds.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">How it stays free</h2>
                        <p>
                            Creating a campaign is free. Supporting one is free. We never put a watermark on the
                            photo a supporter downloads, and we never charge them to remove one.
                        </p>
                        <p className="mt-3">
                            Quiet, labelled ads on some pages (never on the photo itself, and never on the create
                            screen) help cover hosting and keep the product available worldwide. Details are in our{' '}
                            <Link href="/privacy" className="text-brand-deep font-semibold hover:underline">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">Who it’s for</h2>
                        <p>
                            Organizers who need something that works inside WhatsApp and Instagram on a phone.
                            People in many countries already use profile frames for holidays, awareness days, and
                            local causes. We build for that reality: share first, save reliably, no signup wall.
                        </p>
                        <p className="mt-3">
                            Browse{' '}
                            <Link href="/for" className="text-brand-deep font-semibold hover:underline">
                                use cases
                            </Link>
                            ,{' '}
                            <Link href="/day" className="text-brand-deep font-semibold hover:underline">
                                calendar moments
                            </Link>
                            , or step-by-step guides for{' '}
                            <Link href="/guides/start-a-campaign" className="text-brand-deep font-semibold hover:underline">
                                starting a campaign
                            </Link>
                            {' '}and{' '}
                            <Link href="/guides/hub" className="text-brand-deep font-semibold hover:underline">
                                using a hub
                            </Link>
                            . See an honest comparison as a{' '}
                            <Link href="/vs/twibbonize" className="text-brand-deep font-semibold hover:underline">
                                Twibbonize alternative
                            </Link>
                            .
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">Contact</h2>
                        <p>
                            Questions, feedback, or something broken on your campaign:{' '}
                            <a
                                href="mailto:hello@ollabs.studio"
                                className="text-brand-deep font-semibold hover:underline"
                            >
                                hello@ollabs.studio
                            </a>
                            . That is the address we use for contact and for replies to
                            campaign emails.
                        </p>
                        <p className="mt-3">
                            Site:{' '}
                            <a href="https://ollabs.studio" className="text-brand-deep font-semibold hover:underline">
                                ollabs.studio
                            </a>
                            .
                        </p>
                    </section>

                    <section className="pt-2">
                        <Link
                            href="/create"
                            className="inline-flex min-h-[48px] items-center rounded-xl bg-brand px-6 font-bold text-ink hover:brightness-105 transition-all"
                        >
                            Create a campaign
                        </Link>
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
                    <Link href="/contact" className="hover:text-brand-deep transition-colors">
                        Contact
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
