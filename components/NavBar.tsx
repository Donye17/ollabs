"use client";
import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export const NavBar: React.FC = () => {
    return (
        <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight group">
                    <img
                        src="/Ollabs Logo White.png"
                        alt="Ollabs"
                        className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                <div className="flex items-center gap-4 sm:gap-6">
                    <a
                        href="mailto:feedback@ollabs.studio?subject=Ollabs%20Feedback"
                        className="text-xs font-bold text-zinc-500 hover:text-blue-400 hidden sm:flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                    >
                        <MessageSquare size={14} />
                        Feedback
                    </a>
                    <Link
                        href="/create"
                        className="bg-white hover:bg-zinc-200 text-zinc-950 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-white/10 hover:-translate-y-0.5"
                    >
                        Create a campaign
                    </Link>
                </div>
            </div>
        </nav>
    );
};
