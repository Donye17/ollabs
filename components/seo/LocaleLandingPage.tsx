import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { HomeCreateCta } from '@/components/home/HomeCreateCta';
import { AdSlot } from '@/components/AdSlot';
import type { LandingCopy } from '@/lib/i18n/messages';

type Props = {
    t: LandingCopy;
    htmlLang: string;
    extraFooterLinks?: ReactNode;
};

/** Shared mobile-first SEO landing for /pt, /id, /tl, /hi. */
export function LocaleLandingPage({ t, htmlLang, extraFooterLinks }: Props) {
    const steps = [
        { title: t.step1Title, body: t.step1Body },
        { title: t.step2Title, body: t.step2Body },
        { title: t.step3Title, body: t.step3Body },
    ];
    const reasons = [t.why1, t.why2, t.why3, t.why4];

    return (
        <main className="min-h-screen bg-paper text-ink" lang={htmlLang}>
            <NavBar />

            <section className="relative pt-[calc(3.5rem+env(safe-area-inset-top,0px)+1.5rem)] pb-12 px-4 sm:px-6 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full border-[42px] border-brand/15 pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-cream border border-ink/10 px-4 py-1.5 text-xs font-bold text-muted mb-5">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand" /> {t.eyebrow}
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.03] mb-5">
                        {t.headline} <span className="text-brand-deep">{t.headlineAccent}</span>
                    </h1>
                    <p className="text-base sm:text-lg text-ink/70 mb-7 max-w-2xl mx-auto leading-relaxed">{t.sub}</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <HomeCreateCta
                            eventFrom={htmlLang}
                            className="group min-h-[48px] px-6 rounded-xl bg-brand text-ink font-bold flex items-center gap-2 hover:brightness-105 active:brightness-95 transition-all"
                        >
                            {t.cta}
                            <ArrowRight className="w-4 h-4" />
                        </HomeCreateCta>
                        <Link
                            href="/"
                            hrefLang="en"
                            className="min-h-[48px] px-6 rounded-xl bg-transparent border border-ink/15 text-ink font-bold flex items-center hover:bg-ink/5 transition-all"
                        >
                            {t.ctaSecondary}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 py-14 sm:py-20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-10">{t.howTitle}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {steps.map((s, i) => (
                            <div key={s.title} className="bg-cream border border-ink/10 rounded-2xl p-6 text-center">
                                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">{t.stepLabel(i + 1)}</p>
                                <h3 className="font-display text-lg font-bold mb-2">{s.title}</h3>
                                <p className="text-sm text-ink/70 leading-relaxed">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 py-12 sm:py-16 bg-paper2/50">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-8">{t.whyTitle}</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {reasons.map((r) => (
                            <li key={r} className="flex items-start gap-3 bg-cream border border-ink/10 rounded-xl px-4 py-3 text-sm font-semibold">
                                <Check size={18} className="text-brand-deep shrink-0 mt-0.5" />
                                <span>{r}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="px-4 sm:px-6 pb-10">
                <div className="max-w-3xl mx-auto">
                    <AdSlot surface="seo" />
                </div>
            </section>

            <footer className="py-10 text-center text-sm text-muted border-t border-ink/10 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Link href="/" hrefLang="en" className="font-semibold text-brand-deep hover:underline">
                    {t.englishSite}
                </Link>
                {extraFooterLinks}
            </footer>
        </main>
    );
}
