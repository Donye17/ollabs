import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { ExamplesSkeleton } from "@/components/home/ExamplesSkeleton";
import { HomeExamplesSection } from "@/components/home/HomeExamplesSection";
import { HomeCalendarSection } from "@/components/home/HomeCalendarSection";
import { HomeHowItWorks } from "@/components/home/HomeHowItWorks";
import { HomeHero } from "@/components/home/HomeHero";
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
            id: "https://ollabs.studio/id",
            tl: "https://ollabs.studio/tl",
            hi: "https://ollabs.studio/hi",
            es: "https://ollabs.studio/es",
            "x-default": "https://ollabs.studio",
        },
    },
};

const FAQSection = dynamic(
    () => import("@/components/landing/FAQSection").then((m) => ({ default: m.FAQSection })),
    { loading: () => <div className="h-80 bg-paper2/50" aria-hidden /> }
);

const audiences = [
    { label: "Fundraisers", href: "/for/fundraisers" },
    { label: "Nonprofits", href: "/for/nonprofits" },
    { label: "Sports teams", href: "/for/sports-teams" },
    { label: "Churches", href: "/for/churches" },
    { label: "Schools", href: "/for/schools" },
    { label: "Events", href: "/for/events" },
];

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
            <NavBar />

            <Suspense fallback={
                <section className="pt-[calc(3.5rem+env(safe-area-inset-top,0px)+1.25rem)] sm:pt-28 pb-10 px-4">
                    <div className="max-w-5xl mx-auto h-64 animate-pulse rounded-2xl bg-ink/5" aria-hidden />
                </section>
            }>
                <HomeHero />
            </Suspense>

            <section className="px-4 sm:px-6 pb-12 sm:pb-16">
                <Suspense fallback={
                    <div className="relative z-10">
                        <p className="text-center text-sm text-muted font-semibold mb-8">Top campaigns</p>
                        <ExamplesSkeleton />
                    </div>
                }>
                    <HomeExamplesSection />
                </Suspense>
            </section>

            <Suspense fallback={<div className="h-[360px]" aria-hidden />}>
                <HomeCalendarSection />
            </Suspense>

            <HomeHowItWorks />

            <section className="px-6 py-14 border-t border-ink/10">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-sm text-muted font-semibold mb-4">Made for</p>
                    <p className="text-[15px] text-ink/80 leading-relaxed">
                        {audiences.map((a, i) => (
                            <span key={a.href}>
                                {i > 0 && <span className="text-muted/50 mx-1.5">·</span>}
                                <Link href={a.href} className="font-medium text-ink hover:text-brand-deep transition-colors">
                                    {a.label}
                                </Link>
                            </span>
                        ))}
                    </p>
                    <div className="mt-5">
                        <Link href="/for" className="text-sm font-semibold text-brand-deep hover:underline">
                            See all use cases
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-6 py-16 border-t border-ink/10">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Free for supporters</h2>
                    <p className="text-ink/70 leading-relaxed">
                        No signup, no watermark, no paywall. Upload your own frame art, share one link, and watch the counter climb.
                    </p>
                </div>
            </section>

            <FAQSection />

            <section className="px-6 py-20 border-t border-ink/10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Make a frame</h2>
                    <p className="text-ink/70 mb-8">Takes under a minute. No account needed.</p>
                    <Link href="/create" className="inline-flex h-12 px-8 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:brightness-105 transition-all">
                        Create a campaign
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            <footer className="border-t border-ink/10 py-16 bg-paper">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
                        <div className="max-w-xs">
                            <BrandMark href={null} size={28} className="mb-4" />
                            <p className="text-muted text-sm leading-relaxed">
                                The fast way to run a profile-picture campaign. Ollabs is a play on collabs, because coming together is the whole point.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
                            <div>
                                <h5 className="font-display font-bold mb-4">Product</h5>
                                <ul className="space-y-2 text-sm text-muted">
                                    <li><Link href="/create" className="hover:text-brand-deep transition-colors">Create a campaign</Link></li>
                                    <li><Link href="/explore" className="hover:text-brand-deep transition-colors">Explore campaigns</Link></li>
                                    <li><Link href="/mine" className="hover:text-brand-deep transition-colors">My campaigns</Link></li>
                                    <li><Link href="/for" className="hover:text-brand-deep transition-colors">Use cases</Link></li>
                                    <li><Link href="/guides/start-a-campaign" className="hover:text-brand-deep transition-colors">Start a campaign</Link></li>
                                    <li><Link href="/guides/hub" className="hover:text-brand-deep transition-colors">What is a hub?</Link></li>
                                    <li><Link href="/updates" className="hover:text-brand-deep transition-colors">What&apos;s new</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-display font-bold mb-4">Discover</h5>
                                <ul className="space-y-2 text-sm text-muted">
                                    <li><Link href="/day" className="hover:text-brand-deep transition-colors">Calendar moments</Link></li>
                                    <li><Link href="/vs/twibbonize" className="hover:text-brand-deep transition-colors">Twibbonize alternative</Link></li>
                                    <li><Link href="/for" className="hover:text-brand-deep transition-colors">Use cases</Link></li>
                                    <li className="flex flex-wrap gap-x-2 gap-y-1 pt-1">
                                        <Link href="/pt" className="hover:text-brand-deep transition-colors">Português</Link>
                                        <Link href="/id" className="hover:text-brand-deep transition-colors">Bahasa</Link>
                                        <Link href="/es" className="hover:text-brand-deep transition-colors">Español</Link>
                                        <Link href="/tl" className="hover:text-brand-deep transition-colors">Tagalog</Link>
                                        <Link href="/hi" className="hover:text-brand-deep transition-colors">हिन्दी</Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-display font-bold mb-4">Legal</h5>
                                <ul className="space-y-2 text-sm text-muted">
                                    <li><Link href="/about" className="hover:text-brand-deep transition-colors">About</Link></li>
                                    <li><Link href="/privacy" className="hover:text-brand-deep transition-colors">Privacy</Link></li>
                                    <li><Link href="/terms" className="hover:text-brand-deep transition-colors">Terms</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-ink/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
                        <p>&copy; 2026 Ollabs. All rights reserved.</p>
                        <p>Bring your people together.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
