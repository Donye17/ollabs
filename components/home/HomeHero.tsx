import { ArrowRight } from 'lucide-react';
import { HomeCreateCta } from '@/components/home/HomeCreateCta';
import { HomeResumeLink } from '@/components/home/HomeResumeLink';
import { HomeLiveDemo } from '@/components/home/HomeLiveDemo';
import { getSeoExampleCampaign } from '@/lib/seoExampleCampaign';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

/**
 * First viewport: headline, one working demo, CTAs. The demo uses a real
 * framed face so the product demonstrates itself instead of describing itself.
 */
export async function HomeHero() {
    const example = await getSeoExampleCampaign();
    const lcpPhoto = example?.supporterPhotos[0] ?? null;

    return (
        <section className={`relative ${PAGE_TOP_UNDER_NAV} pb-10 sm:pb-14 px-4 sm:px-6`}>
            {lcpPhoto && (
                // eslint-disable-next-line @next/next/no-head-element
                <link
                    rel="preload"
                    as="image"
                    href={lcpPhoto}
                    fetchPriority="high"
                />
            )}
            <div className="max-w-5xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
                <div className="lg:col-span-6 text-center lg:text-left">
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.02] mb-4 sm:mb-5 text-balance">
                        Bring your people <span className="text-brand-deep">together.</span>
                    </h1>
                    <p className="text-[15px] sm:text-lg text-ink/70 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Make a profile-picture frame for your cause, team, or event. Share one link and your people add it to their photo in seconds. Free, no signup, no watermark.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 mb-8 lg:mb-0">
                        <HomeCreateCta
                            className="h-12 px-7 rounded-xl bg-brand text-ink font-bold inline-flex items-center gap-2 hover:brightness-105 transition-all"
                        >
                            Create a campaign
                            <ArrowRight className="w-4 h-4" />
                        </HomeCreateCta>
                        <HomeResumeLink />
                    </div>
                </div>

                {lcpPhoto && example && (
                    <div className="lg:col-span-6 mt-2 lg:mt-0">
                        <HomeLiveDemo faceUrl={lcpPhoto} supporterCount={example.supporterCount} />
                    </div>
                )}
            </div>
        </section>
    );
}
