import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { SiteFooter } from '@/components/SiteFooter';
import { daysByUpcoming, formatOccurrence, countdownLabel } from '@/lib/days';
import { AdSlot } from '@/components/AdSlot';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { GuidesReadNext } from '@/components/guides/GuidesReadNext';

const URL = 'https://ollabs.studio/day';

export const metadata: Metadata = {
    title: 'Awareness day calendar',
    description:
        'Profile picture frames for awareness days, months, and campaigns. Free, no signup, and never a watermark on your supporters\' photos.',
    keywords: ['awareness day calendar', 'awareness month profile picture frame', 'campaign frame calendar',
        'profile picture frame maker', 'twibbon alternative'],
    alternates: { canonical: URL },
    openGraph: {
        type: 'website', url: URL, siteName: 'Ollabs',
        title: 'Awareness day calendar',
        description: 'Frames for the awareness days and months your organisation already marks.',
        images: ['/og.png'],
    },
};

export default function DayIndexPage() {
    const upcoming = daysByUpcoming();

    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />

            <section className={`relative ${PAGE_TOP_UNDER_NAV} pb-12 px-6 overflow-hidden`}>
                <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full border-[42px] border-brand/15 pointer-events-none" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-cream border border-ink/10 px-4 py-1.5 text-xs font-bold text-muted mb-6">
                        <CalendarDays size={13} /> Calendar
                    </span>
                    <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.03] mb-5">
                        Awareness days worth marking
                    </h1>
                    <p className="text-lg md:text-xl text-ink/70 max-w-2xl">
                        A ready-made frame for the days your organisation already cares about. Use one in seconds, or
                        run it as a campaign and share a single link.
                    </p>
                </div>
            </section>

            <section className="px-6 pb-24">
                <div className="max-w-3xl mx-auto space-y-3">
                    {upcoming.map(({ day, occ }) => (
                        <Link
                            key={day.slug}
                            href={`/day/${day.slug}`}
                            className="group bg-cream border border-ink/10 rounded-2xl p-5 flex items-center gap-4 hover:border-brand/40 transition-colors"
                        >
                            <span
                                className="w-11 h-11 rounded-full shrink-0 border-[5px]"
                                style={{ borderColor: day.colors[0]?.hex ?? '#01BEF6' }}
                                aria-hidden="true"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="font-display font-bold truncate">{day.name}</p>
                                <p className="text-xs text-muted truncate">
                                    {formatOccurrence(day, occ)} · {countdownLabel(occ)}
                                </p>
                            </div>
                            <ArrowRight size={18} className="text-muted group-hover:text-brand-deep transition-colors shrink-0" />
                        </Link>
                    ))}
                </div>
                <div className="max-w-3xl mx-auto mt-10">
                    <AdSlot surface="seo" />
                </div>
                <div className="max-w-3xl mx-auto mt-10 text-center">
                    <Link
                        href="/create"
                        className="inline-flex h-12 px-7 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:brightness-105 transition-all"
                    >
                        Create a campaign <ArrowRight size={16} />
                    </Link>
                    <div className="mt-3">
                        <Link
                            href="/explore"
                            className="inline-flex min-h-[44px] px-4 text-sm font-semibold text-muted hover:text-brand-deep transition-colors"
                        >
                            Explore campaigns
                        </Link>
                    </div>
                </div>
            </section>

            <GuidesReadNext />

            <SiteFooter />
        </main>
    );
}
