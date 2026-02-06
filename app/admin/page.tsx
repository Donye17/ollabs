import { pool } from '@/lib/neon';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import Image from 'next/image';
import { ShieldAlert, Users, Layers, Heart } from 'lucide-react';

export const metadata = {
    title: 'Admin Dashboard | Ollabs',
};

async function getAdminData() {
    const query = `
        SELECT 
            u.id, 
            u.name, 
            u.email, 
            u.image, 
            u."createdAt", 
            COUNT(DISTINCT f.id) as frames_created,
            COUNT(DISTINCT l.frame_id) as likes_given
        FROM "user" u
        LEFT JOIN frames f ON u.id = f.creator_id
        LEFT JOIN frame_likes l ON u.id = l.user_id
        GROUP BY u.id
        ORDER BY u."createdAt" DESC
    `;
    const result = await pool.query(query);
    return result.rows;
}

export default async function AdminPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    // 1. Auth Guard
    if (!session?.user?.email) {
        redirect('/');
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
    if (!adminEmails.includes(session.user.email)) {
        // If not in admin list, show 404 to hide existence
        notFound();
    }

    // 2. Fetch Data
    const users = await getAdminData();

    // 3. Calc Totals
    const totalUsers = users.length;
    const totalFrames = users.reduce((acc, user) => acc + parseInt(user.frames_created), 0);
    const totalLikes = users.reduce((acc, user) => acc + parseInt(user.likes_given), 0);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                        <ShieldAlert className="text-red-500 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-heading">Master Admin</h1>
                        <p className="text-slate-400">User analytics and platform overview</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-blue-500/20 p-3 rounded-lg"><Users className="text-blue-400" /></div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Users</p>
                            <p className="text-3xl font-bold font-heading">{totalUsers}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-purple-500/20 p-3 rounded-lg"><Layers className="text-purple-400" /></div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Frames Created</p>
                            <p className="text-3xl font-bold font-heading">{totalFrames}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-pink-500/20 p-3 rounded-lg"><Heart className="text-pink-400" /></div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Likes Activity</p>
                            <p className="text-3xl font-bold font-heading">{totalLikes}</p>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold font-heading">User Directory</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-center">Frames Created</th>
                                    <th className="px-6 py-4 text-center">Saved (Likes)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.image ? (
                                                    <Image
                                                        src={user.image}
                                                        alt={user.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full border border-white/10"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border border-white/10">
                                                        {user.name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-white text-sm">{user.name}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                    <p className="text-[10px] text-slate-600 font-mono mt-0.5 select-all">{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${parseInt(user.frames_created) > 0 ? 'bg-purple-500/10 text-purple-400' : 'text-slate-600'}`}>
                                                {user.frames_created}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${parseInt(user.likes_given) > 0 ? 'bg-pink-500/10 text-pink-400' : 'text-slate-600'}`}>
                                                {user.likes_given}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
