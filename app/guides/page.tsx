import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';
import { GUIDES, formatGuideDate } from '@/lib/guides';

export const metadata: Metadata = {
    title: 'Guides',
    description:
        'Short guides for organizers: how to start a profile-picture campaign, and what a campaign hub is for.',
    alternates: { canonical: 'https://ollabs.studio/guides' },
    openGraph: {
        type: 'website',
        url: 'https://ollabs.studio/guides',
        title: 'Guides',
        description: 'How to start a campaign and use your hub on Ollabs.',
        siteName: 'Ollabs',
        images: ['/og.png'],
    },
};

export default function GuidesIndexPage() {
    return (
        <div className="min-h-screen bg-paper text-ink font-sans">
            <NavBar />
            <main className={`max-w-3xl mx-auto px-4 sm:px-6 ${PAGE_TOP_UNDER_NAV} pb-[max(4rem,env(safe-area-inset-bottom))]`}>
                <p className="text-sm font-semibold text-muted mb-2">Help</p>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">Guides</h1>
                <p className="text-[15px] sm:text-base text-ink/75 leading-relaxed mb-10">
                    Short explainers for organizers. Supporters just open your link and add a photo. No guide needed.
                </p>

                <ul className="space-y-4">
                    {GUIDES.map((g) => (
                        <li key={g.slug}>
                            <Link
                                href={`/guides/${g.slug}`}
                                className="group flex items-start justify-between gap-4 rounded-2xl border border-ink/10 bg-cream/40 px-5 py-4 hover:border-brand/40 transition-colors"
                            >
                                <div>
                                    <p className="font-display text-lg font-bold text-ink group-hover:text-brand-deep transition-colors">
                                        {g.title}
                                    </p>
                                    <p className="mt-1 text-sm text-ink/70 leading-relaxed">{g.description}</p>
                                    <p className="mt-2 text-xs text-muted">
                                        {g.author.name}, {g.author.role}
                                        {' · '}
                                        {formatGuideDate(g.publishedAt)}
                                        {' · '}
                                        {g.readingMinutes} min read
                                    </p>
                                </div>
                                <ArrowRight
                                    size={18}
                                    className="mt-1 shrink-0 text-muted group-hover:text-brand-deep transition-colors"
                                    aria-hidden
                                />
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                    <Link
                        href="/create"
                        className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-brand px-6 font-bold text-ink hover:brightness-105 transition-all"
                    >
                        Create a campaign
                        <ArrowRight size={16} />
                    </Link>
                    <Link
                        href="/explore"
                        className="inline-flex min-h-[48px] items-center px-4 text-sm font-semibold text-muted hover:text-brand-deep transition-colors"
                    >
                        Explore campaigns
                    </Link>
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
                    <Link href="/contact" className="hover:text-brand-deep transition-colors">
                        Contact
                    </Link>
                    {' · '}
                    <Link href="/create" className="hover:text-brand-deep transition-colors">
                        Create
                    </Link>
                </p>
            </main>
        </div>
    );
}
