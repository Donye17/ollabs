"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { HubMadeWithFooter } from '@/components/hub/HubMadeWithFooter';
import { HubAvatarComposer, type HubFrameCampaign } from '@/components/hub/HubAvatarComposer';
import { AdSlot } from '@/components/AdSlot';
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
import { HUB_LINK_PRESETS } from '@/lib/hubSocial';
import type { FrameConfig } from '@/lib/types';

type CampaignOpt = {
    id: string;
    slug: string;
    title: string;
    supporter_count: number | null;
    preview_url: string | null;
    frameConfig?: FrameConfig | null;
};

type LinkDraft = { key: string; title: string; url: string; clickCount?: number; urlPlaceholder?: string };

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
    const [campaigns, setCampaigns] = useState<CampaignOpt[]>([]);
    const [links, setLinks] = useState<LinkDraft[]>([]);
    const [publishedHandle, setPublishedHandle] = useState<string | null>(null);
    const [avatarComposerOpen, setAvatarComposerOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [linkPickerOpen, setLinkPickerOpen] = useState(false);

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
            setCampaigns(
                (data.campaigns || []).map((c) => ({
                    id: c.id,
                    slug: c.slug,
                    title: c.title,
                    supporter_count: c.supporter_count,
                    preview_url: c.preview_url,
                    frameConfig: (c as { frameConfig?: FrameConfig | null }).frameConfig ?? null,
                }))
            );
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

    const save = async (): Promise<{ ok: boolean; handle: string | null }> => {
        if (saving) return { ok: false, handle: null };
        const normalized = normalizeHandle(handle);
        const herr = handleError(normalized);
        if (herr) {
            setError(herr);
            return { ok: false, handle: null };
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
                return { ok: false, handle: null };
            }
            const firstClaim = !publishedHandle && Boolean(body.handle || normalized);
            const nextHandle = (body.handle as string | null) || normalized;
            setPublishedHandle(nextHandle);
            setHandle(nextHandle);
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
            if (firstClaim) track('hub_claimed', { handle: nextHandle });
            setTimeout(() => setSaveMsg(null), 2000);
            return { ok: true, handle: nextHandle };
        } catch {
            setError('Could not reach the server.');
            return { ok: false, handle: null };
        } finally {
            setSaving(false);
        }
    };

    /** Public /u only reflects the last save. Persist first, then open an
     *  in-page preview so the editor (and thumb menu) stay put. In-app browsers
     *  often swallow window.open and strand people on /u with no way back. */
    const previewHub = async () => {
        const result = await save();
        if (!result.ok || !result.handle) return;
        const path = `/u/${result.handle}`;
        setPreviewSrc(path);
        setPreviewOpen(true);
        track('hub_preview', { handle: result.handle });
    };

    const addLinkFromPreset = (presetId: string) => {
        const preset = HUB_LINK_PRESETS.find((p) => p.id === presetId) || HUB_LINK_PRESETS[HUB_LINK_PRESETS.length - 1];
        setLinks((prev) => [
            ...prev,
            {
                key: newKey(),
                title: preset.id === 'other' ? '' : preset.title,
                url: '',
                urlPlaceholder: preset.placeholder,
            },
        ]);
        setLinkPickerOpen(false);
        track('hub_link_preset', { preset: preset.id });
    };

    useEffect(() => {
        if (!previewOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPreviewOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [previewOpen]);

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

    const frameCampaigns: HubFrameCampaign[] = campaigns
        .filter((c): c is CampaignOpt & { frameConfig: FrameConfig } => !!c.frameConfig)
        .map((c) => ({
            id: c.id,
            slug: c.slug,
            title: c.title,
            preview_url: c.preview_url,
            frame: c.frameConfig,
        }));

    const previewPath = publishedHandle ? `/u/${publishedHandle}` : null;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ollabs.studio';
    const hubUrl = previewPath ? `${origin}${previewPath}` : null;

    return (
        <div className="max-w-lg mx-auto space-y-6 pb-[max(5rem,calc(4rem+env(safe-area-inset-bottom)))]">
            {/* Sticky under the site NavBar so Save never fights the thumb tab bar. */}
            <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-30 -mx-1 px-1 py-2 bg-paper/95 backdrop-blur-xl border-b border-ink/10">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => { void save(); }}
                        disabled={saving}
                        className="flex-1 h-11 rounded-xl bg-brand text-ink font-bold flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-60"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Saving' : saveMsg || 'Save hub'}
                    </button>
                    {(previewPath || handle.trim()) && (
                        <a
                            href={whatsappUrl(
                                hubShareText(displayName.trim() || publishedHandle || handle || 'me'),
                                withUtm(
                                    `${origin}/u/${publishedHandle || normalizeHandle(handle)}`,
                                    'whatsapp'
                                )
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => track('hub_share', { handle: publishedHandle || '', platform: 'whatsapp', from: 'sticky_bar' })}
                            className="h-11 px-3 rounded-xl font-bold text-sm flex items-center gap-1.5 text-white shrink-0"
                            style={{ backgroundColor: WHATSAPP_GREEN }}
                        >
                            <WhatsAppGlyph size={15} /> Share
                        </a>
                    )}
                    <button
                        type="button"
                        onClick={() => { void previewHub(); }}
                        disabled={saving}
                        className="h-11 px-3 rounded-xl border border-ink/15 bg-cream font-bold text-sm flex items-center shrink-0 disabled:opacity-60"
                    >
                        Preview
                    </button>
                </div>
            </div>

            {previewPath && hubUrl && (
                <div className="rounded-2xl border border-brand/30 bg-brand/10 p-4 space-y-3">
                    <button
                        type="button"
                        onClick={() => { void previewHub(); }}
                        disabled={saving}
                        className="w-full flex items-center justify-between gap-3 text-sm font-semibold text-brand-deep text-left disabled:opacity-60"
                    >
                        <span className="truncate">{hubUrl}</span>
                        <ExternalLink size={16} className="shrink-0" />
                    </button>
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
                    <p className="text-xs text-muted mb-3 leading-relaxed">
                        Use a campaign frame around your face, or upload a plain photo.
                    </p>
                    <div className="flex items-center gap-4">
                        {avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover border border-ink/10" />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-brand/20 border border-ink/10" />
                        )}
                        <div className="flex flex-col gap-2 min-w-0 flex-1">
                            <button
                                type="button"
                                onClick={() => setAvatarComposerOpen(true)}
                                disabled={frameCampaigns.length === 0}
                                className="inline-flex h-10 px-4 rounded-xl bg-brand text-ink text-sm font-bold items-center justify-center gap-2 hover:brightness-105 disabled:opacity-50"
                            >
                                Frame with a campaign
                            </button>
                            <div className="flex items-center gap-3 flex-wrap">
                                <label className="inline-flex h-10 px-4 rounded-xl bg-paper border border-ink/15 text-sm font-bold items-center gap-2 cursor-pointer hover:bg-ink/5 transition-colors">
                                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                    {uploading ? 'Uploading' : 'Plain upload'}
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
                            {frameCampaigns.length === 0 && (
                                <p className="text-[11px] text-muted leading-snug">
                                    Create a campaign first to frame a photo here.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <HubAvatarComposer
                open={avatarComposerOpen}
                campaigns={frameCampaigns}
                onClose={() => setAvatarComposerOpen(false)}
                onDone={(url) => {
                    setAvatarUrl(url);
                    track('hub_avatar_framed', { campaign_count: frameCampaigns.length });
                }}
            />
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
                        onClick={() => setLinkPickerOpen((v) => !v)}
                        className="inline-flex h-9 px-3 rounded-lg bg-paper border border-ink/15 text-xs font-bold items-center gap-1.5 hover:bg-ink/5 disabled:opacity-50"
                    >
                        <Plus size={14} /> Add
                    </button>
                </div>
                <p className="text-sm text-ink/70">
                    Instagram, donate, press kit, or anything else in the campaign.
                </p>

                {linkPickerOpen && (
                    <div className="rounded-xl border border-ink/10 bg-paper p-3 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted">What kind of link?</p>
                        <div className="grid grid-cols-2 gap-2">
                            {HUB_LINK_PRESETS.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => addLinkFromPreset(p.id)}
                                    className="rounded-xl border border-ink/10 bg-cream px-3 py-2.5 text-left hover:bg-brand/10 hover:border-brand/40 transition-colors"
                                >
                                    <span className="block text-sm font-bold text-ink">{p.title}</span>
                                    <span className="block text-[11px] text-muted">{p.hint}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {links.length === 0 && !linkPickerOpen && (
                    <p className="text-sm text-muted py-2">No extra links yet. Tap Add to pick Instagram, X, or another.</p>
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
                                placeholder={link.urlPlaceholder || 'https://'}
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

            {/* Below the fold: only people who scroll past the editor see it.
                SEO surface matches public hubs; never near the save controls. */}
            <AdSlot surface="seo" className="pt-2 pb-4" />

            {/* In-page preview leaves Mine · Create · Hub visible underneath.
                Closing returns to the editor with all draft state intact. */}
            {previewOpen && previewSrc && (
                <div
                    className="fixed inset-x-0 top-0 z-[35] flex flex-col bg-paper border-t border-ink/10"
                    style={{ bottom: ABOVE_MOBILE_NAV }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Hub preview"
                >
                    <div
                        className="flex items-center gap-2 px-4 py-3 border-b border-ink/10 bg-paper shrink-0"
                        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))' }}
                    >
                        <button
                            type="button"
                            onClick={() => setPreviewOpen(false)}
                            className="h-10 px-4 rounded-xl bg-ink text-paper text-sm font-bold hover:brightness-125"
                        >
                            Back to editor
                        </button>
                        <p className="text-sm font-semibold text-ink truncate flex-1">Preview</p>
                        <a
                            href={previewSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 w-10 rounded-xl border border-ink/15 flex items-center justify-center hover:bg-ink/5"
                            aria-label="Open in new tab"
                        >
                            <ExternalLink size={16} />
                        </a>
                    </div>
                    <iframe
                        src={previewSrc}
                        title="Hub preview"
                        className="flex-1 w-full border-0 bg-paper"
                    />
                </div>
            )}
        </div>
    );
};
