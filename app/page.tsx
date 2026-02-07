import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { HomeClient } from "@/components/HomeClient";
import { pool } from "@/lib/neon";
import { PublishedFrame } from "@/components/FrameCard";
import { MissionSection } from "@/components/landing/MissionSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { FAQSection } from "@/components/landing/FAQSection";



async function getTrendingFrames() {
    try {
        const result = await pool.query(`
            SELECT f.*, 
            (SELECT COUNT(*) FROM frame_likes WHERE frame_id = f.id) as likes_count
            FROM frames f 
            WHERE f.is_public = true AND f.created_at > NOW() - INTERVAL '7 days'
            ORDER BY likes_count DESC, f.created_at DESC 
            LIMIT 4
        `);

        return result.rows.map((row) => ({
            ...row,
            config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
            likes_count: parseInt(row.likes_count || '0'),
            liked_by_user: false,
            created_at: new Date(row.created_at).toISOString()
        })) as PublishedFrame[];
    } catch (e) {
        console.error("Failed to fetch trending frames", e);
        return [];
    }
}

// Revalidate every hour
export const revalidate = 3600;

export default async function Home() {
    const trendingFrames = await getTrendingFrames();

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-blue-500/30 relative">
            <NavBar />

            {/* Global Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Hero Section */}
            <section className="relative pt-32 pb-12 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none opacity-50" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none opacity-30" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-white/10 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-zinc-300">v2.0 Now Available</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 animate-slide-up">
                        Free Avatar Frame <br /> & PFP Border Maker
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
                        The #1 <strong>Profile Picture Border Maker</strong>. Customize, remix, and share amazing PFP overlays for Discord, Twitter, and social media.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <Link
                            href="/create"
                            className="group h-12 px-8 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue-500/25"
                        >
                            Start Creating
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/gallery"
                            className="h-12 px-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium flex items-center border-white/5 hover:bg-zinc-800 hover:text-white transition-all backdrop-blur-sm"
                        >
                            View Gallery
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission Section - Compact Banner */}
            <div className="relative z-10 border-y border-white/5 bg-zinc-900/30 backdrop-blur-sm">
                <MissionSection />
            </div>

            {/* Gallery Section */}
            <section className="px-6 py-16 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <HomeClient initialFrames={[]} initialTrendingFrames={trendingFrames} viewMode="trending-only" />
                </div>
            </section>

            {/* About Section */}
            <AboutSection />

            {/* FAQ Section */}
            <FAQSection />

            {/* Footer */}
            <footer className="border-t border-white/5 py-16 bg-zinc-950 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
                        <div className="max-w-xs">
                            <h4 className="text-2xl font-bold text-white mb-4">Ollabs</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                The open-source design tool for everyone.
                                Built with privacy and performance in mind.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                            <div>
                                <h5 className="font-bold text-white mb-4">Product</h5>
                                <ul className="space-y-2 text-sm text-zinc-500">
                                    <li><Link href="/create" className="hover:text-blue-400 transition-colors">Editor</Link></li>
                                    <li><Link href="/gallery" className="hover:text-blue-400 transition-colors">Gallery</Link></li>
                                    <li><Link href="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
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
                        <p>Designed for the Community.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
