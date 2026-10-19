import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { AdSlot } from '@/components/AdSlot';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';
import {
    GUIDES,
    formatGuideDate,
    guideCopy,
    sectionAnchor,
    type Guide,
    type GuideLocale,
    type GuideSection,
} from '@/lib/guides';

type Props = {
    guide: Guide;
    locale?: GuideLocale;
};

const CHROME = {
    en: {
        kicker: 'Guide',
        minRead: 'min read',
        onThisPage: 'On this page',
        tocLabel: 'On this page',
        questions: 'Common questions',
        explore: 'Explore campaigns',
        more: 'More guides',
        home: 'Home',
        guides: 'Guides',
        about: 'About',
        contact: 'Contact',
        useCases: 'Use cases',
    },
    pt: {
        kicker: 'Guia',
        minRead: 'min de leitura',
        onThisPage: 'Nesta página',
        tocLabel: 'Nesta página',
        questions: 'Perguntas frequentes',
        explore: 'Ver campanhas',
        more: 'Mais guias',
        home: 'Início',
        guides: 'Guias',
        about: 'Sobre',
        contact: 'Contato',
        useCases: 'Usos',
    },
} as const;

function GuideImage({
    image,
}: {
    image: { src: string; alt: string; caption?: string };
}) {
    return (
        <figure className="my-6">
            <Image
                src={image.src}
                alt={image.alt}
                width={1200}
                height={630}
                className="w-full h-auto rounded-xl border border-ink/10"
            />
            {image.caption && (
                <figcaption className="mt-2 text-sm text-muted text-center">
                    {image.caption}
                </figcaption>
            )}
        </figure>
    );
}

function SectionBody({ section }: { section: GuideSection }) {
    return (
        <>
            {section.image && <GuideImage image={section.image} />}
            {section.screenshot && (
                <span
                    dangerouslySetInnerHTML={{
                        __html: `<!-- SCREENSHOT: ${section.screenshot} -->`,
                    }}
                />
            )}
            {section.paragraphs?.map((p) => (
                <p key={p.slice(0, 40)} className="mb-3 last:mb-0">
                    {p}
                </p>
            ))}
            {section.steps && (
                <ol className="space-y-4 list-none">
                    {section.steps.map((step, i) => (
                        <li key={step.title} className="flex gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-ink text-sm font-bold">
                                {i + 1}
                            </span>
                            <div>
                                <p className="font-semibold text-ink">{step.title}</p>
                                <p className="mt-1 text-[15px]">{step.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            )}
            {section.bullets && (
                <ul className="space-y-2 mt-1">
                    {section.bullets.map((b) => (
                        <li key={b} className="flex gap-2 text-[15px]">
                            <span className="text-brand-deep shrink-0">·</span>
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export function GuidePageShell({ guide, locale = 'en' }: Props) {
    const copy = guideCopy(guide, locale);
    const ui = CHROME[locale];
    const pageUrl = locale === 'pt'
        ? `https://ollabs.studio/pt/guides/${guide.slug}`
        : `https://ollabs.studio/guides/${guide.slug}`;
    const role = locale === 'pt' && guide.authorRolePt ? guide.authorRolePt : guide.author.role;

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: copy.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    };

    const steps = copy.sections.find((section) => section.steps)?.steps ?? [];
    const howToLd = steps.length
        ? {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: copy.title,
            description: copy.description,
            inLanguage: locale === 'pt' ? 'pt-BR' : 'en',
            step: steps.map((step, i) => ({
                '@type': 'HowToStep',
                position: i + 1,
                name: step.title,
                text: step.body,
            })),
        }
        : null;

    const crumbItems = [
        {
            name: ui.home,
            path: locale === 'pt' ? '/pt' : '/',
        },
        {
            name: ui.guides,
            path: locale === 'pt' ? '/pt/guides' : '/guides',
        },
        {
            name: copy.title,
            path: locale === 'pt' ? `/pt/guides/${guide.slug}` : `/guides/${guide.slug}`,
        },
    ];
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbItems.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: `https://ollabs.studio${item.path}`,
        })),
    };

    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: copy.title,
        description: copy.description,
        inLanguage: locale === 'pt' ? 'pt-BR' : 'en',
        author: {
            '@type': 'Person',
            name: guide.author.name,
        },
        datePublished: guide.publishedAt,
        dateModified: guide.updatedAt || guide.publishedAt,
        image: guide.heroImage
            ? `https://ollabs.studio${guide.heroImage.src}`
            : 'https://ollabs.studio/og.png',
        publisher: {
            '@type': 'Organization',
            name: 'Ollabs',
            logo: {
                '@type': 'ImageObject',
                url: 'https://ollabs.studio/og.png',
            },
        },
        mainEntityOfPage: pageUrl,
    };

    const others = GUIDES.filter((g) => g.slug !== guide.slug && (locale === 'en' || g.pt));
    const showToc = copy.sections.length >= 4;
    const adAfter = Math.max(0, Math.floor((copy.sections.length - 1) / 2));

    return (
        <div className="min-h-screen bg-paper text-ink font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
            {howToLd && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
            )}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <NavBar />
            <main className={`max-w-3xl mx-auto px-4 sm:px-6 ${PAGE_TOP_UNDER_NAV} pb-[max(4rem,env(safe-area-inset-bottom))]`}>
                <nav aria-label={locale === 'pt' ? 'Trilha' : 'Breadcrumb'} className="text-sm text-muted mb-3">
                    {crumbItems.slice(0, -1).map((item, i) => (
                        <span key={item.path}>
                            {i > 0 && <span aria-hidden> / </span>}
                            <Link href={item.path} className="hover:text-brand-deep transition-colors">
                                {item.name}
                            </Link>
                        </span>
                    ))}
                    <span aria-hidden> / </span>
                    <span className="text-ink/80" aria-current="page">{copy.title}</span>
                </nav>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-3">{copy.title}</h1>
                <p className="text-sm text-muted mb-6">
                    {guide.author.name}, {role}
                    {' · '}
                    {formatGuideDate(guide.publishedAt, locale)}
                    {' · '}
                    {guide.readingMinutes} {ui.minRead}
                </p>
                <p className="text-[15px] sm:text-base text-ink/75 leading-relaxed mb-8">{copy.subtitle}</p>

                {guide.heroImage && <GuideImage image={guide.heroImage} />}

                {showToc && (
                    <nav
                        className="mb-10 rounded-2xl border border-ink/10 bg-cream/40 px-5 py-4"
                        aria-label={ui.tocLabel}
                    >
                        <p className="text-sm font-semibold text-ink mb-3">{ui.onThisPage}</p>
                        <ol className="space-y-2">
                            {copy.sections.map((section) => (
                                <li key={section.title}>
                                    <a
                                        href={`#${sectionAnchor(section.title)}`}
                                        className="text-sm font-medium text-brand-deep hover:underline"
                                    >
                                        {section.title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                <div className="space-y-10 text-ink/75 leading-relaxed">
                    {copy.sections.map((section, i) => (
                        <div key={section.title}>
                            <section id={sectionAnchor(section.title)} className="scroll-mt-[calc(3.5rem+env(safe-area-inset-top,0px))]">
                                <h2 className="font-display text-xl font-bold text-ink mb-3">{section.title}</h2>
                                <SectionBody section={section} />
                            </section>
                            {i === adAfter && (
                                <div className="py-8">
                                    <AdSlot surface="seo" />
                                </div>
                            )}
                        </div>
                    ))}

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-4">{ui.questions}</h2>
                        <div className="divide-y divide-ink/10 border-y border-ink/10">
                            {copy.faqs.map((f) => (
                                <div key={f.q} className="py-4">
                                    <h3 className="font-semibold text-ink mb-1.5">{f.q}</h3>
                                    <p className="text-[15px]">{f.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="pt-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href={copy.cta.href}
                                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-brand px-6 font-bold text-ink hover:brightness-105 transition-all"
                            >
                                {copy.cta.label}
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/explore"
                                className="inline-flex min-h-[48px] items-center px-4 text-sm font-semibold text-muted hover:text-brand-deep transition-colors"
                            >
                                {ui.explore}
                            </Link>
                        </div>
                    </section>

                    {others.length > 0 && (
                        <section className="border-t border-ink/10 pt-8">
                            <p className="text-sm font-semibold text-muted mb-3">{ui.more}</p>
                            <ul className="space-y-2">
                                {others.map((g) => (
                                    <li key={g.slug}>
                                        <Link
                                            href={locale === 'pt' ? `/pt/guides/${g.slug}` : `/guides/${g.slug}`}
                                            className="text-[15px] font-medium text-brand-deep hover:underline"
                                        >
                                            {guideCopy(g, locale).title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                <p className="text-center text-xs text-muted mt-12">
                    <Link href={locale === 'pt' ? '/pt' : '/'} className="hover:text-brand-deep transition-colors">
                        {ui.home}
                    </Link>
                    {' · '}
                    <Link href={locale === 'pt' ? '/pt/guides' : '/guides'} className="hover:text-brand-deep transition-colors">
                        {ui.guides}
                    </Link>
                    {' · '}
                    <Link href="/about" className="hover:text-brand-deep transition-colors">
                        {ui.about}
                    </Link>
                    {' · '}
                    <Link href="/contact" className="hover:text-brand-deep transition-colors">
                        {ui.contact}
                    </Link>
                    {' · '}
                    <Link href={locale === 'pt' ? '/pt/for' : '/for'} className="hover:text-brand-deep transition-colors">
                        {ui.useCases}
                    </Link>
                </p>
            </main>
        </div>
    );
}
