'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, Link2, Users } from 'lucide-react';
import type { PublicHub } from '@/lib/hub';
import { campaignFromHubPath } from '@/lib/hub';
import { HubMadeWithFooter } from '@/components/hub/HubMadeWithFooter';
import { resolveHubTheme } from '@/lib/hubThemes';
import { detectSocial } from '@/lib/hubSocial';
import { hubExplainer, supportVerb, supportersLabel } from '@/lib/hubSupportLabel';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { htmlLang, isLocale, type Locale } from '@/lib/i18n/locale';
import { track } from '@/lib/analytics';
import {
    FacebookGlyph,
    InstagramGlyph,
    TikTokGlyph,
    WhatsAppGlyph,
    XGlyph,
    YouTubeGlyph,
} from '@/components/ShareGlyphs';

function SocialIcon({ url }: { url: string }) {
    const kind = detectSocial(url);
    const size = 18;
    if (kind === 'instagram') return <InstagramGlyph size={size} />;
    if (kind === 'tiktok') return <TikTokGlyph size={size} />;
    if (kind === 'youtube') return <YouTubeGlyph size={size} />;
    if (kind === 'whatsapp') return <WhatsAppGlyph size={size} />;
    if (kind === 'x') return <XGlyph size={size} />;
    if (kind === 'facebook') return <FacebookGlyph size={size} />;
    return null;
}

function beacon(handle: string, kind: 'support' | 'link', linkId?: string) {
    try {
        const body = JSON.stringify({ handle, kind, linkId });
        if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
            const blob = new Blob([body], { type: 'application/json' });
            navigator.sendBeacon('/api/hub/click', blob);
            return;
        }
        void fetch('/api/hub/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
        });
    } catch { /* ignore */ }
}

function readLangParam(): Locale | null {
    if (typeof window === 'undefined') return null;
    const raw = new URLSearchParams(window.location.search).get('lang');
    return isLocale(raw) ? raw : null;
}

/**
 * Mobile-first campaign directory. Primary job: open the featured frame.
 * Language starts where that campaign page starts, then the visitor can switch.
 */
export function HubPublicView({ hub }: { hub: PublicHub }) {
    const theme = resolveHubTheme(hub.theme);
    const { messages, setLocale } = useLocale();
    const copy = messages.hub;
    const [picked, setPicked] = useState<Locale | null>(null);
    const [copied, setCopied] = useState(false);
    const [copyFailed, setCopyFailed] = useState(false);
    const [hubUrl, setHubUrl] = useState(`https://ollabs.studio/u/${hub.handle}`);
    const copying = useRef(false);

    const locale = picked ?? hub.suggestedLocale;
    const verb = supportVerb(locale);
    const featured = hub.featured;
    const ctaHref = featured ? campaignFromHubPath(featured.slug, hub.handle, locale) : null;
    const bioText =
        hub.bio?.trim() ||
        (hub.links.length === 0 ? featured?.description?.trim() || '' : '');

    useEffect(() => {
        setHubUrl(`${window.location.origin}/u/${hub.handle}`);
        const fromUrl = readLangParam();
        if (fromUrl) {
            setPicked(fromUrl);
            setLocale(fromUrl);
        }
    }, [hub.handle, setLocale]);

    const pickLocale = (next: Locale) => {
        setPicked(next);
        setLocale(next);
        const url = new URL(window.location.href);
        url.searchParams.set('lang', next);
        window.history.replaceState(null, '', `${url.pathname}${url.search}`);
    };

    const copyHubLink = async () => {
        if (copying.current) return;
        copying.current = true;
        const url = typeof window !== 'undefined'
            ? `${window.location.origin}/u/${hub.handle}`
            : hubUrl;
        setHubUrl(url);
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setCopyFailed(false);
            track('hub_share', { handle: hub.handle, platform: 'copy', from: 'public' });
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
            setCopyFailed(true);
        } finally {
            copying.current = false;
        }
    };

    return (
        <div lang={htmlLang(locale)} className="min-h-screen" style={{ background: theme.pageBg, color: theme.pageFg }}>
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.35]"
                style={{ background: theme.accentWash }}
                aria-hidden
            />

            <div className="relative mx-auto max-w-md px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
                <div className="flex justify-end">
                    <div role="group" aria-label={messages.nav.language} className="inline-flex items-center">
                        {(['en', 'pt'] as const).map((code) => {
                            const active = locale === code;
                            return (
                                <button
                                    key={code}
                                    type="button"
                                    onClick={() => pickLocale(code)}
                                    aria-pressed={active}
                                    className="min-h-11 min-w-11 px-2 rounded-lg text-xs font-bold tracking-wide"
                                    style={{ color: active ? theme.pageFg : theme.muted }}
                                >
                                    {code === 'en' ? messages.nav.english : messages.nav.portuguese}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <header className="flex flex-col items-center text-center pt-1 pb-4">
                    {hub.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={hub.avatarUrl}
                            alt=""
                            className="h-16 w-16 rounded-full object-cover border-2 bg-cream"
                            style={{ borderColor: theme.cardBorder }}
                        />
                    ) : (
                        <div
                            className="h-16 w-16 rounded-full border-2 flex items-center justify-center font-display text-2xl font-bold"
                            style={{
                                background: theme.supportBg,
                                color: theme.supportFg,
                                borderColor: theme.cardBorder,
                                opacity: 0.9,
                            }}
                        >
                            {hub.displayName.replace(/^@/, '').slice(0, 1).toUpperCase()}
                        </div>
                    )}
                    <h1 className="mt-3 font-display text-xl font-bold tracking-tight">
                        {hub.displayName}
                    </h1>
                    <p className="mt-0.5 text-sm" style={{ color: theme.muted }}>@{hub.handle}</p>
                    {bioText && (
                        <p className="mt-2 max-w-sm whitespace-pre-line text-sm leading-relaxed opacity-90">
                            {bioText}
                        </p>
                    )}
                    <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: theme.muted }}>
                        {hubExplainer(locale)}
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: theme.pageFg }}>
                        {copy.joinHint}
                    </p>
                </header>

                <div className="space-y-3">
                    {ctaHref && featured && (
                        <section className="flex flex-col items-center gap-4 pb-1" aria-labelledby="hub-featured">
                            <h2 id="hub-featured" className="font-display text-base font-bold">
                                {copy.featured}
                            </h2>
                            {featured.preview_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={featured.preview_url}
                                    alt={featured.title}
                                    className="w-[min(72vw,16.5rem)] h-[min(72vw,16.5rem)] rounded-full object-cover frame-shadow"
                                />
                            ) : (
                                <div
                                    className="w-[min(72vw,16.5rem)] h-[min(72vw,16.5rem)] rounded-full border-2"
                                    style={{ background: theme.supportBg, borderColor: theme.cardBorder }}
                                />
                            )}

                            <div className="text-center px-2">
                                <p className="font-display text-lg font-bold leading-tight line-clamp-2">
                                    {featured.title}
                                </p>
                                {featured.description?.trim() && featured.description.trim() !== featured.title.trim() && featured.description.trim() !== bioText && (
                                    <p className="mt-2 max-w-sm whitespace-pre-line text-sm leading-relaxed" style={{ color: theme.muted }}>
                                        {featured.description.trim()}
                                    </p>
                                )}
                                <p
                                    className="text-sm flex items-center justify-center gap-1.5 mt-2"
                                    style={{ color: theme.muted }}
                                >
                                    <Users size={14} aria-hidden />
                                    {supportersLabel(featured.supporter_count ?? 0, locale)}
                                </p>
                            </div>

                            <Link
                                href={ctaHref}
                                onClick={() => beacon(hub.handle, 'support')}
                                className="flex w-full min-h-[56px] items-center justify-center rounded-2xl px-5 text-base font-bold transition-opacity active:opacity-90"
                                style={{
                                    background: theme.supportBg,
                                    color: theme.supportFg,
                                }}
                            >
                                {verb}
                            </Link>
                        </section>
                    )}

                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={() => { void copyHubLink(); }}
                            className="flex w-full min-h-11 items-center justify-center gap-2 rounded-2xl border px-5 text-[15px] font-semibold"
                            style={{
                                background: theme.cardBg,
                                borderColor: theme.cardBorder,
                                color: theme.pageFg,
                            }}
                        >
                            {copied ? <Check size={16} aria-hidden /> : <Link2 size={16} aria-hidden />}
                            {copied ? copy.linkCopied : copy.shareHub}
                        </button>
                        {copyFailed && (
                            <p role="alert" className="text-sm text-center" style={{ color: theme.pageFg }}>
                                {copy.copyFailed}
                                <span className="mt-1 block break-all select-all font-semibold">{hubUrl}</span>
                            </p>
                        )}
                    </div>

                    {hub.links.map((link) => {
                        const icon = <SocialIcon url={link.url} />;
                        return (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => beacon(hub.handle, 'link', link.id)}
                                className="flex w-full min-h-12 items-center justify-between gap-3 rounded-2xl border px-5 py-3.5 text-[15px] font-semibold transition-opacity hover:opacity-90"
                                style={{
                                    background: theme.cardBg,
                                    borderColor: theme.cardBorder,
                                    color: theme.pageFg,
                                }}
                            >
                                <span className="flex items-center gap-3 min-w-0">
                                    {icon && <span className="shrink-0 opacity-80">{icon}</span>}
                                    <span className="truncate">{link.title}</span>
                                </span>
                            </a>
                        );
                    })}

                    {hub.campaigns.length > 0 && (
                        <div className="pt-4">
                            <h2
                                className="mb-3 text-sm font-semibold px-1"
                                style={{ color: theme.muted }}
                            >
                                {copy.moreCampaigns}
                            </h2>
                            <ul className="space-y-2">
                                {hub.campaigns.map((c) => (
                                    <li key={c.slug}>
                                        <Link
                                            href={campaignFromHubPath(c.slug, hub.handle, locale)}
                                            className="flex min-h-11 items-center gap-3 rounded-2xl border px-4 py-3 transition-opacity hover:opacity-90"
                                            style={{
                                                background: theme.cardBg,
                                                borderColor: theme.cardBorder,
                                            }}
                                        >
                                            {c.preview_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={c.preview_url}
                                                    alt=""
                                                    className="h-11 w-11 rounded-full object-cover border"
                                                    style={{ borderColor: theme.cardBorder }}
                                                />
                                            ) : (
                                                <div
                                                    className="h-11 w-11 rounded-full border"
                                                    style={{
                                                        background: theme.supportBg,
                                                        borderColor: theme.cardBorder,
                                                        opacity: 0.5,
                                                    }}
                                                />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="font-display font-bold truncate text-[15px]">
                                                    {c.title}
                                                </p>
                                                <p
                                                    className="text-xs flex items-center gap-1 mt-0.5"
                                                    style={{ color: theme.muted }}
                                                >
                                                    <Users size={11} aria-hidden />
                                                    {supportersLabel(c.supporter_count ?? 0, locale)}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!ctaHref && hub.links.length === 0 && hub.campaigns.length === 0 && (
                        <p className="text-center text-sm py-8" style={{ color: theme.muted }}>
                            {copy.notReady}
                        </p>
                    )}
                </div>

                <HubMadeWithFooter className="mt-12" />
            </div>
        </div>
    );
}
