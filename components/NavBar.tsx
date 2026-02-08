"use client";
import React, { useState } from 'react';
import { authClient } from '../lib/auth-client';
import { AuthModal } from './auth/AuthModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCircle, LogOut, Sparkles, Menu, X, MessageSquare } from 'lucide-react';
import { NotificationBell } from './notifications/NotificationBell';
import { Bell } from 'lucide-react';

export const NavBar: React.FC = () => {
    const { data: sessionData } = authClient.useSession();
    const session = sessionData as typeof sessionData & { user: { username?: string } } | null;
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;
    const activeClass = "bg-zinc-800 text-white border-zinc-700 shadow-sm";
    const inactiveClass = "text-zinc-400 hover:text-white hover:bg-zinc-800/50 border-transparent";

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await authClient.signOut();
            window.location.href = '/';
        } catch (error) {
            console.error("Sign out failed", error);
            setIsSigningOut(false);
        }
    };

    return (
        <>
            <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight group">
                        <img
                            src="/Ollabs Logo White.png"
                            alt="Ollabs"
                            className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Desktop Nav Items */}
                        <div className="hidden md:flex items-center gap-6">
                            {session ? (
                                <div className="flex items-center gap-6">
                                    <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5 backdrop-blur-md">
                                        <Link
                                            href="/create"
                                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 border ${isActive('/create') ? activeClass : inactiveClass}`}
                                        >
                                            Create
                                        </Link>
                                        <Link
                                            href="/gallery"
                                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 border ${isActive('/gallery') ? activeClass : inactiveClass}`}
                                        >
                                            Gallery
                                        </Link>
                                    </div>

                                    <div className="h-6 w-px bg-white/10" />

                                    {/* Feedback Link */}
                                    <a
                                        href="mailto:feedback@ollabs.studio?subject=Ollabs%20Beta%20Feedback"
                                        className="text-xs font-bold text-zinc-500 hover:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                                    >
                                        <MessageSquare size={14} />
                                        Feedback
                                    </a>

                                    <div className="h-6 w-px bg-white/10" />

                                    <div className="flex items-center gap-4">
                                        <NotificationBell />
                                        <Link href={`/profile/${session.user.id}`} className="flex items-center gap-3 hover:opacity-100 transition-opacity group">
                                            <div className="flex flex-col items-end hidden md:flex">
                                                <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{session.user.name}</span>
                                                <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider group-hover:text-zinc-400">Creator</span>
                                            </div>
                                            <div className="w-9 h-9 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500/20 group-hover:border-zinc-600 transition-all duration-300 shadow-lg">
                                                {session.user.image ? (
                                                    <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserCircle className="w-full h-full text-zinc-400 p-1.5" />
                                                )}
                                            </div>
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            disabled={isSigningOut}
                                            className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 font-medium text-sm group"
                                            title="Sign Out"
                                        >
                                            {isSigningOut ? (
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Link href="/create" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Create</Link>
                                    <Link href="/gallery" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Gallery</Link>
                                    <button
                                        onClick={() => setIsAuthOpen(true)}
                                        className="bg-white hover:bg-zinc-200 text-zinc-950 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-white/10 hover:-translate-y-0.5"
                                    >
                                        Sign In
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </nav >

            {/* Mobile Menu Overlay */}
            {
                isMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl pt-24 px-6 animate-in slide-in-from-top-10 duration-200 md:hidden flex flex-col gap-6">
                        <Link href="/create" onClick={() => setIsMenuOpen(false)} className={`text-2xl font-bold ${isActive('/create') ? 'text-white' : 'text-zinc-500'}`}>Create</Link>
                        <Link href="/gallery" onClick={() => setIsMenuOpen(false)} className={`text-2xl font-bold ${isActive('/gallery') ? 'text-white' : 'text-zinc-500'}`}>Gallery</Link>

                        <div className="h-px bg-zinc-800 w-full my-2" />

                        {session ? (
                            <>
                                <Link href={`/profile/${session.user.id}`} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 text-xl font-medium text-zinc-300">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden">
                                        {session.user.image ? <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" /> : <UserCircle className="w-full h-full p-2" />}
                                    </div>
                                    {session.user.name}
                                </Link>
                                <button
                                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                                    className="flex items-center gap-2 text-red-400 font-medium text-lg mt-4"
                                >
                                    <LogOut size={20} /> Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => { setIsAuthOpen(true); setIsMenuOpen(false); }}
                                className="bg-white text-zinc-950 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-zinc-200 transition-colors"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                )
            }

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
};
