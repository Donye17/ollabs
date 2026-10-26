'use client';

import React, { useEffect, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { downloadBlob } from '@/lib/download';
import { formatCount } from '@/lib/i18n/locale';
import { ACCENT_BG, ACCENT_IDS, type AccentId, type ReferrerBucket } from '@/lib/campaignBrand';

type Row = {
    slug: string;
    title: string;
    owner_token: string;
    supporter_count: number | null;
    share_count: number;
    cta_taps: number;
    referrers: Record<ReferrerBucket, number>;
    accent_color: string | null;
    logo_url: string | null;
};

export function HubGrowthPanel() {
    const { locale, messages } = useLocale();
    const t = messages.growth;
    const [rows, setRows] = useState<Row[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState<string | null>(null);
    const [saved, setSaved] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/organizer/campaigns')
            .then(async (res) => {
                if (res.status === 401) return null;
                if (!res.ok) throw new Error('load');
                return res.json();
            })
            .then((body) => {
                if (cancelled || !body) return;
                setRows(Array.isArray(body.campaigns) ? body.campaigns : []);
            })
            .catch(() => {
                if (!cancelled) setError(t.error);
            });
        return () => {
            cancelled = true;
        };
    }, [t.error]);

    if (rows === null && !error) return null;
    if (error && !rows) {
        return <p role="alert" className="text-sm text-coral bg-coral/10 border border-coral/25 rounded-xl px-3 py-2">{error}</p>;
    }
    if (!rows) return null;

    const patch = async (row: Row, body: { accent?: string | null; logoUrl?: string | null }) => {
        setBusy(row.slug);
        setError(null);
        try {
            const res = await fetch(`/api/campaigns/${row.slug}/manage`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: row.owner_token, ...body }),
            });
            if (!res.ok) {
                setError(t.error);
                return;
            }
            setRows((prev) => (prev || []).map((r) => r.slug === row.slug ? {
                ...r,
                accent_color: 'accent' in body ? (body.accent ?? null) : r.accent_color,
                logo_url: 'logoUrl' in body ? (body.logoUrl ?? null) : r.logo_url,
            } : r));
            setSaved(row.slug);
            setTimeout(() => setSaved((s) => (s === row.slug ? null : s)), 1500);
        } catch {
            setError(t.error);
        } finally {
            setBusy(null);
        }
    };

    const onLogo = async (row: Row, file: File | undefined) => {
        if (!file) return;
        setBusy(row.slug);
        setError(null);
        try {
            const blob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });
            await patch(row, { logoUrl: blob.url });
        } catch {
            setError(t.error);
            setBusy(null);
        }
    };

    const exportCsv = async () => {
        setError(null);
        try {
            const res = await fetch('/api/organizer/campaigns/export');
            if (!res.ok) {
                setError(t.error);
                return;
            }
            downloadBlob(await res.blob(), 'ollabs-campaigns.csv');
        } catch {
            setError(t.error);
        }
    };

    const stat = (label: string, n: number) => (
        <div className="min-w-0">
            <p className="text-[11px] text-muted">{label}</p>
            <p className="font-display text-lg font-bold tabular-nums">{formatCount(n, locale)}</p>
        </div>
    );

    return (
        <section className="rounded-2xl border border-ink/10 bg-cream px-4 py-4 space-y-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="font-display text-xl font-extrabold">{t.title}</h2>
                    <p className="mt-1 text-sm text-ink/75">{t.lede}</p>
                </div>
                <button
                    type="button"
                    onClick={() => { void exportCsv(); }}
                    className="shrink-0 inline-flex min-h-[44px] items-center rounded-xl border border-ink/15 bg-paper px-3 text-sm font-semibold"
                >
                    {t.export}
                </button>
            </div>
            {error && <p role="alert" className="text-sm text-coral">{error}</p>}
            {rows.length === 0 && <p className="text-sm text-ink/75">{t.empty}</p>}
            <ul className="space-y-3">
                {rows.map((row) => (
                    <li key={row.slug} className="rounded-xl border border-ink/10 bg-paper px-3 py-3 space-y-3">
                        <p className="font-semibold leading-snug">{row.title}</p>
                        <div className="grid grid-cols-3 gap-2">
                            {stat(t.supporters, row.supporter_count ?? 0)}
                            {stat(t.shares, row.share_count ?? 0)}
                            {stat(t.taps, row.cta_taps ?? 0)}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p>{t.whatsapp}: {formatCount(row.referrers?.whatsapp ?? 0, locale)}</p>
                            <p>{t.instagram}: {formatCount(row.referrers?.instagram ?? 0, locale)}</p>
                            <p>{t.facebook}: {formatCount(row.referrers?.facebook ?? 0, locale)}</p>
                            <p>{t.direct}: {formatCount(row.referrers?.direct ?? 0, locale)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted mb-2">{t.accent}</p>
                            <div className="flex flex-wrap gap-2">
                                {ACCENT_IDS.map((id) => (
                                    <button
                                        key={id}
                                        type="button"
                                        aria-label={id}
                                        aria-pressed={row.accent_color === id}
                                        disabled={busy === row.slug}
                                        onClick={() => { void patch(row, { accent: id as AccentId }); }}
                                        className={`h-11 w-11 rounded-full border-2 ${ACCENT_BG[id]} ${row.accent_color === id ? 'border-ink' : 'border-transparent'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted">
                                {t.logo}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="mt-1 block w-full min-h-[44px] text-sm"
                                    disabled={busy === row.slug}
                                    onChange={(e) => { void onLogo(row, e.target.files?.[0]); }}
                                />
                            </label>
                            <p className="mt-1 text-xs text-muted">{t.logoHint}</p>
                            {row.logo_url && (
                                <div
                                    role="img"
                                    aria-label={row.title}
                                    className="mt-2 h-10 w-10 rounded-full bg-contain bg-center bg-no-repeat border border-ink/10"
                                    style={{ backgroundImage: `url("${row.logo_url.replace(/"/g, '')}")` }}
                                />
                            )}
                        </div>
                        {busy === row.slug && <Loader2 size={16} className="animate-spin text-muted" />}
                        {saved === row.slug && <p className="text-sm text-brand-deep">{t.saved}</p>}
                    </li>
                ))}
            </ul>
        </section>
    );
}
