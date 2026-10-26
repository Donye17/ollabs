import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { ExamplesSkeleton } from "@/components/home/ExamplesSkeleton";
import { FaqSkeleton } from "@/components/home/FaqSkeleton";
import { HomeExamplesSection, HomeHeroProof } from "@/components/home/HomeExamplesSection";
import { HomeHowItWorks } from "@/components/home/HomeHowItWorks";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeBottomCta } from "@/components/home/HomeMarketingCopy";
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
    { loading: () => <FaqSkeleton /> }
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
            <link rel="preload" as="image" href="/hero/photo-01.jpg" />
            <link rel="preload" as="image" href="/hero/photo-02.jpg" />
            <link rel="preload" as="image" href="/hero/photo-03.jpg" />
            <link rel="preload" as="image" href="/hero/frames/hugo.png" />
            <link rel="preload" as="image" href="/hero/frames/valkyries.png" />
            <link rel="preload" as="image" href="/hero/frames/pitagoras.png" />

            <NavBar isHome />

            <HomeHero
                proof={(
                    <Suspense fallback={null}>
                        <HomeHeroProof />
                    </Suspense>
                )}
            />

            <HomeHowItWorks />

            <section className="border-y border-ink/10 bg-paper2 py-8">
                <Suspense fallback={
                    <div className="relative z-10 mx-auto max-w-lg px-5" aria-busy="true" aria-live="polite">
                        <span className="sr-only">Loading</span>
                        <ExamplesSkeleton />
                    </div>
                }>
                    <HomeExamplesSection />
                </Suspense>
            </section>

            <FAQSection />

            <HomeBottomCta />

            <footer className="border-t border-ink/10 bg-paper py-8">
                <div className="mx-auto max-w-5xl px-5">
                    <div className="mb-6">
                        <BrandMark href={null} size={28} className="mb-2" />
                        <p className="max-w-sm font-sans text-sm leading-relaxed text-ink/80">
                            The fast way to run a profile-picture campaign. Ollabs is a play on collabs, because coming together is the whole point.
                        </p>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4 lg:gap-y-0">
                            <div className="min-w-0">
                                <h5 className="font-display font-bold mb-2">Product</h5>
                                <ul className="font-sans text-sm leading-relaxed text-ink/80">
                                    <li><Link href="/create" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Create a campaign</Link></li>
                                    <li><Link href="/explore" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Explore campaigns</Link></li>
                                    <li><Link href="/mine" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">My campaigns</Link></li>
                                    <li><Link href="/hub" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Your hub</Link></li>
                                    <li><Link href="/updates" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">What&apos;s new</Link></li>
                                </ul>
                            </div>
                            <div className="min-w-0">
                                <h5 className="font-display font-bold mb-2">
                                    <Link href="/guides" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Guides</Link>
                                </h5>
                                <ul className="font-sans text-sm leading-relaxed text-ink/80">
                                    <li><Link href="/guides/add-a-frame-to-a-profile-picture" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Add a frame to a photo</Link></li>
                                    <li><Link href="/guides/run-a-campaign-people-join" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Campaigns people join</Link></li>
                                    <li><Link href="/guides/start-a-campaign" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Start a campaign</Link></li>
                                    <li><Link href="/guides/hub" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">What is a hub?</Link></li>
                                    <li><Link href="/guides" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">All guides</Link></li>
                                </ul>
                            </div>
                            <div className="min-w-0">
                                <h5 className="font-display font-bold mb-2">Discover</h5>
                                <ul className="font-sans text-sm leading-relaxed text-ink/80">
                                    <li><Link href="/day" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Calendar moments</Link></li>
                                    <li><Link href="/vs/twibbonize" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Twibbonize alternative</Link></li>
                                    <li><Link href="/for" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Use cases</Link></li>
                                    <li className="flex flex-wrap gap-x-2 gap-y-1">
                                        <Link href="/pt" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Português</Link>
                                        <Link href="/hi" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">हिन्दी</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="min-w-0">
                                <h5 className="font-display font-bold mb-2">Legal</h5>
                                <ul className="font-sans text-sm leading-relaxed text-ink/80">
                                    <li><Link href="/about" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">About</Link></li>
                                    <li><Link href="/contact" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Contact</Link></li>
                                    <li><Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Privacy</Link></li>
                                    <li><Link href="/terms" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">Terms</Link></li>
                                </ul>
                            </div>
                    </div>

                    <div className="mt-6 flex flex-col items-start justify-between gap-2 border-t border-ink/10 pt-4 font-sans text-xs text-ink/80 sm:flex-row sm:items-center">
                        <p>&copy; 2026 Ollabs. All rights reserved.</p>
                        <p>Bring your people together.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
