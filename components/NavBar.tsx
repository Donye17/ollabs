"use client";
import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export const NavBar: React.FC = () => {
    return (
        <nav className="fixed top-0 inset-x-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <img
                        src="/Ollabs Logo Black.png"
                        alt="Ollabs"
                        className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                <div className="flex items-center gap-4 sm:gap-5">
                    <a
                        href="mailto:feedback@ollabs.studio?subject=Ollabs%20Feedback"
                        className="text-xs font-bold text-muted hover:text-brand-deep hidden sm:flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                    >
                        <MessageSquare size={14} />
                        Feedback
                    </a>
                    <Link
                        href="/create"
                        className="bg-brand hover:brightness-105 text-ink px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                    >
                        Create a campaign
                    </Link>
                </div>
            </div>
        </nav>
    );
};
