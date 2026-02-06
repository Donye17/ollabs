import { pool } from '@/lib/neon';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Copy, Wand2 } from 'lucide-react';
import { LikeButton } from '@/components/social/LikeButton';
import { CommentSection } from '@/components/social/CommentSection';

// Fetch frame data
async function getFrame(id: string) {
    try {
        const result = await pool.query(
            `SELECT f.*, p.name as parent_name 
             FROM frames f 
             LEFT JOIN frames p ON f.parent_id = p.id 
             WHERE f.id = $1`,
            [id]
        );
        return result.rows[0];
    } catch (e) {
        console.error("Failed to fetch frame", e);
        return null;
    }
}

// Increment view count
async function incrementView(id: string) {
    try {
        await pool.query('UPDATE frames SET views_count = views_count + 1 WHERE id = $1', [id]);
    } catch (e) {
        console.error("Failed to increment view", e);
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const frame = await getFrame(id);

    if (!frame) {
        return {
            title: 'Frame Not Found - Ollabs',
            description: 'The requested avatar frame could not be found.',
        };
    }

    const title = `${frame.name} by ${frame.creator_name} | Ollabs Avatar Frame`;
    const description = frame.description || `Customize your profile picture with the ${frame.name} frame by ${frame.creator_name}. Create your own custom avatar frames on Ollabs.`;

    const ogImageUrl = `https://ollabs.studio/api/og?title=${encodeURIComponent(frame.name)}&creator=${encodeURIComponent(frame.creator_name)}`;

    return {
        title,
        description,
        keywords: ['custom avatar frame', 'pfp border', 'discord profile picture', frame.name, 'remix pfp', 'frame maker'],
        openGraph: {
            title,
            description,
            url: `https://ollabs.studio/share/${frame.id}`,
            siteName: 'Ollabs',
            locale: 'en_US',
            type: 'website',
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: `${frame.name} Avatar Frame by ${frame.creator_name}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            creator: '@ollabs_studio',
            images: [ogImageUrl],
        },
        authors: [{ name: frame.creator_name }],
        category: 'design',
    };
}

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const frame = await getFrame(id);

    if (frame) {
        // Fire and forget view increment to avoid blocking render significantly
        // or await it if strictness needed. Fire-and-forget in server components is tricky as runtime might kill it.
        // Better to await.
        await incrementView(id);
    }

    if (!frame) {
        notFound();
    }

    // Parse config safely
    let config = {};
    try {
        config = typeof frame.config === 'string' ? JSON.parse(frame.config) : frame.config;
    } catch (e) {
        // ignore
    }

    // Structured Data for Google Images
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        'contentUrl': `https://ollabs.studio/api/og?title=${encodeURIComponent(frame.name)}&creator=${encodeURIComponent(frame.creator_name)}`,
        'name': `${frame.name} Avatar Frame`,
        'creator': {
            '@type': 'Person',
            'name': frame.creator_name
        },
        'description': frame.description || `Custom ${frame.name} avatar frame for Discord and social media.`,
        'thumbnail': `https://ollabs.studio/api/og?title=${encodeURIComponent(frame.name)}&creator=${encodeURIComponent(frame.creator_name)}`
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

            <div className="relative z-10 max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg shadow-blue-500/25">
                        <Wand2 className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-heading">{frame.name}</h1>
                    <p className="text-slate-400">Created by <span className="text-blue-400 font-medium">{frame.creator_name}</span></p>
                    {frame.parent_id && frame.parent_name && (
                        <p className="text-xs text-slate-500 mt-2">
                            Remixed from <Link href={`/share/${frame.parent_id}`} className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">{frame.parent_name}</Link>
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <Link
                        href={`/?remix=${frame.id}`} // We'll need to handle this query param in Editor
                        className="block w-full"
                    >
                        <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-bold font-heading text-lg shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                            <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                            Remix this Frame
                        </button>
                    </Link>

                    <Link
                        href="/gallery"
                        className="block w-full text-center py-3 text-slate-400 hover:text-white font-medium transition-colors"
                    >
                        Browse Gallery
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3">Frame Details</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                        {frame.description && (
                            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-white/5">
                                {frame.description}
                            </span>
                        )}
                        <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-white/5">
                            {new Date(frame.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white">Social</h3>
                        <LikeButton frameId={frame.id} />
                    </div>
                    <CommentSection frameId={frame.id} />
                </div>
            </div>
        </div>
    );
}
