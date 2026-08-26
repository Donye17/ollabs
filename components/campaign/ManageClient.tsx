"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { QRCode } from '@/components/QRCode';
import { CATEGORIES } from '@/lib/categories';
import { organizerShareText, whatsappUrl } from '@/lib/share';
import { track, withUtm } from '@/lib/analytics';
import { WhatsAppGlyph, WHATSAPP_GREEN } from '@/components/ShareGlyphs';
import { BarChart3, Users, Eye, Copy, Check, Loader2, Save, ExternalLink, QrCode, ShieldCheck, Palette, Globe } from 'lucide-react';
import { countryLabel } from '@/lib/geo';
import { ORGANIZER_PRIMARY_BTN, PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

interface ManageData {
    slug: string;
    title: string;
    description: string | null;
    supporter_count: number;
    view_count: number;
    goal: number | null;
    category: string | null;
    preview_url: string | null;
    created_at: string;
    daily?: { day: string; n: number }[];
    countries?: { country: string; n: number }[];
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
    const [categoryInput, setCategoryInput] = useState('');
    const [slugInput, setSlugInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState<string | null>(null);
    const [saveErr, setSaveErr] = useState<string | null>(null);

    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ollabs.studio';
    const shareUrl = `${origin}/c/${currentSlug}`;

    useEffect(() => {
        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const fromUrl = params?.get('k') || null;
        const storageKey = `ollabs_manage_k:${slug}`;
        let k = fromUrl;
        if (!k) {
            try {
                k = sessionStorage.getItem(storageKey);
            } catch { /* private mode */ }
        }
        setToken(k);
        const url = k
            ? `/api/campaigns/${slug}/manage?token=${encodeURIComponent(k)}`
            : `/api/campaigns/${slug}/manage`;
        fetch(url, { credentials: 'include' })
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
                setCategoryInput(d.category || '');
                setSlugInput(d.slug);
                if (k) {
                    try {
                        sessionStorage.setItem(storageKey, k);
                    } catch { /* ignore */ }
                    // Drop k= from the address bar once the manage cookie is set,
                    // so refreshes and screenshots do not keep leaking the key.
                    if (fromUrl) {
                        window.history.replaceState(null, '', `/c/${d.slug}/manage`);
                    }
                }
            })
            .catch((e) => setError(
                e.message ||
                'This page needs your private manage key. Use the link you saved when you created the campaign.'
            ))
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
        setSaving(true);
        setSaveMsg(null);
        setSaveErr(null);
        const payload: Record<string, string> = { title, description, goal: goalInput, category: categoryInput };
        if (token) payload.token = token;
        if (slugInput && slugInput !== currentSlug) payload.slug = slugInput;
        try {
            const res = await fetch(`/api/campaigns/${currentSlug}/manage`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
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
                    window.history.replaceState(null, '', `/c/${body.slug}/manage`);
                    if (token) {
                        try {
                            sessionStorage.setItem(`ollabs_manage_k:${body.slug}`, token);
                            sessionStorage.removeItem(`ollabs_manage_k:${currentSlug}`);
                        } catch { /* ignore */ }
                    }
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
        <div className={`flex flex-col items-center px-4 pb-8 sm:px-6 ${PAGE_TOP_UNDER_NAV}`}>
            <div className="w-full max-w-lg lg:max-w-3xl">
                <p className="text-sm font-semibold text-muted mb-1">Campaign</p>

                {loading && (
                    <div className="flex items-center gap-2 text-muted mt-8"><Loader2 size={18} className="animate-spin" /> Loading your stats...</div>
                )}

                {!loading && error && (
                    <div className="mt-6 border-y border-ink/10 py-8 text-center">
                        <p className="font-display font-bold text-lg mb-1">Can&apos;t open this dashboard</p>
                        <p className="text-sm text-ink/70">{error}</p>
                    </div>
                )}

                {!loading && data && (
                    <>
                        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-0.5 mb-5">{data.title}</h1>

                        {/* Share sits with the title so desktop reads as one document, not a card stack. */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pb-5 mb-2 border-b border-ink/10">
                            <p className="text-sm text-ink truncate flex-1 min-w-0 font-medium">{shareUrl}</p>
                            <div className="flex items-center gap-2 shrink-0">
                                <a
                                    href={whatsappUrl(organizerShareText(title || data.title), withUtm(shareUrl, 'whatsapp'))}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => track('campaign_share', { campaign: currentSlug, method: 'whatsapp', from: 'manage' })}
                                    className="min-h-10 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 text-white hover:brightness-105 transition-all"
                                    style={{ backgroundColor: WHATSAPP_GREEN }}
                                >
                                    <WhatsAppGlyph size={15} /> WhatsApp
                                </a>
                                <button
                                    type="button"
                                    onClick={copyLink}
                                    className="min-h-10 px-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 border border-ink/15 bg-cream hover:bg-ink/5 text-ink transition-colors"
                                >
                                    {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}
                                </button>
                                <a
                                    href={shareUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="min-h-10 w-10 rounded-xl border border-ink/15 bg-cream flex items-center justify-center hover:bg-ink/5 transition-colors"
                                    aria-label="Open campaign"
                                >
                                    <ExternalLink size={15} />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setShowQR((v) => !v)}
                                    className="min-h-10 w-10 rounded-xl border border-ink/15 bg-cream flex items-center justify-center hover:bg-ink/5 transition-colors"
                                    aria-label="Show QR code"
                                >
                                    <QrCode size={15} />
                                </button>
                            </div>
                        </div>
                        {showQR && (
                            <div className="flex flex-col items-center gap-2 py-4 mb-2 border-b border-ink/10">
                                <QRCode value={shareUrl} size={180} className="border border-ink/10" />
                                <p className="text-xs text-muted">Scan to open, or screenshot to print</p>
                            </div>
                        )}

                        <a
                            href="/hub"
                            className="mb-6 flex items-center justify-between gap-3 py-3 border-b border-ink/10 hover:text-brand-deep transition-colors"
                        >
                            <div className="min-w-0">
                                <p className="font-semibold text-[15px]">Campaign hub</p>
                                <p className="text-xs text-ink/70">
                                    Bio, Join button, and other links at /u/…
                                </p>
                            </div>
                            <span className="text-sm font-bold text-brand-deep shrink-0">Set up</span>
                        </a>

                        {data.supporter_count === 0 && (
                            <div className="mb-6 rounded-xl border border-coral/30 bg-coral/10 p-4 space-y-3">
                                <p className="font-display font-bold text-ink">No supporters yet. Share now.</p>
                                <p className="text-sm text-ink/75 leading-relaxed">
                                    Most campaigns that take off get their first person in the first hour. Open WhatsApp and send the link to one group.
                                </p>
                                <a
                                    href={whatsappUrl(organizerShareText(title || data.title), withUtm(shareUrl, 'whatsapp'))}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => track('campaign_share', { campaign: currentSlug, method: 'whatsapp', from: 'manage_zero_nudge' })}
                                    className="w-full min-h-[48px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white hover:brightness-105 transition-all"
                                    style={{ backgroundColor: WHATSAPP_GREEN }}
                                >
                                    <WhatsAppGlyph size={16} /> Share on WhatsApp
                                </a>
                            </div>
                        )}

                        <dl className="mb-8 divide-y divide-ink/10 border-y border-ink/10">
                            <div className="flex items-center justify-between gap-4 py-3.5">
                                <dt className="text-sm text-muted flex items-center gap-2"><Eye size={15} /> Views</dt>
                                <dd className="font-display text-2xl font-bold tabular-nums">{(data.view_count ?? 0).toLocaleString()}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-4 py-3.5">
                                <dt className="text-sm text-muted flex items-center gap-2"><Users size={15} /> Supporters</dt>
                                <dd className="font-display text-2xl font-bold tabular-nums">{(data.supporter_count ?? 0).toLocaleString()}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-4 py-3.5">
                                <dt className="text-sm text-muted flex items-center gap-2"><BarChart3 size={15} /> Conversion</dt>
                                <dd className="font-display text-2xl font-bold tabular-nums">{conversion === null ? '0%' : `${conversion}%`}</dd>
                            </div>
                        </dl>

                        <section className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-semibold text-muted">New supporters, last 14 days</h2>
                                <span className="text-xs font-semibold text-ink">{seriesTotal.toLocaleString()} total</span>
                            </div>
                            {seriesTotal === 0 ? (
                                <p className="text-sm text-muted py-6 text-center border border-dashed border-ink/15 rounded-xl">
                                    No supporters yet in this window. Share your link to get started.
                                </p>
                            ) : (
                                <>
                                    <div className="flex items-end gap-1.5 h-28">
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
                        </section>

                        {data.countries && data.countries.length > 0 && (
                            <section className="mb-8">
                                <h2 className="text-sm font-semibold text-muted mb-3 flex items-center gap-2">
                                    <Globe size={14} /> Supporters by country
                                </h2>
                                <ul className="space-y-2.5">
                                    {data.countries.map((c) => {
                                        const max = data.countries![0].n || 1;
                                        const label = countryLabel(c.country) || c.country;
                                        return (
                                            <li key={c.country} className="flex items-center gap-3">
                                                <span className="text-sm font-medium w-28 truncate">{label}</span>
                                                <div className="flex-1 h-1.5 rounded-full bg-ink/10 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-brand"
                                                        style={{ width: `${Math.max(8, Math.round((c.n / max) * 100))}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-bold tabular-nums w-8 text-right">{c.n}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        )}

                        {/* Frame. The API has always accepted a new frame_config, but until
                            this there was no way to send one, so organizers who disliked their
                            frame built an entire second campaign and left the first one and its
                            supporters behind. */}
                        <section className="mb-8 pb-8 border-b border-ink/10 space-y-3">
                            <h2 className="text-sm font-semibold text-muted">Frame</h2>
                            <div className="flex items-center gap-4">
                                {data.preview_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={data.preview_url}
                                        alt=""
                                        className="w-16 h-16 rounded-full object-cover border border-ink/10 shrink-0"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-cream border border-ink/10 shrink-0" />
                                )}
                                <p className="text-sm text-ink/70 flex-1 leading-relaxed">
                                    Change the design without starting over. Your link, your supporter count, and
                                    everyone who already has the link stay exactly as they are.
                                </p>
                            </div>
                            <a
                                href={`/create?edit=${encodeURIComponent(currentSlug)}&k=${encodeURIComponent(token || '')}`}
                                className={`inline-flex items-center justify-center gap-2 px-5 ${ORGANIZER_PRIMARY_BTN}`}
                            >
                                <Palette size={15} /> Change the frame
                            </a>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-sm font-semibold text-muted">Campaign details</h2>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-ink/70">Title</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-cream border border-ink/10 rounded-xl px-3 py-2.5 text-ink focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-ink/70">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-cream border border-ink/10 rounded-xl px-3 py-2.5 text-ink focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all min-h-[70px] resize-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-ink/70">Supporter goal</label>
                                    <input type="number" min={1} inputMode="numeric" value={goalInput} onChange={(e) => setGoalInput(e.target.value)}
                                        placeholder="No goal"
                                        className="w-full bg-cream border border-ink/10 rounded-xl px-3 py-2.5 text-ink placeholder-muted focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-ink/70">Category</label>
                                    <select value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)}
                                        className="w-full bg-cream border border-ink/10 rounded-xl px-3 py-2.5 text-ink focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all">
                                        <option value="">None</option>
                                        {CATEGORIES.map((c) => (
                                            <option key={c.key} value={c.key}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-ink/70">Custom link</label>
                                <div className="flex items-center bg-cream border border-ink/10 rounded-xl px-3 focus-within:ring-2 focus-within:ring-brand/50 focus-within:border-brand transition-all">
                                    <span className="text-sm text-muted whitespace-nowrap">ollabs.studio/c/</span>
                                    <input value={slugInput} onChange={(e) => setSlugInput(e.target.value)}
                                        className="flex-1 bg-transparent py-2.5 text-ink outline-none min-w-0" />
                                </div>
                                <p className="text-xs text-muted">
                                    Letters and numbers become dashes. Changing this updates your share link;
                                    older links redirect automatically so WhatsApp shares keep working.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={save} disabled={saving}
                                    className={`flex items-center justify-center gap-2 px-5 ${ORGANIZER_PRIMARY_BTN}`}>
                                    {saving ? <Loader2 size={15} className="animate-spin" /> : <><Save size={15} /> Save changes</>}
                                </button>
                                {saveMsg && <span className="text-sm text-brand-deep font-semibold flex items-center gap-1"><Check size={15} /> {saveMsg}</span>}
                                {saveErr && (
                                    <span role="alert" className="text-sm text-coral bg-coral/10 border border-coral/25 rounded-lg px-2.5 py-1.5 font-semibold">
                                        {saveErr}
                                    </span>
                                )}
                            </div>
                        </section>

                        <div className="mt-8 flex items-start gap-2 text-xs text-muted">
                            <ShieldCheck size={14} className="text-brand-deep mt-0.5 shrink-0" />
                            <p>This dashboard is private to whoever has this link. Bookmark it, and do not share the part after <span className="font-mono">?k=</span>.</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
