import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';
import { formatGuideDate, guideCopy, guidesInLocale } from '@/lib/guides';

export const metadata: Metadata = {
    title: 'Guias',
    description:
        'Como colocar uma moldura na foto de perfil, sem aplicativo e sem conta. Guias do Ollabs em português.',
    alternates: {
        canonical: 'https://ollabs.studio/pt/guides',
        languages: {
            en: 'https://ollabs.studio/guides',
            'pt-BR': 'https://ollabs.studio/pt/guides',
            'x-default': 'https://ollabs.studio/guides',
        },
    },
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://ollabs.studio/pt/guides',
        title: 'Guias',
        description: 'Como colocar uma moldura na foto de perfil. Sem aplicativo, sem conta, sem marca d\'água.',
        siteName: 'Ollabs',
        images: ['/og.png'],
    },
};

export default function PtGuidesIndexPage() {
    const guides = guidesInLocale('pt');
    return (
        <div className="min-h-screen bg-paper text-ink font-sans">
            <NavBar />
            <main className={`max-w-3xl mx-auto px-4 sm:px-6 ${PAGE_TOP_UNDER_NAV} pb-[max(4rem,env(safe-area-inset-bottom))]`}>
                <p className="text-sm font-semibold text-muted mb-2">Ajuda</p>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">Guias</h1>
                <p className="text-[15px] sm:text-base text-ink/75 leading-relaxed mb-10">
                    Como colocar uma moldura na foto de perfil. Quem apoia só abre o link e adiciona a foto.
                </p>

                <ul className="space-y-4">
                    {guides.map((g) => {
                        const copy = guideCopy(g, 'pt');
                        return (
                            <li key={g.slug}>
                                <Link
                                    href={`/pt/guides/${g.slug}`}
                                    className="group flex items-start justify-between gap-4 rounded-2xl border border-ink/10 bg-cream/40 px-5 py-4 hover:border-brand/40 transition-colors"
                                >
                                    <div>
                                        <p className="font-display text-lg font-bold text-ink group-hover:text-brand-deep transition-colors">
                                            {copy.title}
                                        </p>
                                        <p className="mt-1 text-sm text-ink/70 leading-relaxed">{copy.description}</p>
                                        <p className="mt-2 text-xs text-muted">
                                            {g.author.name}
                                            {' · '}
                                            {formatGuideDate(g.publishedAt, 'pt')}
                                            {' · '}
                                            {g.readingMinutes} min de leitura
                                        </p>
                                    </div>
                                    <ArrowRight
                                        size={18}
                                        className="mt-1 shrink-0 text-muted group-hover:text-brand-deep transition-colors"
                                        aria-hidden
                                    />
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                    <Link
                        href="/create"
                        className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-brand px-6 font-bold text-ink hover:brightness-105 transition-all"
                    >
                        Criar campanha
                        <ArrowRight size={16} />
                    </Link>
                    <Link
                        href="/guides"
                        className="inline-flex min-h-[48px] items-center px-4 text-sm font-semibold text-muted hover:text-brand-deep transition-colors"
                    >
                        Mais guias em inglês
                    </Link>
                </div>
            </main>
        </div>
    );
}
