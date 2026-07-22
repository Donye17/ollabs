import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { ExploreClient, ExploreCampaign } from '@/components/ExploreClient';
import { FrameConfig } from '@/lib/types';
import { pool } from '@/lib/neon';
import { CATEGORIES, CATEGORY_KEYS } from '@/lib/categories';

export const revalidate = 300;

export const metadata: Metadata = {
    title: 'Explore campaigns | Ollabs',
    description: 'Browse live profile-picture frame campaigns for causes, teams, events, and more. Add one to your photo, or make your own for free.',
    alternates: { canonical: 'https://ollabs.studio/explore' },
    openGraph: { type: 'website', url: 'https://ollabs.studio/explore', title: 'Explore campaigns', description: 'Browse live profile-picture frame campaigns and add one to your photo.', siteName: 'Ollabs', images: ['/og.png'] },
    twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

type Sort = 'popular' | 'trending' | 'newest';

async function getCampaigns(sort: Sort, category: string | null): Promise<ExploreCampaign[]> {
    const base = `SELECT c.slug, c.title, c.frame_config, c.supporter_count FROM campaigns c`;
    // category is validated against the fixed allowlist before reaching here, so it is safe to inline.
    const catClause = category ? ` AND c.category = '${category}'` : '';
    const where = `WHERE c.is_public = true AND c.is_hidden IS NOT TRUE${catClause}`;
    let query: string;
    if (sort === 'newest') {
        query = `${base} ${where} ORDER BY c.created_at DESC LIMIT 60`;
    } else if (sort === 'trending') {
        query = `${base}
            LEFT JOIN (
                SELECT campaign_id, COUNT(*)::int AS recent
                FROM campaign_uses
                WHERE created_at >= now() - interval '7 days'
                GROUP BY campaign_id
            ) r ON r.campaign_id = c.id
            ${where}
            ORDER BY COALESCE(r.recent, 0) DESC, c.supporter_count DESC NULLS LAST, c.created_at DESC
            LIMIT 60`;
    } else {
        query = `${base} ${where} ORDER BY c.supporter_count DESC NULLS LAST, c.created_at DESC LIMIT 60`;
    }
    try {
        const res = await pool.query(query);
        return res.rows.map((r) => ({
            slug: r.slug,
            title: r.title,
            supporterCount: r.supporter_count ?? 0,
            frame: (typeof r.frame_config === 'string' ? JSON.parse(r.frame_config) : r.frame_config) as FrameConfig,
        }));
    } catch (e) {
        console.error('Failed to load explore campaigns', e);
        return [];
    }
}

const SORTS: { key: Sort; label: string }[] = [
    { key: 'popular', label: 'Popular' },
    { key: 'trending', label: 'Trending' },
    { key: 'newest', label: 'Newest' },
];

function buildHref(sort: Sort, category: string | null): string {
    const params = new URLSearchParams();
    if (sort !== 'popular') params.set('sort', sort);
    if (category) params.set('category', category);
    const qs = params.toString();
    return qs ? `/explore?${qs}` : '/explore';
}

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ sort?: string; category?: string }> }) {
    const sp = await searchParams;
    const sort: Sort = sp.sort === 'newest' ? 'newest' : sp.sort === 'trending' ? 'trending' : 'popular';
    const category = sp.category && CATEGORY_KEYS.includes(sp.category) ? sp.category : null;
    const campaigns = await getCampaigns(sort, category);

    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />

            <section className="pt-32 pb-8 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">Explore campaigns</h1>
                    <p className="text-lg text-ink/70">Real campaigns people are rallying behind right now. Add one to your photo, or start your own.</p>
                </div>
            </section>

            <section className="px-6 pb-4">
                <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
                    <div className="inline-flex p-1 bg-cream border border-ink/10 rounded-full">
                        {SORTS.map((s) => (
                            <Link
                                key={s.key}
                                href={buildHref(s.key, category)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${sort === s.key ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
                            >
                                {s.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <Link
                            href={buildHref(sort, null)}
                            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${category === null ? 'bg-brand/15 border-brand/40 text-brand-deep' : 'bg-cream border-ink/10 text-muted hover:text-ink'}`}
                        >
                            All
                        </Link>
                        {CATEGORIES.map((c) => (
                            <Link
                                key={c.key}
                                href={buildHref(sort, c.key)}
                                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${category === c.key ? 'bg-brand/15 border-brand/40 text-brand-deep' : 'bg-cream border-ink/10 text-muted hover:text-ink'}`}
                            >
                                {c.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    {campaigns.length === 0 ? (
                        <div className="text-center">
                            <p className="text-muted mb-6">No campaigns yet. Be the first.</p>
                            <Link href="/create" className="inline-flex h-12 px-7 rounded-xl bg-brand text-ink font-bold items-center hover:brightness-105 transition-all">Create a campaign</Link>
                        </div>
                    ) : (
                        <ExploreClient campaigns={campaigns} />
                    )}
                </div>
            </section>

            <section className="px-6 pb-24">
                <div className="max-w-3xl mx-auto text-center">
                    <Link href="/create" className="inline-flex h-12 px-8 rounded-xl bg-ink text-paper font-bold items-center hover:brightness-125 transition-all">Start your own campaign</Link>
                </div>
            </section>

            <footer className="border-t border-ink/10 py-10 bg-paper">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
                    <img src="/Ollabs Logo Black.png" alt="Ollabs" className="h-6 w-auto" />
                    <p>&copy; 2026 Ollabs. Bring your people together.</p>
                </div>
            </footer>
        </main>
    );
}
