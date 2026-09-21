import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { ExamplesSkeleton } from "@/components/home/ExamplesSkeleton";
import { HomeExamplesSection } from "@/components/home/HomeExamplesSection";
import { HomeHowItWorks } from "@/components/home/HomeHowItWorks";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeBottomCta, HomeMarketingCopy } from "@/components/home/HomeMarketingCopy";
import { BrandMark } from "@/components/BrandMark";
import { HOME_FAQS } from "@/lib/faqs";

export const revalidate = 600;

/** Homepage-only canonical. Root layout no longer sets one so /create etc. do not inherit it. */
export const metadata: Metadata = {
    alternates: {
        canonical: "https://ollabs.studio",
        languages: {
            en: "https://ollabs.studio",
            "pt-BR": "https://ollabs.studio/pt",
            "x-default": "https://ollabs.studio",
        },
    },
};

const FAQSection = dynamic(
    () => import("@/components/landing/FAQSection").then((m) => ({ default: m.FAQSection })),
    { loading: () => <div className="h-80 bg-paper2/50" aria-hidden /> }
);

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
        },
    })),
};

export default function Home() {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <NavBar isHome />

            <HomeHero />

            <section className="pb-12 sm:pb-16">
                <Suspense fallback={
                    <div className="relative z-10 max-w-lg mx-auto px-5">
                        <p className="font-display text-center text-2xl font-bold tracking-tight mb-8">Top campaigns</p>
                        <ExamplesSkeleton />
                    </div>
                }>
                    <HomeExamplesSection />
                </Suspense>
            </section>

            <HomeHowItWorks />

            <HomeMarketingCopy />

            <FAQSection />

            <HomeBottomCta />

            <footer className="border-t border-ink/10 py-16 bg-paper">
                <div className="max-w-lg mx-auto px-5">
                    <div className="flex flex-col items-start gap-12 mb-12">
                        <div>
                            <BrandMark href={null} size={28} className="mb-4" />
                            <p className="font-sans text-muted text-[15px] leading-relaxed">
                                The fast way to run a profile-picture campaign. Ollabs is a play on collabs, because coming together is the whole point.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-10 w-full">
                            <div>
                                <h5 className="font-display font-bold mb-4">Product</h5>
                                <ul className="space-y-2 font-sans text-[15px] text-muted leading-relaxed">
                                    <li><Link href="/create" className="hover:text-brand-deep transition-colors">Create a campaign</Link></li>
                                    <li><Link href="/explore" className="hover:text-brand-deep transition-colors">Explore campaigns</Link></li>
                                    <li><Link href="/mine" className="hover:text-brand-deep transition-colors">My campaigns</Link></li>
                                    <li><Link href="/hub" className="hover:text-brand-deep transition-colors">Your hub</Link></li>
                                    <li><Link href="/updates" className="hover:text-brand-deep transition-colors">What&apos;s new</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-display font-bold mb-4">
                                    <Link href="/guides" className="hover:text-brand-deep transition-colors">Guides</Link>
                                </h5>
                                <ul className="space-y-2 font-sans text-[15px] text-muted leading-relaxed">
                                    <li><Link href="/guides/run-a-campaign-people-join" className="hover:text-brand-deep transition-colors">Campaigns people join</Link></li>
                                    <li><Link href="/guides/start-a-campaign" className="hover:text-brand-deep transition-colors">Start a campaign</Link></li>
                                    <li><Link href="/guides/hub" className="hover:text-brand-deep transition-colors">What is a hub?</Link></li>
                                    <li><Link href="/guides" className="hover:text-brand-deep transition-colors">All guides</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-display font-bold mb-4">Discover</h5>
                                <ul className="space-y-2 font-sans text-[15px] text-muted leading-relaxed">
                                    <li><Link href="/day" className="hover:text-brand-deep transition-colors">Calendar moments</Link></li>
                                    <li><Link href="/vs/twibbonize" className="hover:text-brand-deep transition-colors">Twibbonize alternative</Link></li>
                                    <li><Link href="/for" className="hover:text-brand-deep transition-colors">Use cases</Link></li>
                                    <li className="flex flex-wrap gap-x-2 gap-y-1 pt-1">
                                        <Link href="/pt" className="hover:text-brand-deep transition-colors">Português</Link>
                                        <Link href="/hi" className="hover:text-brand-deep transition-colors">हिन्दी</Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-display font-bold mb-4">Legal</h5>
                                <ul className="space-y-2 font-sans text-[15px] text-muted leading-relaxed">
                                    <li><Link href="/about" className="hover:text-brand-deep transition-colors">About</Link></li>
                                    <li><Link href="/contact" className="hover:text-brand-deep transition-colors">Contact</Link></li>
                                    <li><Link href="/privacy" className="hover:text-brand-deep transition-colors">Privacy</Link></li>
                                    <li><Link href="/terms" className="hover:text-brand-deep transition-colors">Terms</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-ink/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans text-xs text-muted">
                        <p>&copy; 2026 Ollabs. All rights reserved.</p>
                        <p>Bring your people together.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
