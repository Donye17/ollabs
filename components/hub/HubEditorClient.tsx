"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { HubMadeWithFooter } from '@/components/hub/HubMadeWithFooter';
import { upload } from '@vercel/blob/client';
import {
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Eye,
    EyeOff,
    GripVertical,
    Loader2,
    LogIn,
    Plus,
    Save,
    Trash2,
    Upload,
} from 'lucide-react';
import {
    HUB_BIO_MAX,
    HUB_DISPLAY_NAME_MAX,
    HUB_LINKS_MAX,
    handleError,
    normalizeHandle,
    suggestHandleFromEmail,
} from '@/lib/hub';
import { ABOVE_MOBILE_NAV } from '@/lib/mobileNav';
import { track, withUtm } from '@/lib/analytics';
import { hubShareText, whatsappUrl } from '@/lib/share';
import { WhatsAppGlyph, WHATSAPP_GREEN } from '@/components/ShareGlyphs';
import { HUB_THEME_IDS, HUB_THEMES, type HubThemeId } from '@/lib/hubThemes';

type CampaignOpt = {
    id: string;
    slug: string;
    title: string;
    supporter_count: number | null;
    preview_url: string | null;
};

type LinkDraft = { key: string; title: string; url: string; clickCount?: number };

type HubPayload = {
    email: string;
    handle: string | null;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    featuredCampaignId: string | null;
    hubTheme?: string;
    hiddenCampaignIds?: string[];
    supportClickCount?: number;
    upgradeInterested?: boolean;
    campaigns: CampaignOpt[];
    links: { id: string; title: string; url: string; clickCount?: number }[];
};

function newKey() {
    return `l-${Math.random().toString(36).slice(2, 9)}`;
}

export const HubEditorClient: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [signedIn, setSignedIn] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveMsg, setSaveMsg] = useState<string | null>(null);

    const [handle, setHandle] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [featuredId, setFeaturedId] = useState('');
    const [hubTheme, setHubTheme] = useState<HubThemeId>('default');
    const [hiddenIds, setHiddenIds] = useState<string[]>([]);
    const [supportClicks, setSupportClicks] = useState(0);
    const [upgradeInterested, setUpgradeInterested] = useState(false);
    const [upgradeBusy, setUpgradeBusy] = useState(false);
    const [campaigns, setCampaigns] = useState<CampaignOpt[]>([]);
    const [links, setLinks] = useState<LinkDraft[]>([]);
    const [publishedHandle, setPublishedHandle] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/organizer/hub');
            if (res.status === 401) {
                setSignedIn(false);
                return;
            }
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                setError(body.error || 'Could not load your hub.');
                setSignedIn(true);
                return;
            }
            const data = (await res.json()) as HubPayload;
            setSignedIn(true);
            let nextHandle = data.handle || '';
            if (!nextHandle) {
                try {
                    const suggest = new URLSearchParams(window.location.search).get('suggest');
                    if (suggest) nextHandle = normalizeHandle(suggest);
                    else if (data.email) nextHandle = suggestHandleFromEmail(data.email);
                } catch { /* ignore */ }
            }
            setHandle(nextHandle);
            setPublishedHandle(data.handle);
            setDisplayName(data.displayName || '');
            setBio(data.bio || '');
            setAvatarUrl(data.avatarUrl);
            setFeaturedId(data.featuredCampaignId || data.campaigns[0]?.id || '');
            setHubTheme(
                data.hubTheme && data.hubTheme in HUB_THEMES
                    ? (data.hubTheme as HubThemeId)
                    : 'default'
            );
            setHiddenIds(Array.isArray(data.hiddenCampaignIds) ? data.hiddenCampaignIds : []);
            setSupportClicks(Number(data.supportClickCount) || 0);
            setUpgradeInterested(!!data.upgradeInterested);
            setCampaigns(data.campaigns || []);
            setLinks(
                (data.links || []).map((l) => ({
                    key: l.id,
                    title: l.title,
                    url: l.url,
                    clickCount: l.clickCount || 0,
                }))
            );
        } catch {
            setError('Could not reach the server.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const onAvatar = async (file: File | null) => {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const blob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });
            setAvatarUrl(blob.url);
        } catch {
            setError('Could not upload that image.');
        } finally {
            setUploading(false);
        }
    };

    const save = async () => {
        if (saving) return;
        const normalized = normalizeHandle(handle);
        const herr = handleError(normalized);
        if (herr) {
            setError(herr);
            return;
        }

        setSaving(true);
        setError(null);
        setSaveMsg(null);
        try {
            const res = await fetch('/api/organizer/hub', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    handle: normalized,
                    displayName: displayName.trim() || null,
                    bio: bio.trim() || null,
                    avatarUrl,
                    featuredCampaignId: featuredId || null,
                    hubTheme,
                    hiddenCampaignIds: hiddenIds,
                    links: links.map((l) => ({ title: l.title, url: l.url })),
                }),
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(body.error || 'Could not save.');
                return;
            }
            const firstClaim = !publishedHandle && Boolean(body.handle || normalized);
            setPublishedHandle(body.handle);
            setHandle(body.handle || normalized);
            if (typeof body.supportClickCount === 'number') setSupportClicks(body.supportClickCount);
            if (Array.isArray(body.links)) {
                setLinks(
                    body.links.map((l: { id: string; title: string; url: string; clickCount?: number }) => ({
                        key: l.id,
                        title: l.title,
                        url: l.url,
                        clickCount: l.clickCount || 0,
                    }))
                );
            }
            track('hub_saved', {
                has_avatar: Boolean(avatarUrl),
                has_bio: Boolean(bio.trim()),
                link_count: links.length,
                has_featured_campaign: Boolean(featuredId),
            });
            setSaveMsg('Saved');
            if (firstClaim) track('hub_claimed', { handle: body.handle || normalized });
            setTimeout(() => setSaveMsg(null), 2000);
        } catch {
            setError('Could not reach the server.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-2 text-muted py-16">
                <Loader2 size={18} className="animate-spin" /> Loading your hub...
            </div>
        );
    }

    if (!signedIn) {
        return (
            <div className="bg-cream border border-ink/10 rounded-2xl p-8 text-center max-w-md mx-auto">
                <LogIn className="w-8 h-8 text-brand-deep mx-auto mb-3" />
                <p className="font-display font-bold text-lg mb-2">Sign in to claim your hub</p>
                <p className="text-sm text-ink/70 mb-6">
                    Creating a campaign never needs an account. A hub does, so your
                    page has a stable owner and survives device switches.
                </p>
                <Link
                    href="/login?next=/hub"
                    className="inline-flex h-11 px-6 rounded-xl bg-brand text-ink font-bold items-center hover:brightness-105 transition-all"
                >
                    Sign in with a code
                </Link>
            </div>
        );
    }

    const previewPath = publishedHandle ? `/u/${publishedHandle}` : null;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ollabs.studio';
    const hubUrl = previewPath ? `${origin}${previewPath}` : null;

    return (
        <div className="max-w-lg mx-auto space-y-6 pb-[max(10rem,calc(6rem+env(safe-area-inset-bottom)))]">
            {previewPath && hubUrl && (
                <div className="rounded-2xl border border-brand/30 bg-brand/10 p-4 space-y-3">
                    <a
                        href={previewPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 text-sm font-semibold text-brand-deep"
                    >
                        <span className="truncate">{hubUrl}</span>
                        <ExternalLink size={16} className="shrink-0" />
                    </a>
                    <a
                        href={whatsappUrl(
                            hubShareText(displayName.trim() || publishedHandle || 'me'),
                            withUtm(hubUrl, 'whatsapp')
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            track('hub_share', { handle: publishedHandle || '', platform: 'whatsapp' });
                        }}
                        className="w-full min-h-[48px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white hover:brightness-105 transition-all"
                        style={{ backgroundColor: WHATSAPP_GREEN }}
                    >
                        <WhatsAppGlyph size={16} /> Share hub on WhatsApp
                    </a>
                    <p className="text-xs text-ink/70 text-center leading-relaxed">
                        Paste this in your Instagram or TikTok bio. The Support button opens your frame.
                    </p>
                </div>
            )}

            <section className="bg-cream border border-ink/10 rounded-2xl p-5 space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                        Your handle
                    </label>
                    <div className="flex items-center gap-0 rounded-xl border border-ink/15 bg-paper overflow-hidden focus-within:ring-2 focus-within:ring-brand">
                        <span className="pl-3.5 text-sm text-muted shrink-0">ollabs.studio/u/</span>
                        <input
                            value={handle}
                            onChange={(e) => setHandle(e.target.value.toLowerCase())}
                            placeholder="meu-candidato"
                            autoCapitalize="none"
                            autoCorrect="off"
                            className="flex-1 h-12 pr-3 bg-transparent text-ink font-semibold focus:outline-none min-w-0"
                        />
                    </div>
                    <p className="text-xs text-muted mt-2 leading-relaxed">
                        Letters, numbers, hyphens. This is your public home base. The Support
                        button on it opens your frame page.
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                        Display name
                    </label>
                    <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value.slice(0, HUB_DISPLAY_NAME_MAX))}
                        placeholder="Campaign or org name"
                        maxLength={HUB_DISPLAY_NAME_MAX}
                        className="w-full h-12 px-4 rounded-xl border border-ink/15 bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                        Bio
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value.slice(0, HUB_BIO_MAX))}
                        placeholder="One short line about the campaign"
                        rows={3}
                        maxLength={HUB_BIO_MAX}
                        className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                    />
                    <p className="text-xs text-muted text-right mt-1">{bio.length}/{HUB_BIO_MAX}</p>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                        Photo
                    </label>
                    <div className="flex items-center gap-4">
                        {avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover border border-ink/10" />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-brand/20 border border-ink/10" />
                        )}
                        <label className="inline-flex h-10 px-4 rounded-xl bg-paper border border-ink/15 text-sm font-bold items-center gap-2 cursor-pointer hover:bg-ink/5 transition-colors">
                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                            {uploading ? 'Uploading' : 'Upload'}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                disabled={uploading}
                                onChange={(e) => onAvatar(e.target.files?.[0] ?? null)}
                            />
                        </label>
                        {avatarUrl && (
                            <button
                                type="button"
                                onClick={() => setAvatarUrl(null)}
                                className="text-xs font-bold text-muted hover:text-coral"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <section className="bg-cream border border-ink/10 rounded-2xl p-5 space-y-3">
                <h2 className="font-display font-bold text-lg">Support button</h2>
                <p className="text-sm text-ink/70 leading-relaxed">
                    The big button on your hub opens this campaign&apos;s frame page. People never
                    upload a photo on the hub itself.
                </p>
                {campaigns.length === 0 ? (
                    <p className="text-sm text-muted">
                        No campaigns on this account yet.{' '}
                        <Link href="/create" className="text-brand-deep font-semibold hover:underline">
                            Create one
                        </Link>
                        .
                    </p>
                ) : (
                    <select
                        value={featuredId}
                        onChange={(e) => setFeaturedId(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-ink/15 bg-paper text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                        {campaigns.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.title} (/c/{c.slug})
                            </option>
                        ))}
                    </select>
                )}
                {supportClicks > 0 && (
                    <p className="text-xs text-muted">
                        Support taps: <span className="font-semibold text-ink">{supportClicks.toLocaleString()}</span>
                    </p>
                )}
            </section>

            {campaigns.length > 1 && (
                <section className="bg-cream border border-ink/10 rounded-2xl p-5 space-y-3">
                    <h2 className="font-display font-bold text-lg">More campaigns</h2>
                    <p className="text-sm text-ink/70">
                        Hide frames from the public list so Support plus one or two stay dominant.
                    </p>
                    <ul className="space-y-2">
                        {campaigns
                            .filter((c) => c.id !== featuredId)
                            .map((c) => {
                                const hidden = hiddenIds.includes(c.id);
                                return (
                                    <li
                                        key={c.id}
                                        className="flex items-center gap-3 rounded-xl border border-ink/10 bg-paper px-3 py-2.5"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold truncate">{c.title}</p>
                                            <p className="text-[11px] text-muted truncate">/c/{c.slug}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setHiddenIds((prev) =>
                                                    hidden
                                                        ? prev.filter((id) => id !== c.id)
                                                        : [...prev, c.id]
                                                )
                                            }
                                            className="inline-flex h-9 px-3 rounded-lg border border-ink/15 text-xs font-bold items-center gap-1.5 hover:bg-ink/5"
                                        >
                                            {hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                                            {hidden ? 'Show' : 'Hide'}
                                        </button>
                                    </li>
                                );
                            })}
                    </ul>
                </section>
            )}

            <section className="bg-cream border border-ink/10 rounded-2xl p-5 space-y-3">
                <h2 className="font-display font-bold text-lg">Theme</h2>
                <p className="text-sm text-ink/70">A few presets. Default matches the current look.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {HUB_THEME_IDS.map((id) => {
                        const t = HUB_THEMES[id];
                        const selected = hubTheme === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setHubTheme(id)}
                                className={`rounded-xl border p-3 text-left transition-all ${
                                    selected ? 'ring-2 ring-brand border-brand' : 'border-ink/15'
                                }`}
                                style={{ background: t.pageBg, color: t.pageFg }}
                            >
                                <span
                                    className="inline-block h-3 w-8 rounded-full mb-2"
                                    style={{ background: t.supportBg }}
                                />
                                <span className="block text-xs font-bold">{t.label}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="bg-cream border border-ink/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="font-display font-bold text-lg">Other links</h2>
                    <button
                        type="button"
                        disabled={links.length >= HUB_LINKS_MAX}
                        onClick={() => setLinks((prev) => [...prev, { key: newKey(), title: '', url: '' }])}
                        className="inline-flex h-9 px-3 rounded-lg bg-paper border border-ink/15 text-xs font-bold items-center gap-1.5 hover:bg-ink/5 disabled:opacity-50"
                    >
                        <Plus size={14} /> Add
                    </button>
                </div>
                <p className="text-sm text-ink/70">
                    Instagram, donate, press kit, or anything else in the campaign.
                </p>

                {links.length === 0 && (
                    <p className="text-sm text-muted py-2">No extra links yet.</p>
                )}

                <ul className="space-y-3">
                    {links.map((link, idx) => (
                        <li key={link.key} className="rounded-xl border border-ink/10 bg-paper p-3 space-y-2">
                            <div className="flex items-center gap-2 text-muted">
                                <GripVertical size={14} className="opacity-40" />
                                <span className="text-xs font-bold uppercase tracking-wider">Link {idx + 1}</span>
                                {(link.clickCount ?? 0) > 0 && (
                                    <span className="text-[11px] font-semibold text-ink/70">
                                        {link.clickCount} taps
                                    </span>
                                )}
                                <div className="ml-auto flex items-center gap-1">
                                    <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() =>
                                            setLinks((prev) => {
                                                if (idx === 0) return prev;
                                                const next = [...prev];
                                                [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                                                return next;
                                            })
                                        }
                                        className="p-1.5 rounded-lg hover:bg-ink/5 disabled:opacity-30"
                                        aria-label="Move up"
                                    >
                                        <ChevronUp size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={idx === links.length - 1}
                                        onClick={() =>
                                            setLinks((prev) => {
                                                if (idx >= prev.length - 1) return prev;
                                                const next = [...prev];
                                                [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                                                return next;
                                            })
                                        }
                                        className="p-1.5 rounded-lg hover:bg-ink/5 disabled:opacity-30"
                                        aria-label="Move down"
                                    >
                                        <ChevronDown size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLinks((prev) => prev.filter((l) => l.key !== link.key))}
                                        className="p-1.5 rounded-lg hover:text-coral hover:bg-coral/10"
                                        aria-label="Remove link"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <input
                                value={link.title}
                                onChange={(e) =>
                                    setLinks((prev) =>
                                        prev.map((l) =>
                                            l.key === link.key ? { ...l, title: e.target.value } : l
                                        )
                                    )
                                }
                                placeholder="Title"
                                className="w-full h-10 px-3 rounded-lg border border-ink/15 bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                            />
                            <input
                                value={link.url}
                                onChange={(e) =>
                                    setLinks((prev) =>
                                        prev.map((l) =>
                                            l.key === link.key ? { ...l, url: e.target.value } : l
                                        )
                                    )
                                }
                                placeholder="https://"
                                inputMode="url"
                                className="w-full h-10 px-3 rounded-lg border border-ink/15 bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                            />
                        </li>
                    ))}
                </ul>
            </section>

            {error && (
                <p role="alert" className="text-sm text-coral bg-coral/10 border border-coral/25 rounded-xl px-4 py-3">
                    {error}
                </p>
            )}

            <HubMadeWithFooter className="pt-2" />

            {publishedHandle && (
                <div className="rounded-2xl border border-ink/10 bg-cream px-4 py-4 space-y-2">
                    <p className="text-sm font-bold text-ink">Want more from your hub?</p>
                    <p className="text-xs text-muted leading-relaxed">
                        Custom domains and removing Made with are not for sale yet. Tell us you want them and we will email you when they open.
                    </p>
                    {upgradeInterested ? (
                        <p className="text-xs font-semibold text-brand-deep">You are on the list. We will write when it is ready.</p>
                    ) : (
                        <button
                            type="button"
                            disabled={upgradeBusy}
                            onClick={async () => {
                                setUpgradeBusy(true);
                                setError(null);
                                try {
                                    const res = await fetch('/api/organizer/hub', {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ upgradeInterest: true }),
                                    });
                                    if (!res.ok) {
                                        const body = await res.json().catch(() => ({}));
                                        setError(body.error || 'Could not save interest.');
                                        return;
                                    }
                                    setUpgradeInterested(true);
                                    track('hub_upgrade_interest', { handle: publishedHandle });
                                } catch {
                                    setError('Could not reach the server.');
                                } finally {
                                    setUpgradeBusy(false);
                                }
                            }}
                            className="w-full min-h-[44px] rounded-xl bg-ink text-paper text-sm font-bold hover:brightness-125 disabled:opacity-60"
                        >
                            {upgradeBusy ? 'Saving…' : 'I want paid hub upgrades'}
                        </button>
                    )}
                </div>
            )}

            <div
                className="fixed inset-x-0 z-40 border-t border-ink/10 bg-paper/95 backdrop-blur-xl px-5 pt-3 pb-3"
                style={{ bottom: ABOVE_MOBILE_NAV }}
            >
                <div className="max-w-lg mx-auto flex items-center gap-3">
                    <button
                        type="button"
                        onClick={save}
                        disabled={saving}
                        className="flex-1 h-12 rounded-xl bg-brand text-ink font-bold flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-60"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Saving' : saveMsg || 'Save hub'}
                    </button>
                    {previewPath && (
                        <a
                            href={whatsappUrl(
                                hubShareText(displayName.trim() || publishedHandle || 'me'),
                                withUtm(`${origin}${previewPath}`, 'whatsapp')
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => track('hub_share', { handle: publishedHandle || '', platform: 'whatsapp', from: 'save_bar' })}
                            className="h-12 px-4 rounded-xl font-bold text-sm flex items-center gap-1.5 text-white"
                            style={{ backgroundColor: WHATSAPP_GREEN }}
                        >
                            <WhatsAppGlyph size={15} /> Share
                        </a>
                    )}
                    {previewPath && (
                        <a
                            href={previewPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-12 px-4 rounded-xl border border-ink/15 bg-cream font-bold text-sm flex items-center"
                        >
                            Preview
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
