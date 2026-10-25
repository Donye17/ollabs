"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { CampaignGridThumb } from '@/components/CampaignGridThumb';
import { prefetchFrameOverlays } from '@/components/renderer/strategies';
import { FrameConfig, FrameType } from '@/lib/types';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { formatCount } from '@/lib/i18n/locale';
import { CATEGORIES } from '@/lib/categories';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';
import type { Messages } from '@/lib/i18n/messages';

export type ExploreSort = 'popular' | 'trending' | 'newest';

export interface ExploreCampaign {
    slug: string;
    title: string;
    supporterCount: number;
    frame: FrameConfig;
    supporterPhotos: string[];
}

// Explore loads up to 60 campaigns and used to mount a live canvas for every
// one of them on first paint. Cap drawing surfaces for the same reason the
// home podium only mounts three frames:
//
// Two caps, because a grid has no spotlight to measure distance from:
//   1. Only the first screenful draws immediately. Everything else waits until
//      it comes near the viewport, so a visitor who never scrolls pays for
//      eight canvases instead of sixty.
//   2. Thumbnails render at 256 rather than the 512 default. They display at
//      112-176 CSS px, so 256 is still 2x on a retina phone.
const INITIAL_WINDOW = 8;
const THUMB_RESOLUTION = 256;

// Start drawing before the card is actually on screen, so it is already painted
// by the time it scrolls into view.
const NEAR_VIEWPORT = '600px';

function frameOverlayUrl(frame: FrameConfig): string | null {
    if (typeof frame.imageUrl === 'string' && frame.imageUrl.trim()) return frame.imageUrl.trim();
    if (frame.type === FrameType.CUSTOM_IMAGE) return null;
    return null;
}

const LazyPreview: React.FC<{ frame: FrameConfig; supporterPhotos: string[]; eager: boolean; title: string }> = ({
    frame,
    supporterPhotos,
    eager,
    title,
}) => {
    const holder = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(eager);

    useEffect(() => {
        if (show) return;
        const el = holder.current;
        if (!el) return;

        if (typeof IntersectionObserver === 'undefined') {
            setShow(true);
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setShow(true);
                    io.disconnect();
                }
            },
            { rootMargin: `${NEAR_VIEWPORT} 0px` }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [show]);

    return (
        <div
            ref={holder}
            className="h-full w-full overflow-hidden rounded-avatar bg-paper"
        >
            {show ? (
                <CampaignGridThumb
                    frame={frame}
                    supporterPhotos={supporterPhotos}
                    size={THUMB_RESOLUTION}
                    className="w-full h-full"
                    title={title}
                />
            ) : (
                <div className="h-full w-full rounded-avatar bg-paper2 motion-safe:animate-pulse" aria-hidden />
            )}
        </div>
    );
};

function categoryName(key: string, manage: Messages['manage'], fallback: string): string {
    const labels: Record<string, string> = {
        cause: manage.catCause,
        sports: manage.catSports,
        event: manage.catEvent,
        fundraiser: manage.catFundraiser,
        community: manage.catCommunity,
        faith: manage.catFaith,
        school: manage.catSchool,
        awareness: manage.catAwareness,
        business: manage.catBusiness,
        other: manage.catOther,
    };
    return labels[key] || fallback;
}

function buildHref(sort: ExploreSort, category: string | null): string {
    const params = new URLSearchParams();
    if (sort !== 'popular') params.set('sort', sort);
    if (category) params.set('category', category);
    const qs = params.toString();
    return qs ? `/explore?${qs}` : '/explore';
}

export const ExploreClient: React.FC<{
    campaigns: ExploreCampaign[];
    sort: ExploreSort;
    category: string | null;
    counts: { all: number; byCategory: Record<string, number> };
}> = ({ campaigns, sort, category, counts }) => {
    const { locale, messages } = useLocale();
    const t = messages.explore;
    const router = useRouter();
    const [q, setQ] = useState('');

    // Warm custom-frame PNGs for the first screen before canvases mount, so
    // thumbs paint artwork instead of a gray silhouette flash (Lane B5).
    useEffect(() => {
        const eager = campaigns.slice(0, INITIAL_WINDOW);
        prefetchFrameOverlays(eager.map((c) => frameOverlayUrl(c.frame)));
        for (const c of eager) {
            for (const url of c.supporterPhotos.slice(0, 2)) {
                const img = new Image();
                img.decoding = 'async';
                img.src = url;
            }
        }
    }, [campaigns]);

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return campaigns;
        return campaigns.filter((c) => c.title.toLowerCase().includes(term));
    }, [q, campaigns]);

    const chipClass = (pressed: boolean) =>
        `min-h-11 gap-2 rounded-control border px-3 text-sm font-semibold inline-flex items-center transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep ${
            pressed ? 'border-transparent bg-brand text-ink' : 'border-ink/10 bg-cream text-ink hover:bg-paper2'
        }`;

    return (
        <>
            <section className={`${PAGE_TOP_UNDER_NAV} pb-8 px-6`}>
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-balance">{t.title}</h1>
                    <p className="text-lg text-ink/70 max-w-2xl">{t.lede}</p>
                </div>
            </section>

            <section className="px-6 pb-4">
                <div className="max-w-5xl mx-auto flex flex-col gap-4">
                    <div className="inline-flex flex-wrap gap-2 self-start" role="group" aria-label={t.title}>
                        {([
                            ['popular', t.popular],
                            ['trending', t.trending],
                            ['newest', t.newest],
                        ] as const).map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                aria-pressed={sort === key}
                                onClick={() => router.push(buildHref(key, category))}
                                className={chipClass(sort === key)}
                            >
                                {label}
                                <span className="tabular-nums text-xs">{formatCount(category ? (counts.byCategory[category] ?? 0) : counts.all, locale)}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            aria-pressed={category === null}
                            onClick={() => router.push(buildHref(sort, null))}
                            className={chipClass(category === null)}
                        >
                            {t.all}
                            <span className="tabular-nums text-xs">{formatCount(counts.all, locale)}</span>
                        </button>
                        {CATEGORIES.map((c) => (
                            <button
                                key={c.key}
                                type="button"
                                aria-pressed={category === c.key}
                                onClick={() => router.push(buildHref(sort, c.key))}
                                className={chipClass(category === c.key)}
                            >
                                {categoryName(c.key, messages.manage, c.label)}
                                <span className="tabular-nums text-xs">{formatCount(counts.byCategory[c.key] ?? 0, locale)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-20">
                <div className="max-w-6xl xl:max-w-7xl mx-auto">
                    {campaigns.length === 0 ? (
                        <div>
                            <p className="text-muted mb-2 max-w-md">
                                {category ? t.emptyCategory : t.emptyGrid}
                            </p>
                            <p className="text-sm text-ink/70 mb-6 max-w-md">{t.emptyShare}</p>
                            <div className="flex flex-wrap items-center gap-3">
                                <Link href="/create" className="inline-flex min-h-12 items-center rounded-control bg-brand px-7 font-bold text-ink hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep transition-colors duration-200">{t.create}</Link>
                                <Link href="/for" className="inline-flex min-h-12 items-center rounded-control border border-ink/15 px-5 font-bold text-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep transition-colors duration-200">{t.browseUses}</Link>
                            </div>
                        </div>
                    ) : (
        <div>
            <div className="max-w-md mx-auto mb-10">
                <div className="flex items-center gap-2 rounded-control border border-ink/10 bg-cream px-4 transition-colors duration-200 focus-within:border-brand-deep focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-deep">
                    <Search size={18} className="text-muted shrink-0" />
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder={t.search}
                        aria-label={t.search}
                        className="flex-1 min-h-[44px] bg-transparent py-3 text-ink placeholder-muted outline-none"
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="text-muted">{t.noMatch}</p>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
                    {filtered.map((c, i) => {
                        const count = formatCount(c.supporterCount, locale);
                        const countLabel = `${count} ${messages.campaign.peopleSupporting}`;
                        return (
                        <Link
                            key={c.slug}
                            href={`/c/${c.slug}`}
                            className="group flex min-w-0 flex-col items-center gap-3 rounded-card bg-cream p-3 shadow-frame-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5"
                            aria-label={`${c.title}. ${countLabel}`}
                        >
                            <span className="block w-[var(--avatar-sm)] aspect-square rounded-avatar p-[3px] ring-frame-conic sm:w-[var(--avatar-md)] xl:w-[var(--avatar-lg)]">
                                <span className="block h-full w-full overflow-hidden rounded-avatar bg-paper shadow-frame-sm">
                                    <LazyPreview
                                        frame={c.frame}
                                        supporterPhotos={c.supporterPhotos}
                                        eager={i < INITIAL_WINDOW}
                                        title={c.title}
                                    />
                                </span>
                            </span>
                            <div className="w-full min-w-0 text-center">
                                <p className="line-clamp-2 break-words text-sm font-semibold text-ink transition-colors duration-200 group-hover:text-brand-deep">
                                    {c.title}
                                </p>
                                <p className="mt-1 block text-xs tabular-nums text-ink/70">
                                    {countLabel}
                                </p>
                            </div>
                        </Link>
                        );
                    })}
                </div>
            )}
        </div>
                    )}
                </div>
            </section>

            {campaigns.length > 0 && (
                <section className="px-6 pb-24">
                    <div className="max-w-3xl mx-auto">
                        <Link href="/create" className="inline-flex min-h-12 items-center rounded-control bg-brand px-8 font-bold text-ink hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep transition-colors duration-200">{t.startOwn}</Link>
                    </div>
                </section>
            )}
        </>
    );
};
