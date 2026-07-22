import { ArrowRight, Palette, Link2, Users, Check } from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { FAQSection } from "@/components/landing/FAQSection";
import { HomeExamples, HomeCampaign } from "@/components/HomeExamples";
import { FrameConfig } from "@/lib/types";
import { pool } from "@/lib/neon";

export const revalidate = 600;

async function getExampleCampaigns(): Promise<HomeCampaign[]> {
    try {
        const res = await pool.query(
            `SELECT slug, title, frame_config, supporter_count
             FROM campaigns WHERE is_public = true AND is_hidden IS NOT TRUE
             ORDER BY created_at DESC LIMIT 3`
        );
        return res.rows.map((r) => ({
            slug: r.slug,
            title: r.title,
            supporterCount: r.supporter_count ?? 0,
            frame: (typeof r.frame_config === 'string' ? JSON.parse(r.frame_config) : r.frame_config) as FrameConfig,
        }));
    } catch (e) {
        console.error('Failed to load example campaigns', e);
        return [];
    }
}

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
    "No ads, ever",
    "Completely free",
    "Upload your own design",
    "Live supporter counter",
    "Works on any phone",
];

export default async function Home() {
    const examples = await getExampleCampaigns();

    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />

            {/* Hero */}
            <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                {/* Decorative rings, brand motif */}
                <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full border-[42px] border-brand/15 pointer-events-none" />
                <div className="absolute top-28 right-24 w-16 h-16 rounded-full bg-coral/80 pointer-events-none hidden sm:block" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-cream border border-ink/10 px-4 py-1.5 text-xs font-bold text-muted mb-6">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand" /> From collabs, for coming together
                    </span>
                    <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.02] mb-6">
                        Bring your people <span className="text-brand-deep">together.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-ink/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Make a profile-picture frame for your cause, team, or event. Share one link and your people add it to their photo in seconds. Free, no signup, no ads.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link href="/create" className="group h-12 px-7 rounded-xl bg-brand text-ink font-bold flex items-center gap-2 hover:-translate-y-0.5 hover:brightness-105 transition-all">
                            Create a campaign
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        {examples.length > 0 && (
                            <a href="#examples" className="h-12 px-7 rounded-xl bg-transparent border border-ink/15 text-ink font-bold flex items-center hover:bg-ink/5 transition-all">
                                See examples
                            </a>
                        )}
                    </div>
                </div>

                {examples.length > 0 && (
                    <div id="examples" className="max-w-4xl mx-auto mt-20 relative z-10 scroll-mt-24">
                        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted font-bold mb-8">Live campaigns</p>
                        <HomeExamples campaigns={examples} />
                    </div>
                )}
            </section>

            {/* How it works */}
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

            {/* Made for */}
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

            {/* Why Ollabs */}
            <section className="px-6 py-20">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-4">Why Ollabs</h2>
                    <p className="text-center text-ink/70 mb-12">The clean, ad-free alternative to Twibbon.</p>
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

            {/* FAQ */}
            <FAQSection />

            {/* Final CTA */}
            <section className="px-6 py-24">
                <div className="max-w-3xl mx-auto text-center relative">
                    <div className="relative bg-ink text-paper rounded-3xl px-8 py-16 overflow-hidden">
                        <div className="absolute -right-16 -bottom-20 w-64 h-64 rounded-full border-[30px] border-brand/35 pointer-events-none" />
                        <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 relative z-10">Ready to rally your people?</h2>
                        <p className="text-paper/70 mb-8 relative z-10">Make a campaign in under a minute. No account needed.</p>
                        <Link href="/create" className="group inline-flex h-12 px-8 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:-translate-y-0.5 hover:brightness-105 transition-all relative z-10">
                            Create a campaign
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-ink/10 py-16 bg-paper">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
                        <div className="max-w-xs">
                            <img src="/Ollabs Logo Black.png" alt="Ollabs" className="h-7 w-auto mb-4" />
                            <p className="text-muted text-sm leading-relaxed">
                                The fast, ad-free way to run a profile-picture campaign. Ollabs is a play on collabs, because coming together is the whole point.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                            <div>
                                <h5 className="font-display font-bold mb-4">Product</h5>
                                <ul className="space-y-2 text-sm text-muted">
                                    <li><Link href="/create" className="hover:text-brand-deep transition-colors">Create a campaign</Link></li>
                                    <li><Link href="/explore" className="hover:text-brand-deep transition-colors">Explore campaigns</Link></li>
                                    <li><Link href="/for" className="hover:text-brand-deep transition-colors">Use cases</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-display font-bold mb-4">Legal</h5>
                                <ul className="space-y-2 text-sm text-muted">
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
