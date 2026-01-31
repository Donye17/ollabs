import React, { useState } from 'react';
import { authClient } from '../lib/auth-client';
import { AuthModal } from './auth/AuthModal';
import { UserCircle, LogOut, LayoutGrid, Plus } from 'lucide-react';

export const NavBar: React.FC = () => {
    const { data: session } = authClient.useSession();
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    return (
        <>
            <nav className="w-full h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">O</span>
                    </div>
                    <span className="text-white font-bold text-lg hidden sm:block">Ollabs</span>
                </div>

                <div className="flex items-center gap-4">
                    {session ? (
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-white transition-colors">
                                <LayoutGrid size={18} />
                                <span className="text-sm font-medium">Gallery</span>
                            </button>

                            <div className="h-6 w-px bg-slate-800" />

                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-white">{session.user.name}</span>
                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                                    {session.user.image ? (
                                        <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <UserCircle className="w-full h-full text-slate-400 p-1" />
                                    )}
                                </div>
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
