import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import { HomeCreateCta } from '@/components/home/HomeCreateCta';
import { HomeResumeLink } from '@/components/home/HomeResumeLink';
import { getSeoExampleCampaign } from '@/lib/seoExampleCampaign';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

/**
 * First viewport: headline, one line, CTAs. The live frame proof sits on
 * desktop only. On phones it was the LCP element (~3.7s lab) while sitting
 * below the CTA; Top campaigns below still shows real frames when scrolled.
 */
export async function HomeHero() {
    const example = await getSeoExampleCampaign();
    const lcpPhoto = example?.supporterPhotos[0] ?? null;

    return (
        <section className={`relative ${PAGE_TOP_UNDER_NAV} pb-10 sm:pb-14 px-4 sm:px-6`}>
            {lcpPhoto && (
                // Early discoverability for desktop LCP (hidden on phones via CSS below).
                // eslint-disable-next-line @next/next/no-head-element
                <link rel="preload" as="image" href={lcpPhoto} fetchPriority="high" />
            )}
            <div className="max-w-5xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
                <div className="lg:col-span-6 text-center lg:text-left">
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.02] mb-4 sm:mb-5 text-balance">
                        Bring your people <span className="text-brand-deep">together.</span>
                    </h1>
                    <p className="text-[15px] sm:text-lg text-ink/70 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Make a profile-picture frame for your cause, team, or event. Share one link and your people add it to their photo in seconds. Free, no signup, no watermark.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3">
                        <HomeCreateCta
                            className="h-12 px-7 rounded-xl bg-brand text-ink font-bold inline-flex items-center gap-2 hover:brightness-105 transition-all"
                        >
                            Create a campaign
                            <ArrowRight className="w-4 h-4" />
                        </HomeCreateCta>
                        <HomeResumeLink />
                    </div>
                </div>

                {example && lcpPhoto && (
                    <div className="hidden lg:col-span-6 lg:mt-0 lg:flex justify-end">
                        <Link
                            href={`/c/${example.slug}`}
                            className="group flex flex-col items-center gap-3"
                        >
                            <div
                                className="rounded-full overflow-hidden bg-cream border border-ink/10 shrink-0 frame-shadow"
                                style={{ width: 280, height: 280 }}
                            >
                                {/* Server-rendered LCP img so it is in the first HTML byte stream. */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={lcpPhoto}
                                    alt=""
                                    width={280}
                                    height={280}
                                    className="w-full h-full object-cover"
                                    fetchPriority="high"
                                    decoding="async"
                                />
                            </div>
                            <div className="text-center min-w-0 max-w-[16rem]">
                                <p className="font-display font-bold text-[15px] text-ink group-hover:text-brand-deep transition-colors truncate">
                                    {example.title}
                                </p>
                                <p className="text-xs text-muted flex items-center justify-center gap-1 mt-0.5">
                                    <Users size={12} />
                                    {example.supporterCount.toLocaleString()} supporters
                                </p>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
