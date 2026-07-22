"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { QRCode } from '@/components/QRCode';
import { BarChart3, Users, Eye, Copy, Check, Loader2, Save, ExternalLink, QrCode, ShieldCheck } from 'lucide-react';

interface ManageData {
    slug: string;
    title: string;
    description: string | null;
    supporter_count: number;
    view_count: number;
    goal: number | null;
    created_at: string;
    daily?: { day: string; n: number }[];
}

export const ManageClient: React.FC<{ slug: string }> = ({ slug }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ManageData | null>(null);
    const [currentSlug, setCurrentSlug] = useState(slug);

    // edit fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [goalInput, setGoalInput] = useState('');
    const [slugInput, setSlugInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState<string | null>(null);
    const [saveErr, setSaveErr] = useState<string | null>(null);

    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ollabs.studio';
    const shareUrl = `${origin}/c/${currentSlug}`;

    useEffect(() => {
        const k = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('k') : null;
        setToken(k);
        if (!k) {
            setError('This page needs your private manage key. Use the link you saved when you created the campaign.');
            setLoading(false);
            return;
        }
        fetch(`/api/campaigns/${slug}/manage?token=${encodeURIComponent(k)}`)
            .then(async (r) => {
                if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Could not load this campaign');
                return r.json();
            })
            .then((d: ManageData) => {
                setData(d);
                setCurrentSlug(d.slug);
                setTitle(d.title);
                setDescription(d.description || '');
                setGoalInput(d.goal != null ? String(d.goal) : '');
                setSlugInput(d.slug);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [slug]);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { /* ignore */ }
    };

    const save = async () => {
        if (!token) return;
        setSaving(true);
        setSaveMsg(null);
        setSaveErr(null);
        const payload: Record<string, string> = { token, title, description, goal: goalInput };
        if (slugInput && slugInput !== currentSlug) payload.slug = slugInput;
        try {
            const res = await fetch(`/api/campaigns/${currentSlug}/manage`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
                setSaveErr(body.error || 'Could not save');
            } else {
                setSaveMsg('Saved');
                if (body.slug && body.slug !== currentSlug) {
                    setCurrentSlug(body.slug);
                    setSlugInput(body.slug);
                    // keep the browser on a valid manage URL for the new slug
                    window.history.replaceState(null, '', `/c/${body.slug}/manage?k=${token}`);
                }
                setTimeout(() => setSaveMsg(null), 2000);
            }
        } catch {
            setSaveErr('Could not save');
        } finally {
            setSaving(false);
        }
    };

    const conversion = data && data.view_count > 0
        ? Math.round((data.supporter_count / data.view_count) * 100)
        : null;

    const series = useMemo(() => {
        const map = new Map((data?.daily || []).map((d) => [d.day, d.n]));
        const out: { key: string; label: string; n: number }[] = [];
        const now = new Date();
        for (let i = 13; i >= 0; i--) {
            const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
            const key = d.toISOString().slice(0, 10);
            out.push({ key, label: d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }), n: map.get(key) || 0 });
        }
        return out;
    }, [data]);

    const seriesMax = Math.max(1, ...series.map((s) => s.n));
    const seriesTotal = series.reduce((a, s) => a + s.n, 0);

    return (
        <div className="min-h-screen bg-paper text-ink flex flex-col items-center px-4 py-8">
            <a href="/" className="mb-6"><img src="/Ollabs Logo Black.png" alt="Ollabs" className="h-7 w-auto" /></a>

            <div className="w-full max-w-lg">
                <div className="flex items-center gap-2 mb-1">
                    <BarChart3 size={18} className="text-brand-deep" />
                    <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted">Campaign dashboard</p>
                </div>

                {loading && (
                    <div className="flex items-center gap-2 text-muted mt-8"><Loader2 size={18} className="animate-spin" /> Loading your stats...</div>
                )}

                {!loading && error && (
                    <div className="mt-6 bg-cream border border-ink/10 rounded-2xl p-6 text-center">
                        <p className="font-display font-bold text-lg mb-1">Can&apos;t open this dashboard</p>
                        <p className="text-sm text-ink/70">{error}</p>
                    </div>
                )}

                {!loading && data && (
                    <>
                        <h1 className="font-display text-3xl font-extrabold mt-1 mb-6">{data.title}</h1>

                        {/* Real stats */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-cream border border-ink/10 rounded-2xl p-4 text-center">
                                <Eye size={16} className="text-muted mx-auto mb-1" />
                                <div className="font-display text-2xl font-extrabold">{data.view_count.toLocaleString()}</div>
                                <p className="text-[11px] text-muted mt-0.5">Views</p>
                            </div>
                            <div className="bg-cream border border-ink/10 rounded-2xl p-4 text-center">
                                <Users size={16} className="text-muted mx-auto mb-1" />
                                <div className="font-display text-2xl font-extrabold">{data.supporter_count.toLocaleString()}</div>
                                <p className="text-[11px] text-muted mt-0.5">Supporters</p>
                            </div>
                            <div className="bg-cream border border-ink/10 rounded-2xl p-4 text-center">
                                <BarChart3 size={16} className="text-muted mx-auto mb-1" />
                                <div className="font-display text-2xl font-extrabold">{conversion === null ? '0%' : `${conversion}%`}</div>
                                <p className="text-[11px] text-muted mt-0.5">Conversion</p>
                            </div>
                        </div>

                        {/* Supporters over time */}
                        <div className="bg-cream border border-ink/10 rounded-2xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">New supporters, last 14 days</p>
                                <span className="text-xs font-semibold text-ink">{seriesTotal.toLocaleString()} total</span>
                            </div>
                            {seriesTotal === 0 ? (
                                <p className="text-sm text-muted py-4 text-center">No supporters yet in this window. Share your link to get started.</p>
                            ) : (
                                <>
                                    <div className="flex items-end gap-1.5 h-24">
                                        {series.map((s) => (
                                            <div key={s.key} className="flex-1 flex flex-col justify-end" title={`${s.label}: ${s.n}`}>
                                                <div
                                                    className="w-full rounded-t bg-brand"
                                                    style={{ height: `${Math.max(3, Math.round((s.n / seriesMax) * 100))}%` }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-1.5 text-[10px] text-muted">
                                        <span>{series[0].label}</span>
                                        <span>{series[series.length - 1].label}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Share */}
                        <div className="bg-cream border border-ink/10 rounded-2xl p-4 mb-6 space-y-3">
                            <p className="text-xs font-bold text-muted uppercase tracking-wider">Share link</p>
                            <div className="bg-paper border border-ink/10 rounded-xl px-3 py-2.5 flex items-center gap-2">
                                <span className="text-sm text-ink truncate flex-1">{shareUrl}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={copyLink} className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-brand text-ink hover:brightness-105 transition-all">
                                    {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}
                                </button>
                                <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="py-2.5 px-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-paper border border-ink/10 hover:bg-ink/5 text-ink transition-colors">
                                    <ExternalLink size={15} /> Open
                                </a>
                                <button onClick={() => setShowQR((v) => !v)} className="py-2.5 px-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-paper border border-ink/10 hover:bg-ink/5 text-ink transition-colors">
                                    <QrCode size={15} /> QR
                                </button>
                            </div>
                            {showQR && (
                                <div className="flex flex-col items-center gap-2 pt-1">
                                    <QRCode value={shareUrl} size={180} className="border border-ink/10" />
                                    <p className="text-[11px] text-muted">Scan to open, or screenshot to print</p>
                                </div>
                            )}
                        </div>

                        {/* Edit */}
                        <div className="bg-cream border border-ink/10 rounded-2xl p-4 space-y-4">
                            <p className="text-xs font-bold text-muted uppercase tracking-wider">Edit campaign</p>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-ink/70">Title</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-paper border border-ink/10 rounded-xl px-3 py-2.5 text-ink focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-ink/70">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-paper border border-ink/10 rounded-xl px-3 py-2.5 text-ink focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all min-h-[70px] resize-none" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-ink/70">Supporter goal</label>
                                <input type="number" min={1} inputMode="numeric" value={goalInput} onChange={(e) => setGoalInput(e.target.value)}
                                    placeholder="No goal set"
                                    className="w-full bg-paper border border-ink/10 rounded-xl px-3 py-2.5 text-ink placeholder-muted focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all" />
                                <p className="text-[11px] text-muted">Shows a progress bar on your campaign page. Leave blank for none.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-ink/70">Custom link</label>
                                <div className="flex items-center bg-paper border border-ink/10 rounded-xl px-3 focus-within:ring-2 focus-within:ring-brand/50 focus-within:border-brand transition-all">
                                    <span className="text-sm text-muted whitespace-nowrap">ollabs.studio/c/</span>
                                    <input value={slugInput} onChange={(e) => setSlugInput(e.target.value)}
                                        className="flex-1 bg-transparent py-2.5 text-ink outline-none min-w-0" />
                                </div>
                                <p className="text-[11px] text-muted">Letters and numbers become dashes. Changing this updates your share link.</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={save} disabled={saving}
                                    className="py-2.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-ink text-paper hover:brightness-125 transition-all disabled:opacity-50">
                                    {saving ? <Loader2 size={15} className="animate-spin" /> : <><Save size={15} /> Save changes</>}
                                </button>
                                {saveMsg && <span className="text-sm text-brand-deep font-semibold flex items-center gap-1"><Check size={15} /> {saveMsg}</span>}
                                {saveErr && <span className="text-sm text-coral font-semibold">{saveErr}</span>}
                            </div>
                        </div>

                        <div className="mt-6 flex items-start gap-2 text-xs text-muted">
                            <ShieldCheck size={14} className="text-brand-deep mt-0.5 shrink-0" />
                            <p>This dashboard is private to whoever has this link. Bookmark it, and do not share the part after <span className="font-mono">?k=</span>.</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
