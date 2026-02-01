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
    const activeClass = "bg-blue-600 text-white shadow-md shadow-blue-900/20";
    const inactiveClass = "text-slate-400 hover:text-white hover:bg-slate-800";

    return (
        <>
            <nav className="w-full h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                            <span className="text-white font-bold text-lg">O</span>
                        </div>
                        <span className="text-white font-bold text-lg hidden sm:block tracking-tight">Ollabs</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {session ? (
                        <div className="flex items-center gap-4">
                            <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-800 backdrop-blur-sm">
                                <Link
                                    href="/"
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/') ? activeClass : inactiveClass}`}
                                >
                                    Editor
                                </Link>
                                <Link
                                    href="/gallery"
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/gallery') ? activeClass : inactiveClass}`}
                                >
                                    Gallery
                                </Link>
                            </div>

                            <div className="h-6 w-px bg-slate-800" />

                            <div className="flex items-center gap-3">
                                <Link href={`/profile/${session.user.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                                    <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{session.user.name}</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
                                        {session.user.image ? (
                                            <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCircle className="w-full h-full text-slate-400 p-1" />
                                        )}
                                    </div>
                                </Link>
                                <button
                                    onClick={() => authClient.signOut()}
                                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
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
