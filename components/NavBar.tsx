"use client";
import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export const NavBar: React.FC = () => {
    return (
        <nav className="fixed top-0 inset-x-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-xl pt-[env(safe-area-inset-top,0px)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
                <Link href="/" className="flex items-center shrink-0 group min-h-[44px]">
                    <img
                        src="/Ollabs Logo Black.png"
                        alt="Ollabs"
                        className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                <div className="flex items-center gap-2 sm:gap-5 min-w-0">
                    <Link
                        href="/mine"
                        className="text-[11px] sm:text-xs font-bold text-brand-deep sm:text-muted hover:text-brand-deep transition-colors uppercase tracking-wider min-h-[44px] inline-flex items-center px-2.5 sm:px-0 shrink-0 rounded-lg sm:rounded-none bg-brand/10 sm:bg-transparent border border-brand/20 sm:border-0"
                    >
                        My campaigns
                    </Link>
                    <Link href="/explore" className="text-xs font-bold text-muted hover:text-brand-deep hidden md:block transition-colors uppercase tracking-wider">
                        Explore
                    </Link>
                    <a
                        href="mailto:feedback@ollabs.studio?subject=Ollabs%20Feedback"
                        className="text-xs font-bold text-muted hover:text-brand-deep hidden lg:flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                    >
                        <MessageSquare size={14} />
                        Feedback
                    </a>
                    <Link
                        href="/create"
                        className="bg-brand hover:brightness-105 text-ink px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:brightness-95 min-h-[44px] inline-flex items-center shrink-0"
                    >
                        <span className="sm:hidden">Create</span>
                        <span className="hidden sm:inline">Create a campaign</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
