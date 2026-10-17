"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
            className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden bg-ink/5 ring-1 ring-ink/10 frame-shadow"
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
                <div className="w-full h-full rounded-full bg-ink/10 animate-pulse" aria-hidden />
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
}> = ({ campaigns, sort, category }) => {
    const { locale, messages } = useLocale();
    const t = messages.explore;
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
                    <div className="inline-flex flex-wrap p-1 bg-cream border border-ink/10 rounded-full self-start">
                        {([
                            ['popular', t.popular],
                            ['trending', t.trending],
                            ['newest', t.newest],
                        ] as const).map(([key, label]) => (
                            <Link
                                key={key}
                                href={buildHref(key, category)}
                                className={`min-h-11 px-4 rounded-full text-sm font-semibold inline-flex items-center transition-colors ${sort === key ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={buildHref(sort, null)}
                            className={`min-h-11 px-3.5 rounded-full text-sm font-medium border inline-flex items-center transition-colors ${category === null ? 'bg-brand/15 border-brand/40 text-brand-deep' : 'bg-cream border-ink/10 text-muted hover:text-ink'}`}
                        >
                            {t.all}
                        </Link>
                        {CATEGORIES.map((c) => (
                            <Link
                                key={c.key}
                                href={buildHref(sort, c.key)}
                                className={`min-h-11 px-3.5 rounded-full text-sm font-medium border inline-flex items-center transition-colors ${category === c.key ? 'bg-brand/15 border-brand/40 text-brand-deep' : 'bg-cream border-ink/10 text-muted hover:text-ink'}`}
                            >
                                {categoryName(c.key, messages.manage, c.label)}
                            </Link>
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
                                <Link href="/create" className="inline-flex min-h-12 px-7 rounded-xl bg-brand text-ink font-bold items-center hover:brightness-105 transition-all">{t.create}</Link>
                                <Link href="/for" className="inline-flex min-h-12 px-5 rounded-xl border border-ink/15 text-ink font-bold items-center hover:bg-ink/5 transition-all">{t.browseUses}</Link>
                            </div>
                        </div>
                    ) : (
        <div>
            <div className="max-w-md mx-auto mb-10">
                <div className="flex items-center gap-2 bg-cream border border-ink/10 rounded-xl px-4 focus-within:ring-2 focus-within:ring-brand/40 focus-within:border-brand transition-all">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                    {filtered.map((c, i) => {
                        const count = formatCount(c.supporterCount, locale);
                        const countLabel = `${count} ${messages.campaign.peopleSupporting}`;
                        return (
                        <Link key={c.slug} href={`/c/${c.slug}`} className="group flex flex-col items-center gap-3" aria-label={`${c.title}. ${countLabel}`}>
                            <LazyPreview
                                frame={c.frame}
                                supporterPhotos={c.supporterPhotos}
                                eager={i < INITIAL_WINDOW}
                                title={c.title}
                            />
                            <div className="text-center w-full min-w-0">
                                <p className="text-sm font-semibold text-ink group-hover:text-brand-deep transition-colors line-clamp-2 break-words">
                                    {c.title}
                                </p>
                                <p className="block text-xs text-muted mt-1 tabular-nums">
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
                        <Link href="/create" className="inline-flex min-h-12 px-8 rounded-xl bg-brand text-ink font-bold items-center hover:brightness-105 transition-all">{t.startOwn}</Link>
                    </div>
                </section>
            )}
        </>
    );
};
