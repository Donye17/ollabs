import Link from 'next/link';
import { formatGuideDate, recentGuides } from '@/lib/guides';

export function GuidesReadNext() {
    const guides = recentGuides(3);
    if (guides.length === 0) return null;

    return (
        <section className="px-4 sm:px-6 py-14 border-t border-ink/10">
            <div className="max-w-4xl mx-auto">
                <p className="text-sm font-semibold text-muted mb-2 text-center">Read next</p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-8">Guides</h2>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {guides.map((g) => (
                        <li key={g.slug}>
                            <Link
                                href={`/guides/${g.slug}`}
                                className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-cream/40 px-5 py-5 hover:border-brand/40 transition-colors"
                            >
                                <p className="font-display text-lg font-bold text-ink group-hover:text-brand-deep transition-colors leading-snug">
                                    {g.title}
                                </p>
                                <p className="mt-2 text-sm text-ink/70 leading-relaxed flex-1">
                                    {g.description}
                                </p>
                                <p className="mt-4 text-xs text-muted">
                                    {g.author.name}
                                    {' · '}
                                    {formatGuideDate(g.publishedAt)}
                                    {' · '}
                                    {g.readingMinutes} min
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
