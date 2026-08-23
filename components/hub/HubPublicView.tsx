'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import type { PublicHub } from '@/lib/hub';
import { AdSlot } from '@/components/AdSlot';
import { HubMadeWithFooter } from '@/components/hub/HubMadeWithFooter';
import { resolveHubTheme } from '@/lib/hubThemes';
import { detectSocial } from '@/lib/hubSocial';
import { supportVerb, supportersLabel } from '@/lib/hubSupportLabel';
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

/** Mobile-first Linktree column. Primary job: push people into /c for the frame. */
export function HubPublicView({ hub }: { hub: PublicHub }) {
    const theme = resolveHubTheme(hub.theme);
    const ctaHref = hub.featured ? `/c/${hub.featured.slug}` : null;
    const featured = hub.featured;
    const localeHint =
        typeof document !== 'undefined'
            ? (document.cookie.match(/(?:^|; )ollabs_locale=([^;]*)/)?.[1]
                || (typeof navigator !== 'undefined' ? navigator.language : undefined))
            : undefined;
    const verb = supportVerb(localeHint);

    return (
        <div className="min-h-screen" style={{ background: theme.pageBg, color: theme.pageFg }}>
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.35]"
                style={{ background: theme.accentWash }}
                aria-hidden
            />

            <div className="relative mx-auto max-w-md px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
                <header className="flex flex-col items-center text-center pt-6 pb-8">
                    {hub.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={hub.avatarUrl}
                            alt=""
                            className="h-24 w-24 rounded-full object-cover border-2 bg-cream shadow-sm"
                            style={{ borderColor: theme.cardBorder }}
                        />
                    ) : (
                        <div
                            className="h-24 w-24 rounded-full border-2 flex items-center justify-center font-display text-3xl font-extrabold"
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
                    <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight">
                        {hub.displayName}
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: theme.muted }}>@{hub.handle}</p>
                    {hub.bio && (
                        <p className="mt-3 text-[15px] leading-relaxed max-w-sm opacity-90">
                            {hub.bio}
                        </p>
                    )}
                </header>

                <div className="space-y-3">
                    {ctaHref && featured && (
                        <Link
                            href={ctaHref}
                            onClick={() => beacon(hub.handle, 'support')}
                            className="flex w-full items-stretch gap-3 rounded-2xl border p-3 shadow-sm transition-all active:scale-[0.99]"
                            style={{
                                background: theme.cardBg,
                                borderColor: theme.cardBorder,
                            }}
                        >
                            {featured.preview_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={featured.preview_url}
                                    alt=""
                                    className="h-20 w-20 shrink-0 rounded-xl object-cover border"
                                    style={{ borderColor: theme.cardBorder }}
                                />
                            ) : (
                                <div
                                    className="h-20 w-20 shrink-0 rounded-xl border"
                                    style={{ background: theme.supportBg, borderColor: theme.cardBorder }}
                                />
                            )}
                            <div className="min-w-0 flex-1 flex flex-col justify-center py-0.5">
                                {/* Two lines on purpose: Support / title. Never "Support — title". */}
                                <span className="text-base font-bold leading-tight">{verb}</span>
                                <span className="text-sm font-semibold truncate mt-0.5 opacity-85">
                                    {featured.title}
                                </span>
                                {featured.supporter_count != null && featured.supporter_count > 0 && (
                                    <span
                                        className="text-xs flex items-center gap-1 mt-1.5"
                                        style={{ color: theme.muted }}
                                    >
                                        <Users size={11} />
                                        {supportersLabel(featured.supporter_count, localeHint)}
                                    </span>
                                )}
                            </div>
                            <span
                                className="self-center shrink-0 rounded-xl px-3 py-2 text-xs font-bold"
                                style={{ background: theme.supportBg, color: theme.supportFg }}
                            >
                                {verb}
                            </span>
                        </Link>
                    )}

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
                            <p
                                className="mb-3 text-xs font-bold uppercase tracking-wider px-1"
                                style={{ color: theme.muted }}
                            >
                                More campaigns
                            </p>
                            <ul className="space-y-2">
                                {hub.campaigns.map((c) => (
                                    <li key={c.slug}>
                                        <Link
                                            href={`/c/${c.slug}`}
                                            className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-opacity hover:opacity-90"
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
                                                    className="h-11 w-11 rounded-xl object-cover border"
                                                    style={{ borderColor: theme.cardBorder }}
                                                />
                                            ) : (
                                                <div
                                                    className="h-11 w-11 rounded-xl border"
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
                                                {c.supporter_count != null && c.supporter_count > 0 && (
                                                    <p
                                                        className="text-xs flex items-center gap-1 mt-0.5"
                                                        style={{ color: theme.muted }}
                                                    >
                                                        <Users size={11} />
                                                        {supportersLabel(c.supporter_count, localeHint)}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!ctaHref && hub.links.length === 0 && hub.campaigns.length === 0 && (
                        <p className="text-center text-sm py-8" style={{ color: theme.muted }}>
                            This hub is not ready yet.
                        </p>
                    )}
                </div>

                <div className="mt-8">
                    <AdSlot surface="seo" />
                </div>

                <HubMadeWithFooter className="mt-12 pb-[max(1rem,env(safe-area-inset-bottom))]" />
            </div>
        </div>
    );
}
