import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { SiteFooter } from '@/components/SiteFooter';
import { USE_CASES } from '@/lib/useCases';
import { AdSlot } from '@/components/AdSlot';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

export const metadata: Metadata = {
    title: 'Who uses Ollabs | Profile picture frame campaigns',
    description: 'Profile-picture frame campaigns for fundraisers, nonprofits, churches, schools, sports teams, events, and more. Free, no signup, no watermark.',
    alternates: {
        canonical: 'https://ollabs.studio/for',
        languages: {
            en: 'https://ollabs.studio/for',
            'pt-BR': 'https://ollabs.studio/pt/for',
            'x-default': 'https://ollabs.studio/for',
        },
    },
    openGraph: { type: 'website', url: 'https://ollabs.studio/for', title: 'Who uses Ollabs', description: 'Profile-picture frame campaigns for causes, teams, events, and more.', siteName: 'Ollabs', images: ['/og.png'] },
    twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export default function ForHub() {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className={`${PAGE_TOP_UNDER_NAV} pb-10 px-6`}>
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">Made for bringing people together</h1>
                    <p className="text-lg text-ink/70">However you rally your people, Ollabs makes it one frame and one link. Pick your world.</p>
                </div>
            </section>

            <section className="px-6 pb-20">
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {USE_CASES.map((u) => (
                        <Link key={u.slug} href={`/for/${u.slug}`} className="group bg-cream border border-ink/10 rounded-2xl p-6 hover:border-brand transition-colors">
                            <h2 className="font-display text-xl font-bold mb-1 group-hover:text-brand-deep transition-colors">{u.audience}</h2>
                            <p className="text-sm text-ink/70 mb-3">{u.subtitle}</p>
                            <span className="text-sm font-semibold text-brand-deep inline-flex items-center gap-1">
                                See how <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                    ))}
                </div>
                <div className="max-w-3xl mx-auto mt-10">
                    <AdSlot surface="seo" />
                </div>
                <div className="max-w-3xl mx-auto mt-10 text-center">
                    <Link
                        href="/create"
                        className="inline-flex h-12 px-7 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:brightness-105 transition-all"
                    >
                        Create a campaign <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="mt-3">
                        <Link
                            href="/explore"
                            className="inline-flex min-h-[44px] px-4 text-sm font-semibold text-muted hover:text-brand-deep transition-colors"
                        >
                            Explore campaigns
                        </Link>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
