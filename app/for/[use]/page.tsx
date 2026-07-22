import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { USE_CASES, getUseCase } from '@/lib/useCases';

export const revalidate = 86400;

export function generateStaticParams() {
    return USE_CASES.map((u) => ({ use: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ use: string }> }): Promise<Metadata> {
    const { use } = await params;
    const uc = getUseCase(use);
    if (!uc) return {};
    const title = `${uc.h1} | Ollabs`;
    const description = `${uc.subtitle} Free, no signup, no ads. Make a frame and share one link.`;
    const url = `https://ollabs.studio/for/${uc.slug}`;
    return {
        title,
        description,
        keywords: [uc.keyword, 'profile picture frame', 'pfp frame', 'twibbon alternative', `${uc.audience.toLowerCase()} profile frame`],
        alternates: { canonical: url },
        openGraph: { type: 'website', url, title, description, siteName: 'Ollabs', images: ['/og.png'] },
        twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
    };
}

const steps = [
    { n: 1, title: 'Make a frame', body: 'Pick a color or upload your own design in the builder.' },
    { n: 2, title: 'Share one link', body: 'Post it in emails, texts, and socials. Everyone uses the same link.' },
    { n: 3, title: 'They add it', body: 'Supporters drop in a photo, download it framed, and your counter climbs.' },
];

export default async function UseCasePage({ params }: { params: Promise<{ use: string }> }) {
    const { use } = await params;
    const uc = getUseCase(use);
    if (!uc) notFound();

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: uc.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    };

    return (
        <main className="min-h-screen bg-paper text-ink">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
            <NavBar />

            {/* Hero */}
            <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full border-[42px] border-brand/15 pointer-events-none" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-cream border border-ink/10 px-4 py-1.5 text-xs font-bold text-muted mb-6">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand" /> For {uc.audience}
                    </span>
                    <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.03] mb-5">{uc.h1}</h1>
                    <p className="text-lg md:text-xl text-ink/70 mb-8 max-w-2xl">{uc.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href="/create" className="group h-12 px-7 rounded-xl bg-brand text-ink font-bold flex items-center gap-2 hover:-translate-y-0.5 hover:brightness-105 transition-all">
                            Create a campaign
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#how" className="h-12 px-7 rounded-xl border border-ink/15 text-ink font-bold flex items-center hover:bg-ink/5 transition-all">
                            How it works
                        </a>
                    </div>
                </div>
            </section>

            {/* Intro */}
            <section className="px-6 pb-6">
                <div className="max-w-3xl mx-auto space-y-4">
                    {uc.intro.map((p, i) => (
                        <p key={i} className="text-lg text-ink/75 leading-relaxed">{p}</p>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section className="px-6 py-16">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {uc.benefits.map((b) => (
                        <div key={b.title} className="bg-cream border border-ink/10 rounded-2xl p-6">
                            <div className="w-9 h-9 rounded-lg bg-brand/15 flex items-center justify-center mb-3">
                                <Check className="w-5 h-5 text-brand-deep" />
                            </div>
                            <h3 className="font-display text-lg font-bold mb-1.5">{b.title}</h3>
                            <p className="text-sm text-ink/70 leading-relaxed">{b.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section id="how" className="px-6 py-16 bg-paper2/50 scroll-mt-20">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-display text-3xl font-extrabold text-center mb-12">How it works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {steps.map((s) => (
                            <div key={s.n} className="bg-cream border border-ink/10 rounded-2xl p-6 text-center">
                                <div className="w-10 h-10 rounded-full bg-brand text-ink font-display font-extrabold flex items-center justify-center mx-auto mb-3">{s.n}</div>
                                <h3 className="font-display text-lg font-bold mb-1.5">{s.title}</h3>
                                <p className="text-sm text-ink/70 leading-relaxed">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-3xl font-extrabold text-center mb-10">Questions</h2>
                    <div className="space-y-4">
                        {uc.faqs.map((f) => (
                            <div key={f.q} className="bg-cream border border-ink/10 rounded-xl p-5">
                                <h3 className="font-semibold mb-1.5">{f.q}</h3>
                                <p className="text-sm text-ink/70 leading-relaxed">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-20">
                <div className="max-w-3xl mx-auto">
                    <div className="relative bg-ink text-paper rounded-3xl px-8 py-14 text-center overflow-hidden">
                        <div className="absolute -right-16 -bottom-20 w-64 h-64 rounded-full border-[30px] border-brand/35 pointer-events-none" />
                        <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-3 relative z-10">Ready to bring your people together?</h2>
                        <p className="text-paper/70 mb-8 relative z-10">Make a campaign in under a minute. No account needed.</p>
                        <Link href="/create" className="group inline-flex h-12 px-8 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:-translate-y-0.5 hover:brightness-105 transition-all relative z-10">
                            Create a campaign
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Related */}
            <section className="px-6 pb-20">
                <div className="max-w-4xl mx-auto">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted font-bold mb-5 text-center">Also great for</p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {USE_CASES.filter((u) => u.slug !== uc.slug).map((u) => (
                            <Link key={u.slug} href={`/for/${u.slug}`} className="px-4 py-2 rounded-full bg-cream border border-ink/10 text-sm font-medium hover:border-brand hover:text-brand-deep transition-colors">
                                {u.audience}
                            </Link>
                        ))}
                    </div>
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
