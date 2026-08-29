import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { AdSlot } from '@/components/AdSlot';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';
import {
    GUIDES,
    formatGuideDate,
    sectionAnchor,
    type Guide,
    type GuideSection,
} from '@/lib/guides';

type Props = {
    guide: Guide;
};

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

export function GuidePageShell({ guide }: Props) {
    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    };

    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.description,
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
        mainEntityOfPage: `https://ollabs.studio/guides/${guide.slug}`,
    };

    const others = GUIDES.filter((g) => g.slug !== guide.slug);
    const showToc = guide.sections.length >= 4;
    const adAfter = Math.max(0, Math.floor((guide.sections.length - 1) / 2));

    return (
        <div className="min-h-screen bg-paper text-ink font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
            <NavBar />
            <main className={`max-w-3xl mx-auto px-4 sm:px-6 ${PAGE_TOP_UNDER_NAV} pb-[max(4rem,env(safe-area-inset-bottom))]`}>
                <p className="text-sm font-semibold text-muted mb-2">Guide</p>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-3">{guide.title}</h1>
                <p className="text-sm text-muted mb-6">
                    {guide.author.name}, {guide.author.role}
                    {' · '}
                    {formatGuideDate(guide.publishedAt)}
                    {' · '}
                    {guide.readingMinutes} min read
                </p>
                <p className="text-[15px] sm:text-base text-ink/75 leading-relaxed mb-8">{guide.subtitle}</p>

                {guide.heroImage && <GuideImage image={guide.heroImage} />}

                {showToc && (
                    <nav
                        className="mb-10 rounded-2xl border border-ink/10 bg-cream/40 px-5 py-4"
                        aria-label="On this page"
                    >
                        <p className="text-sm font-semibold text-ink mb-3">On this page</p>
                        <ol className="space-y-2">
                            {guide.sections.map((section) => (
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
                    {guide.sections.map((section, i) => (
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
                        <h2 className="font-display text-xl font-bold text-ink mb-4">Common questions</h2>
                        <div className="divide-y divide-ink/10 border-y border-ink/10">
                            {guide.faqs.map((f) => (
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
                                href={guide.cta.href}
                                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-brand px-6 font-bold text-ink hover:brightness-105 transition-all"
                            >
                                {guide.cta.label}
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/explore"
                                className="inline-flex min-h-[48px] items-center px-4 text-sm font-semibold text-muted hover:text-brand-deep transition-colors"
                            >
                                Explore campaigns
                            </Link>
                        </div>
                    </section>

                    {others.length > 0 && (
                        <section className="border-t border-ink/10 pt-8">
                            <p className="text-sm font-semibold text-muted mb-3">More guides</p>
                            <ul className="space-y-2">
                                {others.map((g) => (
                                    <li key={g.slug}>
                                        <Link
                                            href={`/guides/${g.slug}`}
                                            className="text-[15px] font-medium text-brand-deep hover:underline"
                                        >
                                            {g.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                <p className="text-center text-xs text-muted mt-12">
                    <Link href="/" className="hover:text-brand-deep transition-colors">
                        Home
                    </Link>
                    {' · '}
                    <Link href="/guides" className="hover:text-brand-deep transition-colors">
                        Guides
                    </Link>
                    {' · '}
                    <Link href="/about" className="hover:text-brand-deep transition-colors">
                        About
                    </Link>
                    {' · '}
                    <Link href="/contact" className="hover:text-brand-deep transition-colors">
                        Contact
                    </Link>
                    {' · '}
                    <Link href="/for" className="hover:text-brand-deep transition-colors">
                        Use cases
                    </Link>
                </p>
            </main>
        </div>
    );
}
