import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HomeCreateCta } from '@/components/home/HomeCreateCta';
import { SeoCampaignExample } from '@/components/seo/SeoCampaignExample';
import { getSeoExampleCampaign } from '@/lib/seoExampleCampaign';

/**
 * First viewport: headline, one line, one CTA, and on desktop a real framed
 * campaign beside the copy (product as hero, not decorative rings).
 */
export async function HomeHero() {
    const example = await getSeoExampleCampaign();

    return (
        <section className="relative pt-[calc(3.5rem+env(safe-area-inset-top,0px)+1.25rem)] sm:pt-28 lg:pt-32 pb-10 sm:pb-14 px-4 sm:px-6">
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
                        <Link
                            href="/mine"
                            className="min-h-[44px] px-4 text-sm font-semibold text-muted hover:text-brand-deep transition-colors inline-flex items-center"
                        >
                            My campaigns
                        </Link>
                    </div>
                </div>

                {example && (
                    <div className="lg:col-span-6 mt-10 lg:mt-0 flex justify-center lg:justify-end">
                        <SeoCampaignExample campaign={example} size={280} />
                    </div>
                )}
            </div>
        </section>
    );
}
