"use client";
import React, { useEffect, useState } from 'react';
import { Loader2, EyeOff, Eye, ExternalLink, ShieldAlert } from 'lucide-react';

interface ReportRow {
    slug: string;
    title: string;
    is_hidden: boolean;
    supporter_count: number;
    view_count: number;
    report_count: number;
    last_reported: string;
    reasons: string[] | null;
}

export const AdminClient: React.FC = () => {
    const [key, setKey] = useState<string | null>(null);
    const [rows, setRows] = useState<ReportRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState<string | null>(null);

    const load = (k: string) => {
        setLoading(true);
        fetch(`/api/admin/reports?key=${encodeURIComponent(k)}`)
            .then(async (r) => {
                if (!r.ok) throw new Error(r.status === 401 ? 'Wrong or missing admin key.' : 'Could not load reports.');
                return r.json();
            })
            .then((d: ReportRow[]) => setRows(d))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const k = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('key') : null;
        setKey(k);
        if (!k) {
            setError('Add your admin key to the URL, for example /admin?key=YOUR_KEY');
            setLoading(false);
            return;
        }
        load(k);
    }, []);

    const moderate = async (slug: string, hidden: boolean) => {
        if (!key) return;
        setBusy(slug);
        try {
            const res = await fetch('/api/admin/moderate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, slug, hidden }),
            });
            if (res.ok) {
                setRows((prev) => prev.map((r) => (r.slug === slug ? { ...r, is_hidden: hidden } : r)));
            }
        } catch { /* ignore */ } finally {
            setBusy(null);
        }
    };

    return (
        <div className="min-h-screen bg-paper text-ink px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <ShieldAlert size={20} className="text-brand-deep" />
                    <h1 className="font-display text-2xl font-extrabold">Reported campaigns</h1>
                </div>

                {loading && <div className="flex items-center gap-2 text-muted"><Loader2 size={18} className="animate-spin" /> Loading...</div>}

                {!loading && error && (
                    <div className="bg-cream border border-ink/10 rounded-2xl p-6 text-sm text-ink/70">{error}</div>
                )}

                {!loading && !error && rows.length === 0 && (
                    <div className="bg-cream border border-ink/10 rounded-2xl p-6 text-sm text-ink/70">No reports. All clear.</div>
                )}

                {!loading && rows.length > 0 && (
                    <div className="space-y-3">
                        {rows.map((r) => (
                            <div key={r.slug} className={`bg-cream border rounded-2xl p-4 ${r.is_hidden ? 'border-coral/40' : 'border-ink/10'}`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-display font-bold truncate">{r.title}</p>
                                            {r.is_hidden && <span className="text-[10px] font-bold uppercase tracking-wide bg-coral text-white px-2 py-0.5 rounded-full">Hidden</span>}
                                        </div>
                                        <p className="text-xs text-muted mt-0.5">
                                            {r.report_count} report{r.report_count === 1 ? '' : 's'} · {r.supporter_count} supporters · {r.view_count} views
                                        </p>
                                        {r.reasons && r.reasons.length > 0 && (
                                            <ul className="mt-2 space-y-1">
                                                {r.reasons.slice(0, 5).map((reason, i) => (
                                                    <li key={i} className="text-xs text-ink/70">&ldquo;{reason}&rdquo;</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <a href={`/c/${r.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-brand-deep flex items-center gap-1 hover:underline">
                                            <ExternalLink size={13} /> View
                                        </a>
                                        {r.is_hidden ? (
                                            <button onClick={() => moderate(r.slug, false)} disabled={busy === r.slug}
                                                className="text-xs font-bold flex items-center gap-1.5 bg-paper border border-ink/10 rounded-lg px-3 py-1.5 hover:bg-ink/5 transition-colors disabled:opacity-50">
                                                {busy === r.slug ? <Loader2 size={13} className="animate-spin" /> : <Eye size={13} />} Unhide
                                            </button>
                                        ) : (
                                            <button onClick={() => moderate(r.slug, true)} disabled={busy === r.slug}
                                                className="text-xs font-bold flex items-center gap-1.5 bg-coral text-white rounded-lg px-3 py-1.5 hover:brightness-105 transition-all disabled:opacity-50">
                                                {busy === r.slug ? <Loader2 size={13} className="animate-spin" /> : <EyeOff size={13} />} Hide
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
