
import { pool } from '@/lib/neon';
import { ProfileGrid } from '@/components/ProfileGrid';
import { EditProfileModalWrapper } from '@/components/profile/EditProfileModalWrapper';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import type { Metadata } from 'next';
import { User, Calendar, MapPin, Link as LinkIcon, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const user = await getUser(id);
    return {
        title: user ? `${user.name} | Ollabs` : 'Start Creating | Ollabs',
        description: user?.bio || 'Check out this creator\'s frames on Ollabs.',
    };
}

// Fetch user data directly from DB with fallback for table names
async function getUser(id: string) {
    try {
        const result = await pool.query(
            'SELECT * FROM "user" WHERE id = $1',
            [id]
        );
        return result.rows[0];
    } catch (e: any) {
        // Fallback for different table name config
        if (e.message?.includes('does not exist')) {
            try {
                const result = await pool.query(
                    'SELECT * FROM users WHERE id = $1',
                    [id]
                );
                return result.rows[0];
            } catch (innerError) {
                console.error("Failed to fetch user from 'users' table fallback", innerError);
            }
        }
        console.error("Failed to fetch user", e);
        return null;
    }
}

export default async function ProfilePage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ tab?: string }> }) {
    const { id } = await params;
    const { tab } = await searchParams;
    const user = await getUser(id);
    const session = await auth.api.getSession({ headers: await headers() });

    // Check if current user owns this profile
    const isOwner = session?.user?.id === id;

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

    const socials = typeof user.social_links === 'string' ? JSON.parse(user.social_links) : (user.social_links || {});

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight group">
                        <img
                            src="/Ollabs Logo White.png"
                            alt="Ollabs"
                            className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>
                    {session && (
                        <div className="flex items-center gap-4">
                            <Link href="/create" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Create</Link>
                            <Link href="/gallery" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Gallery</Link>
                        </div>
                    )}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Profile Header */}
                <div className="relative mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Cover Banner (Abstract) */}
                    <div className="absolute inset-x-0 -top-12 h-48 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-slate-900/20 rounded-3xl blur-3xl -z-10 opacity-50" />

                    <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-slate-950 shadow-2xl ring-4 ring-slate-800 bg-slate-800 relative z-10">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-slate-500" />
                                            Joined {new Date(user.createdAt || user.created_at).toLocaleDateString()}
                                        </span>
                                        {user.location && (
                                            <span className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-slate-500" />
                                                {user.location}
                                            </span>
                                        )}
                                        {user.website && (
                                            <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
                                                <LinkIcon size={14} />
                                                Website
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {isOwner && (
                                    <EditProfileModalWrapper user={user} />
                                )}
                            </div>

                            {/* Bio */}
                            {user.bio && (
                                <p className="text-slate-300 max-w-2xl leading-relaxed mb-4 text-sm md:text-base">
                                    {user.bio}
                                </p>
                            )}

                            {/* Socials */}
                            {user.social_links && (
                                <div className="flex items-center gap-3 mt-4">
                                    {socials.twitter && (
                                        <a href={`https://twitter.com/${socials.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                                            <Twitter size={18} />
                                        </a>
                                    )}
                                    {socials.instagram && (
                                        <a href={`https://instagram.com/${socials.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                                            <Instagram size={18} />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-800 mb-8" />

                {/* Profile Tabs */}
                {/* We pass isOwner to decide if Drafts tab is shown */}
                <ProfileTabs isOwner={isOwner} />

                {/* User's Frames Grid */}
                <div className="space-y-8">
                    <ProfileGrid creatorId={id} tab={tab} />
                </div>
            </main>
        </div>
    );
}
