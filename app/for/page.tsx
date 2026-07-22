import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { USE_CASES } from '@/lib/useCases';

export const metadata: Metadata = {
    title: 'Who uses Ollabs | Profile picture frame campaigns',
    description: 'Profile-picture frame campaigns for fundraisers, nonprofits, churches, schools, sports teams, events, and more. Free, no signup, no ads.',
    alternates: { canonical: 'https://ollabs.studio/for' },
    openGraph: { type: 'website', url: 'https://ollabs.studio/for', title: 'Who uses Ollabs', description: 'Profile-picture frame campaigns for causes, teams, events, and more.', siteName: 'Ollabs', images: ['/og.png'] },
    twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export default function ForHub() {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className="pt-32 pb-10 px-6">
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
                                See how <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <footer className="border-t border-ink/10 py-10 bg-paper">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
                    <img src="/Ollabs Logo Black.png" alt="Ollabs" className="h-6 w-auto" />
                    <p>&copy; 2026 Ollabs. Bring your people together.</p>
                </div>
            </footer>
        </main>
    );
}
