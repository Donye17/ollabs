"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderOpen, LayoutGrid, Plus } from 'lucide-react';
import { MOBILE_NAV_H, shouldShowMobileOrganizerNav } from '@/lib/mobileNav';

const ITEMS = [
    { href: '/mine', label: 'Mine', Icon: FolderOpen },
    { href: '/create', label: 'Create', Icon: Plus, primary: true },
    { href: '/hub', label: 'Hub', Icon: LayoutGrid },
] as const;

/**
 * Organizer thumb-zone nav on phones. Create is a larger ring but shares the
 * same baseline as Mine and Hub so it never floats above the bar and covers
 * content. Hidden on /c, /u, and SEO landings so supporters only see the frame job.
 */
export function MobileOrganizerNav() {
    const pathname = usePathname() || '/';
    if (!shouldShowMobileOrganizerNav(pathname)) return null;

    return (
        <nav
            className="lg:hidden fixed inset-x-0 bottom-0 z-40"
            aria-label="Main"
        >
            {/* Safe-area pad lives on the ink plate so the bar is flush to the
                screen edge; padding on the outer nav left a cream strip under it. */}
            <div
                className="border-t-2 border-brand/40 bg-ink text-paper shadow-[0_-8px_24px_rgba(6,20,31,0.18)] pb-[env(safe-area-inset-bottom,0px)]"
                style={{ minHeight: MOBILE_NAV_H }}
            >
                <div className="max-w-lg mx-auto grid grid-cols-3 items-center px-1">
                    {ITEMS.map(({ href, label, Icon, ...rest }) => {
                        const primary = 'primary' in rest && rest.primary;
                        const active =
                            pathname === href || pathname.startsWith(`${href}/`);

                        if (primary) {
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className="flex flex-col items-center justify-center gap-1 min-h-[60px] py-2"
                                >
                                    {/* Hollow brand ring sits in the same row as
                                        Mine/Hub icons — larger, not raised. */}
                                    <span
                                        className={`flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-brand bg-ink text-brand ${
                                            active ? 'bg-brand/15' : 'hover:bg-brand/10'
                                        }`}
                                    >
                                        <Icon size={22} strokeWidth={2.75} />
                                    </span>
                                    <span
                                        className={`text-[11px] font-extrabold uppercase tracking-wider ${
                                            active ? 'text-brand' : 'text-paper/80'
                                        }`}
                                    >
                                        {label}
                                    </span>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center justify-center gap-1 min-h-[60px] py-2 transition-colors ${
                                    active
                                        ? 'text-brand'
                                        : 'text-paper/65 hover:text-paper active:text-paper'
                                }`}
                            >
                                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                                <span className="text-[11px] font-extrabold uppercase tracking-wider">
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
