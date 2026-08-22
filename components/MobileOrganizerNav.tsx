"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderOpen, LayoutGrid, Plus } from 'lucide-react';

const ITEMS = [
    { href: '/create', label: 'Create', Icon: Plus },
    { href: '/mine', label: 'Mine', Icon: FolderOpen },
    { href: '/hub', label: 'Hub', Icon: LayoutGrid },
] as const;

/** Thumb-zone nav for organizers. Hidden on /create (that page has its own bar). */
export function MobileOrganizerNav() {
    const pathname = usePathname() || '/';
    if (pathname === '/create' || pathname.startsWith('/create/')) return null;
    if (pathname === '/hub' || pathname.startsWith('/hub/')) return null;
    if (pathname.startsWith('/c/')) return null;

    return (
        <nav
            className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom,0px)]"
            aria-label="Organizer shortcuts"
        >
            <div className="max-w-lg mx-auto grid grid-cols-3">
                {ITEMS.map(({ href, label, Icon }) => {
                    const active = pathname === href || pathname.startsWith(`${href}/`);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`min-h-[52px] flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                active ? 'text-brand-deep bg-brand/10' : 'text-muted hover:text-brand-deep hover:bg-ink/5'
                            }`}
                        >
                            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                            {label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
