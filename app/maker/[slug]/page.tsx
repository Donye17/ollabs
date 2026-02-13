
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { HomeClient } from "@/components/HomeClient";
import { FAQSection } from "@/components/landing/FAQSection";
import { pool } from "@/lib/neon";
import { PublishedFrame } from "@/components/FrameCard";

// --- Configuration ---
interface SeoPageConfig {
    title: string;
    description: string;
    heroTitle: string;
    heroTitleHighlight: string;
    heroDescription: string;
    tags: string[]; // Tags to filter gallery by
    gradientFrom: string;
    gradientTo: string;
}

const seoPages: Record<string, SeoPageConfig> = {
    "discord-pfp": {
        title: "Discord PFP Maker | Create Custom Anime & Gaming Avatars",
        description: "Free Discord PFP maker. Add borders, effects, and animated frames to your Discord profile picture. Stand out in servers with a custom avatar.",
        heroTitle: "Discord PFP",
        heroTitleHighlight: "Maker",
        heroDescription: "Create the perfect Discord avatar in seconds. Add nitro-style rings, glitches, and anime effects to stand out in every server.",
        tags: ["discord", "gaming", "anime", "glitch"],
        gradientFrom: "from-indigo-500",
        gradientTo: "to-blue-600"
    },
    "instagram-profile-border": {
        title: "Instagram Profile Border | Aesthetic PFP Rings",
        description: "Add a colorful ring to your Instagram profile picture. Get more story views with a custom gradient border.",
        heroTitle: "Instagram Profile",
        heroTitleHighlight: "Borders",
        heroDescription: "Make your stories pop with a custom profile ring. The easiest way to get more attention on your feed.",
        tags: ["instagram", "aesthetic", "ring", "gradient", "minimal"],
        gradientFrom: "from-pink-500",
        gradientTo: "to-orange-500"
    },
    "laser-eyes-maker": {
        title: "Laser Eyes Maker | Crypto & Meme PFPs",
        description: "Add glowing laser eyes to your photo instantly. The best free laser eyes meme generator for Twitter and crypto profiles.",
        heroTitle: "Laser Eyes",
        heroTitleHighlight: "Maker",
        heroDescription: "Join the movement. Add customizable laser eyes to your PFP in one click. Fully adjustable glow, color, and position.",
        tags: ["laser", "crypto", "meme", "bitcoin", "eyes"],
        gradientFrom: "from-red-500",
        gradientTo: "to-orange-500"
    },
    "twitter-header-maker": { // Placeholder for future expansion mentioned in task
        title: "Twitter Header Maker | Custom Banners",
        description: "Create professional Twitter headers that match your PFP. unified branding for your X profile.",
        heroTitle: "Twitter Header",
        heroTitleHighlight: "Maker",
        heroDescription: "Design a header that perfectly matches your vibe. (Coming Soon - Explore related frames below)",
        tags: ["twitter", "header", "banner", "x"],
        gradientFrom: "from-blue-400",
        gradientTo: "to-sky-300"
    }
};

// --- Data Fetching ---
async function getFramesByTags(tags: string[]) {
    if (!tags.length) return [];

    try {
        // Fetch frames that match ANY of the tags (OR logic) or specific overlap?
        // Let's use array overlap operator && for "contains" or just text search for broader results.
        // Best approach: Filter where 'tags' array has any overlap with our seo tags.
        // Postgres: tags && ARRAY['tag1', 'tag2']

        const queryText = `
            SELECT f.*, 
            (SELECT COUNT(*) FROM frame_likes WHERE frame_id = f.id) as real_likes_count
            FROM frames f 
            WHERE f.is_public = true 
            AND f.tags && $1::text[]
            ORDER BY real_likes_count DESC, f.created_at DESC 
            LIMIT 24
        `;

        const result = await pool.query(queryText, [tags]);

        return result.rows.map((row) => ({
            ...row,
            config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
            likes_count: parseInt(row.real_likes_count || row.likes_count || '0'),
            liked_by_user: false,
            created_at: new Date(row.created_at).toISOString()
        })) as PublishedFrame[];
    } catch (e) {
        console.error("Failed to fetch seo frames", e);
        return [];
    }
}

// --- Page Components ---

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const config = seoPages[slug];

    if (!config) return {};

    return {
        title: config.title,
        description: config.description,
        openGraph: {
            title: config.title,
            description: config.description,
            // images: [`/api/og/seo?slug=${slug}`], // Future optimization
        }
    };
}

export default async function SeoPage({ params }: Props) {
    const { slug } = await params;
    const config = seoPages[slug];

    if (!config) {
        notFound();
    }

    const frames = await getFramesByTags(config.tags);

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-blue-500/30 relative">
            <NavBar />

            {/* Global Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Custom SEO Hero */}
            <section className="relative pt-32 pb-12 px-6 overflow-hidden">
                {/* Dynamic Gradient blob */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} blur-[120px] rounded-full mix-blend-screen pointer-events-none opacity-40`} />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white animate-slide-up select-none">
                        {config.heroTitle} <span className={`text-transparent bg-clip-text bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo}`}>{config.heroTitleHighlight}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
                        {config.heroDescription}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <Link
                            href="/create"
                            className={`group h-12 px-8 rounded-full bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg`}
                        >
                            Create {config.heroTitle}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Gallery Section with Filtered Frames */}
            <section className="px-6 py-16 relative z-10 bg-zinc-950/50 backdrop-blur-sm border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold">Trending {config.heroTitle} Templates</h2>
                        <Link href="/gallery" className="text-sm text-zinc-400 hover:text-white transition-colors">View all</Link>
                    </div>

                    {/* Reuse HomeClient but pre-seeded. 
                       Optimally, HomeClient should accept an "initialFrames" prop and render them.
                   */}
                    <HomeClient initialFrames={[]} initialTrendingFrames={frames} viewMode="trending-only" />

                    {frames.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
                            <p className="text-zinc-500 mb-4">No specific templates found for this category yet.</p>
                            <Link href="/create" className="text-blue-400 hover:underline">Be the first to create one!</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* FAQ Section (Reused) */}
            <FAQSection />

            {/* Footer (Simplified) */}
            <footer className="border-t border-white/5 py-12 bg-zinc-950 relative z-10 text-center text-zinc-600 text-sm">
                <p>© 2026 Ollabs. {config.title}</p>
            </footer>
        </main>
    );
}
