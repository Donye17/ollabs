
import { pool } from '@/lib/neon';
import { ProfileGrid } from '@/components/ProfileGrid';
import type { Metadata } from 'next';
import { User, Calendar } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = params;
    // We could fetch user here for dynamic title, but keeping it simple for now
    return {
        title: `Creator Profile | Ollabs`,
        description: 'Check out this creator\'s frames on Ollabs.',
    };
}

// Fetch user data directly from DB
async function getUser(id: string) {
    try {
        const result = await pool.query(
            'SELECT name, image, created_at FROM "user" WHERE id = $1',
            [id]
        );
        return result.rows[0];
    } catch (e) {
        console.error("Failed to fetch user", e);
        return null;
    }
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const { id } = params;
    const user = await getUser(id);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
                    <Link href="/" className="text-blue-400 hover:text-blue-300">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            {/* Simple Nav for now - ideally reuse NavBar but requires client context handling if not careful */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            OA
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Ollabs
                        </span>
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl ring-4 ring-slate-900 bg-slate-800">
                            {user.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                                    <User size={48} />
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 pointer-events-none" />
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-slate-400 text-sm">
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                                <Calendar size={14} />
                                Joined {new Date(user.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-12" />

                {/* User's Frames */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Created Frames</h2>
                    </div>

                    <ProfileGrid creatorId={id} />
                </div>
            </main>
        </div>
    );
}
