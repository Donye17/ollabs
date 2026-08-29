'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { BackControl } from '@/components/BackControl';

/** Short label so phones know where they are without reading the page H1. */
function chromeTitle(pathname: string): string | null {
    if (pathname === '/create' || pathname.startsWith('/create/')) return 'Create';
    if (pathname === '/hub' || pathname.startsWith('/hub/')) return 'Hub';
    if (pathname === '/mine' || pathname.startsWith('/mine/')) return 'Mine';
    if (pathname.includes('/manage')) return 'Manage';
    if (pathname === '/login' || pathname.startsWith('/login')) return 'Sign in';
    if (pathname === '/recover' || pathname.startsWith('/recover')) return 'Recover';
    return null;
}

function backFallbackFor(pathname: string, onCreate: boolean): string {
    if (onCreate || pathname.startsWith('/hub')) return '/mine';
    if (pathname.includes('/manage')) return '/mine';
    if (pathname.startsWith('/login') || pathname.startsWith('/recover')) return '/mine';
    if (pathname === '/mine' || pathname.startsWith('/mine/')) return '/';
    return '/';
}

type NavBarProps = {
    /**
     * Set from the home page server tree. On Vercel ISR, usePathname() during
     * SSR of `/` has been observed to return a non-home path, so the Back
     * control was painted into the HTML and then removed on hydrate (React #418).
     */
    isHome?: boolean;
};

export const NavBar: React.FC<NavBarProps> = ({ isHome = false }) => {
    const pathname = usePathname() || '/';
    const onCreate = pathname === '/create' || pathname.startsWith('/create/');
    const onHome = isHome || pathname === '/';
    // Phones: logo alone always jumped home and wiped mid-flow work. Back keeps
    // create / hub / mine / manage reachable without starting over.
    const showBack = !onHome;
    const backFallback = backFallbackFor(pathname, onCreate);
    // On a forced-home document, never paint a chrome title from a stale
    // usePathname() during SSR (same ISR glitch as showBack).
    const title = onHome ? null : chromeTitle(pathname);

    return (
        <nav className="fixed top-0 inset-x-0 z-50 border-b border-ink/10 bg-paper/90 pt-[env(safe-area-inset-top,0px)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
                <div className="flex items-center gap-0.5 min-w-0">
                    {showBack && (
                        <BackControl
                            fallbackHref={backFallback}
                            className="lg:hidden"
                        />
                    )}
                    <BrandMark size={28} />
                    {title && (
                        <span className="lg:hidden ml-1.5 text-sm font-semibold text-ink truncate max-w-[9rem]">
                            {title}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:gap-5 min-w-0">
                    {/* Desktop only: phones already have Mine · Create · Hub. */}
                    <Link
                        href="/mine"
                        className="hidden lg:inline-flex text-sm font-semibold text-muted hover:text-brand-deep transition-colors min-h-[44px] items-center"
                    >
                        My campaigns
                    </Link>
                    <Link href="/explore" className="text-sm font-semibold text-muted hover:text-brand-deep hidden md:block transition-colors">
                        Explore
                    </Link>
                    <Link href="/guides" className="text-sm font-semibold text-muted hover:text-brand-deep hidden md:block transition-colors">
                        Guides
                    </Link>
                    <a
                        href="mailto:feedback@ollabs.studio?subject=Ollabs%20Feedback"
                        className="text-sm font-semibold text-muted hover:text-brand-deep hidden lg:flex items-center gap-1.5 transition-colors"
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
