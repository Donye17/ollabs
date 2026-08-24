import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { ArrowRight, Palette, Link2, Users, Check } from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { ExamplesSkeleton } from "@/components/home/ExamplesSkeleton";
import { HomeExamplesSection } from "@/components/home/HomeExamplesSection";
import { HomeCalendarSection } from "@/components/home/HomeCalendarSection";
import { HomeCreateCta } from "@/components/home/HomeCreateCta";
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

const steps = [
    { icon: Palette, title: "Make a frame", body: "Pick a clean style or upload your own design: a logo, colors, a slogan." },
    { icon: Link2, title: "Share one link", body: "Post it anywhere. One link is all your people need." },
    { icon: Users, title: "They add it", body: "They drop in a photo, download it framed, and your counter ticks up." },
];

const audiences = [
    { label: "Fundraisers", href: "/for/fundraisers" },
    { label: "Nonprofits", href: "/for/nonprofits" },
    { label: "Sports teams", href: "/for/sports-teams" },
    { label: "Churches", href: "/for/churches" },
    { label: "Schools", href: "/for/schools" },
    { label: "Events", href: "/for/events" },
];

const reasons = [
    "No signup required",
    "No watermark, ever",
    "Supporters never pay",
    "Upload your own design",
    "Live supporter counter",
    "Works on any phone",
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

            {/* Hero stays type + CTA only. Decorative rings and a coral blob
                used to sit behind this copy; they read as template chrome and
                fight the framed photos in Top campaigns. Top campaigns stays
                in the next section so overflow cannot cut podium titles. */}
            <section className="relative pt-[calc(3.5rem+env(safe-area-inset-top,0px)+1.25rem)] sm:pt-32 pb-10 sm:pb-14 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-cream border border-ink/10 px-4 py-1.5 text-xs font-bold text-muted mb-5">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand" /> From collabs, for coming together
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.02] mb-4 sm:mb-6 text-balance">
                        Bring your people <span className="text-brand-deep">together.</span>
                    </h1>
                    <p className="text-[15px] sm:text-lg md:text-xl text-ink/70 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                        Make a profile-picture frame for your cause, team, or event. Share one link and your people add it to their photo in seconds. Free, no signup, no watermark.
                    </p>
                    <div className="flex flex-col items-center gap-3">
                        <HomeCreateCta
                            className="group h-12 px-7 rounded-xl bg-brand text-ink font-bold inline-flex items-center gap-2 hover:-translate-y-0.5 hover:brightness-105 transition-all"
                        >
                            Create a campaign
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </HomeCreateCta>
                        <div className="flex items-center justify-center">
                            <Link
                                href="/mine"
                                className="min-h-[44px] px-4 rounded-xl border border-ink/15 bg-cream text-ink text-sm font-bold inline-flex items-center hover:bg-ink/5 transition-colors"
                            >
                                My campaigns
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 pb-12 sm:pb-16">
                <Suspense fallback={
                    <div className="relative z-10">
                        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted font-bold mb-8">Top campaigns</p>
                        <ExamplesSkeleton />
                    </div>
                }>
                    <HomeExamplesSection />
                </Suspense>
            </section>

            <Suspense fallback={<div className="h-[360px]" aria-hidden />}>
                <HomeCalendarSection />
            </Suspense>

            <section className="px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-14">How it works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {steps.map((s, i) => (
                            <div key={i} className="bg-cream border border-ink/10 rounded-2xl p-7 text-center">
                                <div className="w-12 h-12 rounded-xl bg-brand/15 flex items-center justify-center mx-auto mb-4">
                                    <s.icon className="w-6 h-6 text-brand-deep" />
                                </div>
                                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Step {i + 1}</p>
                                <h3 className="font-display text-lg font-bold mb-2">{s.title}</h3>
                                <p className="text-sm text-ink/70 leading-relaxed">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 py-14">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted font-bold mb-6">Made for</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {audiences.map((a) => (
                            <Link key={a.href} href={a.href} className="px-4 py-2 rounded-full bg-brand/12 border border-brand/30 text-brand-deep text-sm font-semibold hover:bg-brand/20 transition-colors">{a.label}</Link>
                        ))}
                    </div>
                    <div className="mt-6">
                        <Link href="/for" className="text-sm font-semibold text-brand-deep hover:underline">See all the ways people use Ollabs</Link>
                    </div>
                </div>
            </section>

            <section className="px-6 py-20">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-4">Why Ollabs</h2>
                    <p className="text-center text-ink/70 mb-12">The clean alternative to Twibbon. Your supporters never pay and never get a watermark.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {reasons.map((r) => (
                            <div key={r} className="flex items-center gap-3 bg-cream border border-ink/10 rounded-xl px-5 py-4">
                                <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4 text-brand-deep" />
                                </div>
                                <span className="text-ink font-medium">{r}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FAQSection />

            <section className="px-6 py-24">
                <div className="max-w-3xl mx-auto text-center relative">
                    <div className="bg-ink text-paper rounded-3xl px-8 py-16">
                        <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4">Ready to rally your people?</h2>
                        <p className="text-paper/70 mb-8">Make a campaign in under a minute. No account needed.</p>
                        <Link href="/create" className="group inline-flex h-12 px-8 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:-translate-y-0.5 hover:brightness-105 transition-all">
                            Create a campaign
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
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
