import type { Metadata } from 'next';
import Link from 'next/link';
import { pool } from '@/lib/neon';
import { NavBar } from '@/components/NavBar';
import { visibleFrameSql } from '@/lib/frameValidity';
import { ArrowRight, Users } from 'lucide-react';

export const revalidate = 900;

const URL = 'https://ollabs.studio/day/national-coffee-day/independents';

export const metadata: Metadata = {
    title: 'The Independents List: National Coffee Day',
    description:
        'The chains own National Coffee Day with free-cup offers. Your shop made the coffee. A public record of every independent running a frame, published every year.',
    keywords: ['national coffee day independent coffee shops', 'support local coffee shop',
        'national coffee day 2026', 'independent coffee day'],
    alternates: { canonical: URL },
    openGraph: {
        type: 'website', url: URL, siteName: 'Ollabs',
        title: 'The Independents List: National Coffee Day',
        description: 'The chains own the day. Your shop made the coffee. A public record of every independent running a frame, published every year.',
        images: ['/og.png'],
    },
};

type Entry = { slug: string; title: string; supporter_count: number; created_at: string };

/**
 * Every campaign started from the Coffee Day page.
 *
 * Unlike the day pages, zero-supporter campaigns are kept. This is a register
 * of who took part, not a leaderboard, and a shop that joined counts whether or
 * not anyone framed a photo yet.
 */
async function entries(): Promise<Entry[]> {
    try {
        const res = await pool.query(
            `SELECT c.slug, c.title, COALESCE(c.supporter_count, 0) AS supporter_count, c.created_at
             FROM campaigns c
             WHERE c.is_public = true AND c.is_hidden IS NOT TRUE
               AND c.day_slug = 'national-coffee-day'
               AND ${visibleFrameSql('c')}
             ORDER BY c.created_at ASC`
        );
        return res.rows as Entry[];
    } catch (e) {
        console.error('independents list failed', e);
        return [];
    }
}

export default async function IndependentsPage() {
    const rows = await entries();
    const byYear = new Map<number, Entry[]>();
    for (const r of rows) {
        const y = new Date(r.created_at).getUTCFullYear();
        byYear.set(y, [...(byYear.get(y) ?? []), r]);
    }
    const years = [...byYear.keys()].sort((a, b) => b - a);

    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />

            <section className="relative pt-32 pb-12 px-6 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full border-[42px] border-brand/15 pointer-events-none" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.03] mb-5">
                        The Independents List
                    </h1>
                    <p className="text-lg md:text-xl text-ink/70 max-w-2xl">
                        The chains own this day. Your shop made the coffee.
                    </p>
                </div>
            </section>

            {/* The position. Written to be argued with, not to be neutral. */}
            <section className="px-6 pb-12">
                <div className="max-w-3xl mx-auto space-y-4 text-lg text-ink/75 leading-relaxed">
                    <p>
                        Every September 29 the big chains give away a free cup and call it a holiday. It works,
                        because a day with no owner is easy to take.
                    </p>
                    <p>
                        Your shop made the coffee. You cannot give away a thousand cups, and you cannot outspend a
                        national ad budget. Competing on the discount is a fight nobody wins.
                    </p>
                    <p>
                        So let the day point at the people who make the thing instead. That is the whole idea.
                    </p>
                    <p className="font-semibold text-ink">
                        Ollabs gives every independent shop a free frame for National Coffee Day. No signup,
                        and nothing charged to the customer who uses it. Run one and your shop goes on this list. It
                        gets published every year, and it does not come down.
                    </p>
                    <p>
                        This starts in 2026, so the list is short. That is what day one looks like.
                    </p>
                </div>
            </section>

            {/* The record */}
            <section className="px-6 pb-12">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-baseline justify-between mb-6 gap-4 flex-wrap">
                        <h2 className="font-display text-2xl md:text-3xl font-extrabold">The list</h2>
                        <p className="text-sm text-muted">
                            {rows.length === 0
                                ? 'No entries yet'
                                : `${rows.length} shop${rows.length === 1 ? '' : 's'} so far`}
                        </p>
                    </div>

                    {rows.length === 0 ? (
                        <div className="bg-cream border border-ink/10 rounded-2xl p-8 text-center">
                            <p className="text-ink/75 mb-2 font-semibold">Nobody is on it yet.</p>
                            <p className="text-ink/70 mb-6 text-sm max-w-md mx-auto">
                                Go first and yours is the first name on it. Make a frame, share it with your
                                regulars, and you are on the list.
                            </p>
                            <Link
                                href="/create?day=national-coffee-day"
                                className="inline-flex h-11 px-6 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:brightness-105 transition-all"
                            >
                                Add your shop <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {years.map((y) => (
                                <div key={y}>
                                    <h3 className="font-display font-extrabold text-lg mb-3">{y}</h3>
                                    <div className="space-y-2">
                                        {(byYear.get(y) ?? []).map((r) => (
                                            <Link
                                                key={r.slug}
                                                href={`/c/${r.slug}`}
                                                className="bg-cream border border-ink/10 rounded-xl p-4 flex items-center gap-3 hover:border-brand/40 transition-colors"
                                            >
                                                <span className="min-w-0 flex-1 font-semibold truncate">{r.title}</span>
                                                {r.supporter_count > 0 && (
                                                    <span className="text-xs text-muted flex items-center gap-1.5 shrink-0">
                                                        <Users size={12} />
                                                        {r.supporter_count.toLocaleString()}
                                                    </span>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="px-6 pb-24">
                <div className="max-w-3xl mx-auto bg-cream border border-ink/10 rounded-3xl p-10 text-center">
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-3">Put your shop on it</h2>
                    <p className="text-ink/70 mb-7 max-w-xl mx-auto">
                        Make a frame in your colors, print the QR code for the counter, and let your regulars do the
                        posting. It takes a minute. It is free, and it stays free.
                    </p>
                    <Link
                        href="/create?day=national-coffee-day"
                        className="inline-flex h-12 px-7 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:brightness-105 transition-all"
                    >
                        Create your frame <ArrowRight size={16} />
                    </Link>
                    <p className="mt-6 text-sm">
                        <Link href="/day/national-coffee-day" className="text-brand-deep font-semibold hover:underline">
                            Back to National Coffee Day
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
