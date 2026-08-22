import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { AdSlot } from '@/components/AdSlot';
import type { UseCase } from '@/lib/useCases';

export type UseCaseLabels = {
    forPrefix: string;
    createCampaign: string;
    howItWorksLink: string;
    howItWorksTitle: string;
    steps: { n: number; title: string; body: string }[];
    questionsTitle: string;
    readyTitle: string;
    readyBody: string;
    alsoGreat: string;
    footerCopy: string;
};

type Props = {
    uc: UseCase;
    labels: UseCaseLabels;
    related: UseCase[];
    relatedHref: (slug: string) => string;
    createHref?: string;
};

/** Shared layout for /for and localized /pt/for, /id/for SEO pages. */
export function UseCasePageShell({
    uc,
    labels,
    related,
    relatedHref,
    createHref = '/create',
}: Props) {
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

            <section className="relative pt-[calc(3.5rem+env(safe-area-inset-top,0px)+1.5rem)] pb-12 px-4 sm:px-6 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full border-[42px] border-brand/15 pointer-events-none" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-cream border border-ink/10 px-4 py-1.5 text-xs font-bold text-muted mb-5">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand" /> {labels.forPrefix} {uc.audience}
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.05] mb-4">{uc.h1}</h1>
                    <p className="text-base sm:text-lg text-ink/70 mb-7 max-w-2xl">{uc.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href={createHref}
                            className="group min-h-[48px] px-6 rounded-xl bg-brand text-ink font-bold flex items-center gap-2 hover:-translate-y-0.5 hover:brightness-105 active:brightness-95 transition-all"
                        >
                            {labels.createCampaign}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#how"
                            className="min-h-[48px] px-6 rounded-xl border border-ink/15 text-ink font-bold flex items-center hover:bg-ink/5 transition-all"
                        >
                            {labels.howItWorksLink}
                        </a>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 pb-6">
                <div className="max-w-3xl mx-auto space-y-4">
                    {uc.intro.map((p, i) => (
                        <p key={i} className="text-base sm:text-lg text-ink/75 leading-relaxed">{p}</p>
                    ))}
                </div>
            </section>

            <section className="px-4 sm:px-6 pt-2 pb-2">
                <div className="max-w-3xl mx-auto">
                    <AdSlot surface="seo" />
                </div>
            </section>

            <section className="px-4 sm:px-6 py-12 sm:py-16">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
                    {uc.benefits.map((b) => (
                        <div key={b.title} className="bg-cream border border-ink/10 rounded-2xl p-5 sm:p-6">
                            <div className="w-9 h-9 rounded-lg bg-brand/15 flex items-center justify-center mb-3">
                                <Check className="w-5 h-5 text-brand-deep" />
                            </div>
                            <h3 className="font-display text-lg font-bold mb-1.5">{b.title}</h3>
                            <p className="text-sm text-ink/70 leading-relaxed">{b.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="how" className="px-4 sm:px-6 py-12 sm:py-16 bg-paper2/50 scroll-mt-[calc(3.5rem+env(safe-area-inset-top,0px))]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-center mb-10">{labels.howItWorksTitle}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {labels.steps.map((s) => (
                            <div key={s.n} className="bg-cream border border-ink/10 rounded-2xl p-5 sm:p-6 text-center">
                                <div className="w-10 h-10 rounded-full bg-brand text-ink font-display font-extrabold flex items-center justify-center mx-auto mb-3">{s.n}</div>
                                <h3 className="font-display text-lg font-bold mb-1.5">{s.title}</h3>
                                <p className="text-sm text-ink/70 leading-relaxed">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 pt-6">
                <div className="max-w-3xl mx-auto">
                    <AdSlot surface="seo" />
                </div>
            </section>

            <section className="px-4 sm:px-6 py-12 sm:py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-center mb-8">{labels.questionsTitle}</h2>
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

            <section className="px-4 sm:px-6 pb-10">
                <div className="max-w-3xl mx-auto">
                    <AdSlot surface="seo" />
                </div>
            </section>

            <section className="px-4 sm:px-6 py-16 sm:py-20">
                <div className="max-w-3xl mx-auto">
                    <div className="relative bg-ink text-paper rounded-3xl px-6 sm:px-8 py-12 sm:py-14 text-center overflow-hidden">
                        <div className="absolute -right-16 -bottom-20 w-64 h-64 rounded-full border-[30px] border-brand/35 pointer-events-none" />
                        <h2 className="font-display text-2xl sm:text-3xl font-extrabold mb-3 relative z-10">{labels.readyTitle}</h2>
                        <p className="text-paper/70 mb-7 relative z-10">{labels.readyBody}</p>
                        <Link
                            href={createHref}
                            className="group inline-flex min-h-[48px] px-7 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:-translate-y-0.5 hover:brightness-105 transition-all relative z-10"
                        >
                            {labels.createCampaign}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 pb-8">
                <div className="max-w-3xl mx-auto">
                    <AdSlot surface="seo" />
                </div>
            </section>

            {related.length > 0 && (
                <section className="px-4 sm:px-6 pb-16 sm:pb-20">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted font-bold mb-5 text-center">{labels.alsoGreat}</p>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {related.map((u) => (
                                <Link
                                    key={u.slug}
                                    href={relatedHref(u.slug)}
                                    className="min-h-[44px] px-4 py-2 rounded-full bg-cream border border-ink/10 text-sm font-medium hover:border-brand hover:text-brand-deep transition-colors inline-flex items-center"
                                >
                                    {u.audience}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <footer className="border-t border-ink/10 py-10 bg-paper pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
                    <img src="/Ollabs Logo Black.png" alt="Ollabs" className="h-6 w-auto" />
                    <p>{labels.footerCopy}</p>
                </div>
            </footer>
        </main>
    );
}
