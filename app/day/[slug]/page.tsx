import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { pool } from '@/lib/neon';
import { NavBar } from '@/components/NavBar';
import { SiteFooter } from '@/components/SiteFooter';
import { DayFrameTool } from '@/components/day/DayFrameTool';
import { DAYS, getDay, nextOccurrence, formatOccurrence, countdownLabel, resolveFrame } from '@/lib/days';
import { FrameType } from '@/lib/types';
import { getUseCase } from '@/lib/useCases';
import { visibleFrameSql } from '@/lib/frameValidity';
import { getFrameOverride } from '@/lib/dayFrames';
import { AdSlot } from '@/components/AdSlot';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';
import { ArrowRight, CalendarDays, Users } from 'lucide-react';
import { DayShareButton } from '@/components/day/DayShareButton';
import { SeoCampaignExample } from '@/components/seo/SeoCampaignExample';
import { SUPPORTER_PHOTOS_LATERAL, parseSupporterPhotos } from '@/lib/supporterPhotosSql';
import { parseFrameConfig } from '@/lib/parseFrameConfig';

// Matches the campaign pages: fresh enough for the live campaign block without
// hitting Neon on every crawl.
export const revalidate = 3600;

export function generateStaticParams() {
    return DAYS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const day = getDay(slug);
    if (!day) return { title: 'Not found' };
    const occ = nextOccurrence(day.date);
    const when = formatOccurrence(day, occ);
    const url = `https://ollabs.studio/day/${day.slug}`;
    const description = `${day.name} is ${when}. ${day.tagline} Make a free profile picture frame and share one link. No signup, no watermark.`;
    const overrideUrl = await getFrameOverride(day.slug);
    const frame = resolveFrame(day, overrideUrl);
    const ogImage =
        (frame.type === FrameType.CUSTOM_IMAGE && frame.imageUrl) ? frame.imageUrl
        : overrideUrl || '/og.png';
    return {
        title: `${day.name} Profile Picture Frame`,
        description,
        keywords: [day.keyword, `${day.name.toLowerCase()} frame`, `${day.name.toLowerCase()} profile picture`,
            'profile picture frame', 'twibbon alternative'],
        alternates: { canonical: url },
        openGraph: { type: 'website', url, siteName: 'Ollabs', title: `${day.name} Profile Picture Frame`, description, images: [ogImage] },
        twitter: { card: 'summary_large_image', title: `${day.name} Profile Picture Frame`, description, images: [ogImage] },
    };
}

type LiveCampaign = {
    slug: string;
    title: string;
    supporter_count: number;
    frame_config: unknown;
    supporter_photos: unknown;
};

/**
 * Real campaigns in this day's category, with real counts.
 *
 * This block is what keeps the page off the thin-content pile: it is data a
 * competitor cannot copy into a blog post, and it changes as the platform does.
 */
async function liveCampaigns(slug: string): Promise<LiveCampaign[]> {
    try {
        const res = await pool.query(
            // Campaigns actually started from this day, not merely sharing its
            // category. Category matching put St Patrick's Day frames on the
            // s'mores page, because both are 'event'.
            //
            // Zero-supporter campaigns are excluded: a grid of six zeroes reads
            // as a dead platform and makes the heading a lie.
            `SELECT c.slug, c.title, c.frame_config,
                    COALESCE(c.supporter_count, 0) AS supporter_count,
                    COALESCE(sp.supporter_photos, ARRAY[]::text[]) AS supporter_photos
             FROM campaigns c
             ${SUPPORTER_PHOTOS_LATERAL}
             WHERE c.is_public = true AND c.is_hidden IS NOT TRUE
               AND c.day_slug = $1 AND COALESCE(c.supporter_count, 0) > 0
               AND ${visibleFrameSql('c')}
             ORDER BY c.supporter_count DESC, c.created_at DESC
             LIMIT 6`,
            [slug]
        );
        return res.rows as LiveCampaign[];
    } catch (e) {
        console.error('day: live campaigns failed', e);
        return [];
    }
}

export default async function DayPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const day = getDay(slug);
    if (!day) notFound();

    const occ = nextOccurrence(day.date);
    const when = formatOccurrence(day, occ);
    const countdown = countdownLabel(occ);
    const [campaigns, overrideUrl] = await Promise.all([
        liveCampaigns(day.slug),
        getFrameOverride(day.slug),
    ]);

    const ld = [
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: `How do you celebrate ${day.name}?`,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: day.howToCelebrate.map((b) => `${b.title}. ${b.body}`).join(' '),
                    },
                },
                ...day.faqs.map((f) => ({
                    '@type': 'Question', name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: day.name,
            startDate: occ.start.toISOString().slice(0, 10),
            endDate: occ.end.toISOString().slice(0, 10),
            eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: { '@type': 'VirtualLocation', url: `https://ollabs.studio/day/${day.slug}` },
            description: day.tagline,
        },
    ];

    return (
        <main className="min-h-screen bg-paper text-ink">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
            <NavBar />

            {/* Hero */}
            <section className={`relative ${PAGE_TOP_UNDER_NAV} pb-12 px-6`}>
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="text-sm font-semibold text-muted inline-flex items-center gap-1.5">
                            <CalendarDays size={14} /> {when}
                        </span>
                        <span className="text-sm font-semibold text-brand-deep">
                            {countdown}
                        </span>
                    </div>
                    <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.03] mb-5">
                        {day.name} profile picture frame
                    </h1>
                    <p className="text-lg md:text-xl text-ink/70 max-w-2xl">{day.tagline}</p>
                </div>
            </section>

            {/* Use it right here */}
            <section className="px-6 pb-16">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-cream border border-ink/10 rounded-3xl p-6 md:p-10">
                        <h2 className="font-display text-2xl font-bold mb-1 text-center">Add the frame to your photo</h2>
                        <p className="text-sm text-ink/70 mb-7 text-center">
                            Free, no signup, and no watermark. Your photo never leaves your browser.
                        </p>
                        <DayFrameTool frame={resolveFrame(day, overrideUrl)} dayName={day.name} daySlug={day.slug} />
                        <div className="mt-5">
                            <DayShareButton dayName={day.name} daySlug={day.slug} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Below the tool, never beside it. SEO pages carry denser inventory than
                /c; still labelled, in-flow, collapses when unfilled. */}
            <section className="px-6 pb-8">
                <div className="max-w-3xl mx-auto">
                    <AdSlot surface="seo" />
                </div>
            </section>

            {/* Intro + background */}
            <section className="px-6 pb-4">
                <div className="max-w-3xl mx-auto space-y-4">
                    {day.intro.map((p, i) => <p key={i} className="text-lg text-ink/75 leading-relaxed">{p}</p>)}
                </div>
            </section>

            {/* How to celebrate, written for a person.
                Placed directly after the intro because retrieval weighs opening
                content most, and this is the section that answers the question
                an individual actually searches. */}
            <section className="px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                        How to celebrate {day.name}
                    </h2>
                    <div className="space-y-4">
                        {day.howToCelebrate.map((b) => (
                            <div key={b.title} className="bg-cream border border-ink/10 rounded-2xl p-5">
                                <h3 className="font-display font-bold mb-1.5">{b.title}</h3>
                                <p className="text-ink/75 leading-relaxed">{b.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">What {day.name} is</h2>
                    <div className="space-y-4">
                        {day.background.map((p, i) => <p key={i} className="text-lg text-ink/75 leading-relaxed">{p}</p>)}
                    </div>
                </div>
            </section>

            {/* How organisations mark it */}
            <section className="px-6 pb-12">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">How organisations mark it</h2>
                    <div className="space-y-4">
                        {day.howOrgsMark.map((b) => (
                            <div key={b.title} className="bg-cream border border-ink/10 rounded-2xl p-5">
                                <h3 className="font-display font-bold mb-1.5">{b.title}</h3>
                                <p className="text-ink/75 leading-relaxed">{b.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-8">
                <div className="max-w-3xl mx-auto">
                    <AdSlot surface="seo" />
                </div>
            </section>

            {/* Live campaigns, real data. Lead with one framed example when we have it. */}
            <section className="px-6 pb-12">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                        {campaigns.length === 0 ? 'Be the first' : 'Campaigns running now'}
                    </h2>
                    <p className="text-ink/70 mb-6">
                        {campaigns.length === 0
                            ? `No one has run a ${day.name} campaign yet.`
                            : `Live ${day.category} campaigns on Ollabs, with real supporter counts.`}
                    </p>
                    {campaigns.length === 0 ? (
                        <div className="border border-dashed border-ink/15 rounded-2xl p-8 text-center">
                            <p className="text-ink/75 mb-5">
                                Make the frame, share one link, and your supporter count starts moving today.
                            </p>
                            <Link
                                href={`/create?day=${day.slug}`}
                                className="inline-flex h-11 px-6 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:brightness-105 transition-all"
                            >
                                Create a campaign <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <>
                            {(() => {
                                const featured = campaigns[0];
                                const frame = parseFrameConfig(featured.frame_config);
                                if (!frame) return null;
                                return (
                                    <div className="mb-8 flex justify-center">
                                        <SeoCampaignExample
                                            campaign={{
                                                slug: featured.slug,
                                                title: featured.title,
                                                supporterCount: featured.supporter_count ?? 0,
                                                frame,
                                                supporterPhotos: parseSupporterPhotos(featured.supporter_photos),
                                            }}
                                            size={200}
                                            title="Example campaign"
                                        />
                                    </div>
                                );
                            })()}
                            {campaigns.length > 1 && (
                                <ul className="divide-y divide-ink/10 border-y border-ink/10">
                                    {campaigns.slice(1).map((c) => (
                                        <li key={c.slug}>
                                            <Link
                                                href={`/c/${c.slug}`}
                                                className="flex items-center justify-between gap-3 py-3.5 hover:text-brand-deep transition-colors"
                                            >
                                                <p className="font-display font-bold truncate">{c.title}</p>
                                                <p className="text-xs text-muted flex items-center gap-1.5 shrink-0">
                                                    <Users size={12} />
                                                    {(c.supporter_count ?? 0).toLocaleString()}
                                                </p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Ideas */}
            <section className="px-6 pb-12">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Campaign ideas</h2>
                    <ul className="space-y-3">
                        {day.campaignIdeas.map((idea, i) => (
                            <li key={i} className="flex gap-3 text-lg text-ink/75 leading-relaxed">
                                <span className="mt-2 w-2 h-2 rounded-full bg-brand shrink-0" />
                                <span>{idea}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="px-6 pb-8">
                <div className="max-w-3xl mx-auto">
                    <AdSlot surface="seo" />
                </div>
            </section>

            {/* FAQ */}
            <section className="px-6 pb-12">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Common questions</h2>
                    <div className="space-y-4">
                        {day.faqs.map((f) => (
                            <div key={f.q} className="bg-cream border border-ink/10 rounded-2xl p-5">
                                <h3 className="font-display font-bold mb-2">{f.q}</h3>
                                <p className="text-ink/75 leading-relaxed">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-10">
                <div className="max-w-3xl mx-auto">
                    <AdSlot surface="seo" />
                </div>
            </section>

            {/* Day-specific callout. Only Coffee Day has a standing campaign
                behind it so far, so this stays a narrow special case rather
                than another field on every entry. */}
            {day.slug === 'national-coffee-day' && (
                <section className="px-6 pb-12">
                    <div className="max-w-3xl mx-auto bg-ink text-paper rounded-3xl p-8 md:p-10">
                        <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">The Independents List</h2>
                        <p className="text-paper/80 leading-relaxed mb-6">
                            The chains own this day with free-cup offers. Your shop made the coffee. Run a frame and
                            you go on a public list of every independent marking the day, published every year.
                        </p>
                        <Link
                            href="/day/national-coffee-day/independents"
                            className="inline-flex h-11 px-6 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:brightness-105 transition-all"
                        >
                            See the list <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>
            )}

            {/* Related */}
            <section className="px-6 pb-24">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-cream border border-ink/10 rounded-3xl p-10 text-center mb-10">
                        <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Run it for your organisation</h2>
                        <p className="text-ink/70 mb-7 max-w-xl mx-auto">
                            Make the frame once, share one link, and watch the supporter count move. Takes about a minute.
                        </p>
                        <Link href={`/create?day=${day.slug}`} className="inline-flex h-12 px-7 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:brightness-105 transition-all">
                            Create a campaign <ArrowRight size={16} />
                        </Link>
                    </div>

                    {day.relatedUseCases.length > 0 && (
                        <>
                            <h3 className="font-display font-bold mb-3">More for your team</h3>
                            <div className="flex flex-wrap gap-2">
                                {day.relatedUseCases.map((s) => {
                                    const uc = getUseCase(s);
                                    if (!uc) return null;
                                    return (
                                        <Link key={s} href={`/for/${s}`}
                                            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold hover:bg-ink/5 transition-colors">
                                            Frames for {uc.audience.toLowerCase()}
                                        </Link>
                                    );
                                })}
                                <Link href="/day" className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold hover:bg-ink/5 transition-colors">
                                    All awareness days
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
