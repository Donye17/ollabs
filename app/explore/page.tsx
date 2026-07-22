import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { ExploreClient, ExploreCampaign } from '@/components/ExploreClient';
import { FrameConfig } from '@/lib/types';
import { pool } from '@/lib/neon';

export const revalidate = 300;

export const metadata: Metadata = {
    title: 'Explore campaigns | Ollabs',
    description: 'Browse live profile-picture frame campaigns for causes, teams, events, and more. Add one to your photo, or make your own for free.',
    alternates: { canonical: 'https://ollabs.studio/explore' },
    openGraph: { type: 'website', url: 'https://ollabs.studio/explore', title: 'Explore campaigns', description: 'Browse live profile-picture frame campaigns and add one to your photo.', siteName: 'Ollabs', images: ['/og.png'] },
    twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

async function getCampaigns(): Promise<ExploreCampaign[]> {
    try {
        const res = await pool.query(
            `SELECT slug, title, frame_config, supporter_count
             FROM campaigns
             WHERE is_public = true AND is_hidden IS NOT TRUE
             ORDER BY supporter_count DESC NULLS LAST, created_at DESC
             LIMIT 60`
        );
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

export default async function ExplorePage() {
    const campaigns = await getCampaigns();

    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />

            <section className="pt-32 pb-8 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">Explore campaigns</h1>
                    <p className="text-lg text-ink/70">Real campaigns people are rallying behind right now. Add one to your photo, or start your own.</p>
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
