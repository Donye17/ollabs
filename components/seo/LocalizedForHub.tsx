import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { AdSlot } from '@/components/AdSlot';
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
    footerCopy,
}: LocalizedForHubProps) {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className="px-6 pb-10 pt-32">
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
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                    ))}
                </div>
                <div className="mx-auto mt-10 max-w-3xl">
                    <AdSlot surface="seo" />
                </div>
            </section>

            <footer className="border-t border-ink/10 bg-paper py-10">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-muted sm:flex-row">
                    <img src="/Ollabs Logo Black.png" alt="Ollabs" className="h-6 w-auto" />
                    <p>{footerCopy}</p>
                </div>
            </footer>
        </main>
    );
}
