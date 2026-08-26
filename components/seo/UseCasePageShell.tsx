import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { SiteFooter } from '@/components/SiteFooter';
import { AdSlot } from '@/components/AdSlot';
import { SeoCampaignExample } from '@/components/seo/SeoCampaignExample';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';
import type { UseCase } from '@/lib/useCases';
import type { SeoExampleCampaign } from '@/lib/seoExampleCampaign';

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
    /** Optional: “Example campaign” above the live proof. */
    exampleTitle?: string;
    /** Secondary exit next to Create on the ready block. */
    exploreCampaigns?: string;
};

type Props = {
    uc: UseCase;
    labels: UseCaseLabels;
    related: UseCase[];
    relatedHref: (slug: string) => string;
    createHref?: string;
    example?: SeoExampleCampaign | null;
};

/** Shared layout for /for and localized /pt/for, /id/for SEO pages. */
export function UseCasePageShell({
    uc,
    labels,
    related,
    relatedHref,
    createHref = '/create',
    example = null,
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

            <section className={`relative ${PAGE_TOP_UNDER_NAV} pb-12 px-4 sm:px-6`}>
                <div className="max-w-3xl mx-auto">
                    <p className="text-sm font-semibold text-muted mb-4">
                        {labels.forPrefix} {uc.audience}
                    </p>
                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.05] mb-4">{uc.h1}</h1>
                    <p className="text-base sm:text-lg text-ink/70 mb-7 max-w-2xl">{uc.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href={createHref}
                            className="group min-h-[48px] px-6 rounded-xl bg-brand text-ink font-bold flex items-center gap-2 hover:brightness-105 active:brightness-95 transition-all"
                        >
                            {labels.createCampaign}
                            <ArrowRight className="w-4 h-4" />
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

            {example && (
                <section className="px-4 sm:px-6 pb-10">
                    <div className="max-w-3xl mx-auto flex justify-center">
                        <SeoCampaignExample
                            campaign={example}
                            size={220}
                            title={labels.exampleTitle || 'Example campaign'}
                        />
                    </div>
                </section>
            )}

            <section className="px-4 sm:px-6 pt-2 pb-2">
                <div className="max-w-3xl mx-auto">
                    <AdSlot surface="seo" />
                </div>
            </section>

            <section className="px-4 sm:px-6 py-12 sm:py-16">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
                    {uc.benefits.map((b) => (
                        <div key={b.title} className="border-t border-ink/10 pt-5">
                            <div className="w-9 h-9 rounded-lg bg-brand/15 flex items-center justify-center mb-3">
                                <Check className="w-5 h-5 text-brand-deep" />
                            </div>
                            <h3 className="font-display text-lg font-bold mb-1.5">{b.title}</h3>
                            <p className="text-sm text-ink/70 leading-relaxed">{b.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="how" className="px-4 sm:px-6 py-12 sm:py-16 border-y border-ink/10 scroll-mt-[calc(3.5rem+env(safe-area-inset-top,0px))]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-10">{labels.howItWorksTitle}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {labels.steps.map((s) => (
                            <div key={s.n} className="text-center md:text-left">
                                <div className="w-10 h-10 rounded-full bg-brand text-ink font-display font-bold flex items-center justify-center mx-auto md:mx-0 mb-3">{s.n}</div>
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
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-8">{labels.questionsTitle}</h2>
                    <div className="divide-y divide-ink/10 border-y border-ink/10">
                        {uc.faqs.map((f) => (
                            <div key={f.q} className="py-5">
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
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold mb-3">{labels.readyTitle}</h2>
                    <p className="text-ink/70 mb-7">{labels.readyBody}</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href={createHref}
                            className="group inline-flex min-h-[48px] px-7 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:brightness-105 transition-all"
                        >
                            {labels.createCampaign}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/explore"
                            className="inline-flex min-h-[48px] px-6 rounded-xl border border-ink/15 text-ink font-bold items-center hover:bg-ink/5 transition-all"
                        >
                            {labels.exploreCampaigns || 'Explore campaigns'}
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
                        <p className="text-sm font-semibold text-muted mb-5 text-center">{labels.alsoGreat}</p>
                        <p className="text-[15px] text-ink/80 leading-relaxed text-center">
                            {related.map((u, i) => (
                                <span key={u.slug}>
                                    {i > 0 && <span className="text-muted/50 mx-1.5">·</span>}
                                    <Link
                                        href={relatedHref(u.slug)}
                                        className="font-medium text-ink hover:text-brand-deep transition-colors"
                                    >
                                        {u.audience}
                                    </Link>
                                </span>
                            ))}
                        </p>
                    </div>
                </section>
            )}

            <SiteFooter />
        </main>
    );
}
