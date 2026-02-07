import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { HomeClient } from "@/components/HomeClient";
import { pool } from "@/lib/neon";
import { PublishedFrame } from "@/components/FrameCard";
import { MissionSection } from "@/components/landing/MissionSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { FAQSection } from "@/components/landing/FAQSection";

async function getInitialFrames() {
    try {
        const result = await pool.query(`
            SELECT f.*, 
            (SELECT COUNT(*) FROM frame_likes WHERE frame_id = f.id) as likes_count
            FROM frames f 
            WHERE f.is_public = true 
            ORDER BY f.created_at DESC 
            LIMIT 50
        `);

        return result.rows.map((row) => ({
            ...row,
            config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
            likes_count: parseInt(row.likes_count || '0'),
            liked_by_user: false,
            created_at: new Date(row.created_at).toISOString()
        })) as PublishedFrame[];
    } catch (e) {
        console.error("Failed to fetch initial frames", e);
        return [];
    }
}

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
    const [initialFrames, trendingFrames] = await Promise.all([
        getInitialFrames(),
        getTrendingFrames()
    ]);

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-blue-500/30">
            <NavBar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none opacity-50" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none opacity-30" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-white/10 px-4 py-1.5 rounded-full mb-8 backdrop-blur-md animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-zinc-300">v2.0 Now Available</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 animate-slide-up">
                        Free Avatar Frame <br /> & PFP Border Maker
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
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

            {/* Mission Section */}
            <MissionSection />

            {/* Gallery Section */}
            <section className="px-6 py-20 border-t border-white/5 bg-zinc-900/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <HomeClient initialFrames={initialFrames} initialTrendingFrames={trendingFrames} />
                </div>
            </section>

            {/* About Section */}
            <AboutSection />

            {/* FAQ Section */}
            <FAQSection />

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-sm">
                    <p>© 2026 Ollabs. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
            {/* SEO Content Block */}
            <section className="px-6 py-12 border-t border-white/5 bg-zinc-950">
                <div className="max-w-4xl mx-auto space-y-12 text-zinc-400">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white font-heading">The Best Free Profile Picture Border Maker</h2>
                        <p>
                            Ollabs is the ultimate <strong>avatar frame creator</strong> and <strong>PFP border maker</strong>. Whether you need a
                            Discord profile border, a cool Instagram story ring, or a custom Twitter NFT-style frame, our free tool makes it instant
                            and easy. No login required—just upload, customize, and download.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">How to make a custom Discord profile border?</h3>
                            <p className="text-sm leading-relaxed">
                                Simply upload your profile picture to Ollabs, choose from thousands of community-made frames or design your own
                                using our powerful editor. Add neon glows, text, and stickers, then download the transparent PNG to use on Discord.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Is this PFP maker free?</h3>
                            <p className="text-sm leading-relaxed">
                                Yes! Ollabs is 100% free to use. You can create unlimited <strong>custom avatar frames</strong> and download them
                                in high quality without any watermarks.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
