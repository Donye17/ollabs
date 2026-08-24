"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';

export const NavBar: React.FC = () => {
    const pathname = usePathname() || '/';
    const onCreate = pathname === '/create' || pathname.startsWith('/create/');
    return (
        <nav className="fixed top-0 inset-x-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-xl pt-[env(safe-area-inset-top,0px)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
                <BrandMark size={28} />

                <div className="flex items-center gap-2 sm:gap-5 min-w-0">
                    {/* Desktop only: phones already have Mine · Create · Hub. */}
                    <Link
                        href="/mine"
                        className="hidden lg:inline-flex text-xs font-bold text-muted hover:text-brand-deep transition-colors uppercase tracking-wider min-h-[44px] items-center"
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
                    {!onCreate && (
                        <Link
                            href="/create"
                            className="hidden lg:inline-flex bg-brand hover:brightness-105 text-ink px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:brightness-95 min-h-[44px] items-center shrink-0"
                        >
                            Create a campaign
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
