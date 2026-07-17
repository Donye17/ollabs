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
             FROM campaigns WHERE is_public = true
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
    { icon: Palette, title: "Design a frame", body: "Pick a clean style or upload your own brand design — logo, colors, slogan." },
    { icon: Link2, title: "Share one link", body: "Post it anywhere. One link is all your supporters need." },
    { icon: Users, title: "Supporters add it", body: "They drop in a photo, download it framed, and your counter ticks up." },
];

const audiences = ["Causes", "Sports teams", "Events", "Fundraisers", "Communities", "Brands"];

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
        <main className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-blue-500/30 relative">
            <NavBar />

            {/* Global Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Hero */}
            <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none opacity-50" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none opacity-30" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 text-white select-none">
                        Rally your people, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">one link</span>
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Create a profile-picture frame for your cause, team, or event. Share one link and supporters add it to their photo in seconds. No signup, no ads.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/create" className="group h-12 px-8 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue-500/25">
                            Create a campaign
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {examples.length > 0 && (
                    <div className="max-w-4xl mx-auto mt-20 relative z-10">
                        <p className="text-center text-xs uppercase tracking-widest text-zinc-500 mb-8">Live campaigns</p>
                        <HomeExamples campaigns={examples} />
                    </div>
                )}
            </section>

            {/* How it works */}
            <section className="px-6 py-20 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-14">How it works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {steps.map((s, i) => (
                            <div key={i} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 text-center">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                    <s.icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <p className="text-xs font-bold text-zinc-600 mb-1">STEP {i + 1}</p>
                                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Made for */}
            <section className="px-6 py-14 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xs uppercase tracking-widest text-zinc-500 mb-6">Made for</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {audiences.map((a) => (
                            <span key={a} className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm font-medium">{a}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Ollabs */}
            <section className="px-6 py-20 relative z-10">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Why Ollabs</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {reasons.map((r) => (
                            <div key={r} className="flex items-center gap-3 bg-zinc-900/40 border border-white/5 rounded-xl px-5 py-4">
                                <div className="w-6 h-6 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4 text-green-400" />
                                </div>
                                <span className="text-zinc-200 font-medium">{r}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <FAQSection />

            {/* Final CTA */}
            <section className="px-6 py-24 relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to rally your people?</h2>
                    <p className="text-zinc-400 mb-8">Make a campaign in under a minute. No account needed.</p>
                    <Link href="/create" className="group inline-flex h-12 px-8 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue-500/25">
                        Create a campaign
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-16 bg-zinc-950 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
                        <div className="max-w-xs">
                            <h4 className="text-2xl font-bold text-white mb-4">Ollabs</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                The fast, ad-free way to run a profile-picture campaign. Built with privacy and performance in mind.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                            <div>
                                <h5 className="font-bold text-white mb-4">Product</h5>
                                <ul className="space-y-2 text-sm text-zinc-500">
                                    <li><Link href="/create" className="hover:text-blue-400 transition-colors">Create a campaign</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-bold text-white mb-4">Legal</h5>
                                <ul className="space-y-2 text-sm text-zinc-500">
                                    <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link></li>
                                    <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
                        <p>© 2026 Ollabs. All rights reserved.</p>
                        <p>Made for the crowd.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
