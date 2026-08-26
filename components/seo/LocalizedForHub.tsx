import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { SiteFooter } from '@/components/SiteFooter';
import { AdSlot } from '@/components/AdSlot';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';
import type { UseCase } from '@/lib/useCases';

type LocalizedForHubProps = {
    useCases: UseCase[];
    locale: 'pt' | 'id' | 'es' | 'tl';
    title: string;
    intro: string;
    linkLabel: string;
    footerCopy: string;
};

export function LocalizedForHub({
    useCases,
    locale,
    title,
    intro,
    linkLabel,
}: LocalizedForHubProps) {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className={`${PAGE_TOP_UNDER_NAV} pb-10 px-6`}>
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="mb-4 font-display text-4xl font-extrabold md:text-5xl">{title}</h1>
                    <p className="text-lg text-ink/70">{intro}</p>
                </div>
            </section>

            <section className="px-6 pb-20">
                <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
                    {useCases.map((useCase) => (
                        <Link
                            key={useCase.slug}
                            href={`/${locale}/for/${useCase.slug}`}
                            className="group rounded-2xl border border-ink/10 bg-cream p-6 transition-colors hover:border-brand"
                        >
                            <h2 className="mb-1 font-display text-xl font-bold transition-colors group-hover:text-brand-deep">
                                {useCase.audience}
                            </h2>
                            <p className="mb-3 text-sm text-ink/70">{useCase.subtitle}</p>
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-deep">
                                {linkLabel}
                                <ArrowRight className="h-4 w-4 transition-transform" />
                            </span>
                        </Link>
                    ))}
                </div>
                <div className="mx-auto mt-10 max-w-3xl">
                    <AdSlot surface="seo" />
                </div>
                <div className="mx-auto mt-10 max-w-3xl text-center">
                    <Link
                        href="/create"
                        className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-7 font-bold text-ink hover:brightness-105 transition-all"
                    >
                        Create a campaign <ArrowRight className="h-4 w-4" />
                    </Link>
                    <div className="mt-3">
                        <Link
                            href="/explore"
                            className="inline-flex min-h-[44px] items-center px-4 text-sm font-semibold text-muted hover:text-brand-deep transition-colors"
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
