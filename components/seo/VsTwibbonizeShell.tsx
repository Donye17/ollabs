import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { AdSlot } from '@/components/AdSlot';
import { ArrowRight, Check, X } from 'lucide-react';
import type { VsCopy } from '@/lib/vsTwibbonizeCopy';

export function VsTwibbonizeShell({ copy }: { copy: VsCopy; canonical?: string }) {
    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: copy.faqs.map((f) => ({
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
                        <span className="w-2.5 h-2.5 rounded-full bg-brand" /> {copy.eyebrow}
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.05] mb-4">{copy.h1}</h1>
                    <p className="text-base sm:text-lg text-ink/70 mb-7 max-w-2xl">{copy.hero}</p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/create"
                            className="group min-h-[48px] px-6 rounded-xl bg-brand text-ink font-bold flex items-center gap-2 hover:brightness-105 transition-all"
                        >
                            {copy.createCta}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/explore"
                            className="min-h-[48px] px-6 rounded-xl border border-ink/15 text-ink font-bold flex items-center hover:bg-ink/5 transition-all"
                        >
                            {copy.exploreCta}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 pb-4">
                <div className="max-w-3xl mx-auto overflow-hidden rounded-2xl border border-ink/10 bg-cream">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-ink/10">
                                <th className="text-left font-display font-extrabold p-4 w-[38%]"> </th>
                                <th className="text-left font-display font-extrabold p-4 text-brand-deep">{copy.tableHeaderOllabs}</th>
                                <th className="text-left font-display font-extrabold p-4 text-muted">{copy.tableHeaderTwibbonize}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {copy.rows.map((r) => (
                                <tr key={r.label} className="border-b border-ink/5 last:border-0 align-top">
                                    <td className="p-4 font-semibold text-ink/80">{r.label}</td>
                                    <td className="p-4">
                                        <span className="flex items-start gap-2">
                                            {r.ollabsWins && <Check size={16} className="text-brand-deep mt-0.5 shrink-0" />}
                                            <span className="text-ink/80">{r.ollabs}</span>
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-start gap-2">
                                            {r.ollabsWins && <X size={16} className="text-muted mt-0.5 shrink-0" />}
                                            <span className="text-ink/70">{r.twibbonize}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="max-w-3xl mx-auto text-xs text-muted mt-3 leading-relaxed">{copy.disclaimer}</p>
            </section>

            <section className="px-4 sm:px-6 pb-8">
                <div className="max-w-3xl mx-auto">
                    <AdSlot surface="seo" />
                </div>
            </section>

            <section className="px-4 sm:px-6 py-12 sm:py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold mb-4">{copy.honestTitle}</h2>
                    <p className="text-base sm:text-lg text-ink/75 leading-relaxed mb-4">{copy.honestP1}</p>
                    <p className="text-base sm:text-lg text-ink/75 leading-relaxed">{copy.honestP2}</p>
                </div>
            </section>

            <section className="px-4 sm:px-6 pb-12 sm:pb-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold mb-6">{copy.faqTitle}</h2>
                    <div className="space-y-4">
                        {copy.faqs.map((f) => (
                            <div key={f.q} className="bg-cream border border-ink/10 rounded-2xl p-5">
                                <h3 className="font-display font-bold mb-2">{f.q}</h3>
                                <p className="text-ink/75 leading-relaxed text-sm sm:text-base">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
                <div className="max-w-3xl mx-auto bg-cream border border-ink/10 rounded-3xl p-8 sm:p-10 text-center">
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold mb-3">{copy.tryTitle}</h2>
                    <p className="text-ink/70 mb-7 max-w-xl mx-auto">{copy.tryBody}</p>
                    <Link
                        href="/create"
                        className="inline-flex min-h-[48px] px-7 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:brightness-105 transition-all"
                    >
                        {copy.tryCta}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
