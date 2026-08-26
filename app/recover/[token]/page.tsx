import type { Metadata } from 'next';
import Link from 'next/link';
import { pool } from '@/lib/neon';
import { NavBar } from '@/components/NavBar';
import { BarChart3, ExternalLink, AlertCircle } from 'lucide-react';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Your campaigns',
    robots: { index: false, follow: false },
};

type Row = {
    slug: string;
    title: string;
    owner_token: string;
    supporter_count: number;
    created_at: string;
};

/**
 * Redeem a recovery token.
 *
 * The token is marked used on first redemption, but we still return the
 * campaigns on that same request. Marking it used *before* rendering means a
 * refresh shows the expired state, which is the correct trade: the links on
 * this page are the durable thing, not the page itself.
 */
async function redeem(token: string): Promise<{ ok: boolean; rows: Row[] }> {
    if (!/^[a-f0-9]{64}$/.test(token)) return { ok: false, rows: [] };
    try {
        const claim = await pool.query(
            `UPDATE campaign_recovery_tokens
             SET used_at = NOW()
             WHERE token = $1 AND used_at IS NULL AND expires_at > NOW()
             RETURNING email`,
            [token]
        );
        if (claim.rowCount === 0) return { ok: false, rows: [] };
        const email = claim.rows[0].email;
        const res = await pool.query(
            `SELECT slug, title, owner_token, COALESCE(supporter_count, 0) AS supporter_count, created_at
             FROM campaigns
             WHERE organizer_email = $1
             ORDER BY created_at DESC`,
            [email]
        );
        return { ok: true, rows: res.rows as Row[] };
    } catch (e) {
        console.error('Recovery redemption failed:', e);
        return { ok: false, rows: [] };
    }
}

export default async function RecoverTokenPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    const { ok, rows } = await redeem(token);

    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className={`${PAGE_TOP_UNDER_NAV} pb-8 px-6`}>
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="font-display text-4xl font-extrabold mb-3">
                        {ok ? 'Your campaigns' : 'This link has expired'}
                    </h1>
                    <p className="text-ink/70">
                        {ok
                            ? 'Bookmark the dashboard links below. Each one is the key to that campaign.'
                            : 'Recovery links work once and expire after 24 hours.'}
                    </p>
                </div>
            </section>

            <section className="px-6 pb-24">
                <div className="max-w-2xl mx-auto">
                    {!ok ? (
                        <div className="bg-cream border border-ink/10 rounded-2xl p-10 text-center">
                            <AlertCircle className="w-8 h-8 text-muted mx-auto mb-3" />
                            <p className="text-sm text-ink/70 mb-6">
                                Request a fresh link and we will email it straight over.
                            </p>
                            <Link
                                href="/recover"
                                className="inline-flex h-11 px-6 rounded-xl bg-brand text-ink font-bold items-center hover:brightness-105 transition-all"
                            >
                                Send a new link
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {rows.map((c) => (
                                <div
                                    key={c.slug}
                                    className="bg-cream border border-ink/10 rounded-2xl p-4 flex items-center gap-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="font-display font-bold truncate">{c.title}</p>
                                        <p className="text-xs text-muted truncate">
                                            ollabs.studio/c/{c.slug} · {c.supporter_count.toLocaleString()} supporter
                                            {c.supporter_count === 1 ? '' : 's'}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/c/${c.slug}`}
                                        className="h-10 w-10 rounded-xl border border-ink/15 flex items-center justify-center hover:bg-paper transition-colors"
                                        title="Open campaign"
                                    >
                                        <ExternalLink size={16} />
                                    </Link>
                                    <Link
                                        href={`/c/${c.slug}/manage?k=${c.owner_token}`}
                                        className="h-10 px-4 rounded-xl bg-brand text-ink font-bold text-sm flex items-center gap-2 hover:brightness-105 transition-all"
                                    >
                                        <BarChart3 size={16} />
                                        Dashboard
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
