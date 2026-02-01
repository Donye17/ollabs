"use client";
import React, { useState } from 'react';
import { authClient } from '../lib/auth-client';
import { AuthModal } from './auth/AuthModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCircle, LogOut } from 'lucide-react';

export const NavBar: React.FC = () => {
    const { data: session } = authClient.useSession();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;
    const activeClass = "bg-primary text-white shadow-lg shadow-blue-500/25 scale-105 border-transparent";
    const inactiveClass = "text-slate-400 hover:text-white hover:bg-slate-800/50 hover:scale-105 border-transparent";

    const handleSignOut = async () => {
        await authClient.signOut();
        window.location.href = '/';
    };

    return (
        <>
            <nav className="w-full h-18 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50 transition-all duration-300">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:rotate-3">
                            <span className="text-white font-heading font-bold text-xl">O</span>
                        </div>
                        <span className="text-white font-heading font-bold text-xl hidden sm:block tracking-tight group-hover:text-primary transition-colors">Ollabs</span>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    {session ? (
                        <div className="flex items-center gap-6">
                            <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-white/5 backdrop-blur-md">
                                <Link
                                    href="/"
                                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${isActive('/') ? activeClass : inactiveClass}`}
                                >
                                    Editor
                                </Link>
                                <Link
                                    href="/gallery"
                                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${isActive('/gallery') ? activeClass : inactiveClass}`}
                                >
                                    Gallery
                                </Link>
                            </div>

                            <div className="h-8 w-px bg-white/10" />

                            <div className="flex items-center gap-4">
                                <Link href={`/profile/${session.user.id}`} className="flex items-center gap-3 hover:opacity-100 transition-opacity group">
                                    <div className="flex flex-col items-end hidden md:flex">
                                        <span className="text-sm font-heading font-bold text-white group-hover:text-primary transition-colors">{session.user.name}</span>
                                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider group-hover:text-slate-400">Creator</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden ring-2 ring-transparent group-hover:ring-primary group-hover:border-transparent transition-all duration-300 shadow-lg group-hover:shadow-primary/25">
                                        {session.user.image ? (
                                            <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCircle className="w-full h-full text-slate-400 p-2" />
                                        )}
                                    </div>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                                    title="Sign Out"
                                >
                                    <LogOut size={20} message-circle />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </nav>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
};
