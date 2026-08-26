'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderOpen, LayoutGrid, Plus } from 'lucide-react';
import { MOBILE_NAV_H, shouldShowMobileOrganizerNav } from '@/lib/mobileNav';

const ITEMS = [
    { href: '/mine', label: 'Mine', Icon: FolderOpen },
    { href: '/create', label: 'Create', Icon: Plus },
    { href: '/hub', label: 'Hub', Icon: LayoutGrid },
] as const;

/**
 * Organizer thumb-zone nav on phones. Equal-weight tabs, paper surface, brand
 * active state. Height must stay in sync with MOBILE_NAV_H so fixed action bars
 * (create Continue, hub Save) sit above this, not under it.
 * Hidden on /c, /u, and SEO landings so supporters only see the frame job.
 */
export function MobileOrganizerNav() {
    const pathname = usePathname() || '/';
    if (!shouldShowMobileOrganizerNav(pathname)) return null;

    return (
        <nav
            className="lg:hidden fixed inset-x-0 bottom-0 z-40"
            aria-label="Main"
        >
            <div
                className="border-t border-ink/10 bg-paper/95 text-ink backdrop-blur-xl pb-[env(safe-area-inset-bottom,0px)]"
                style={{ minHeight: MOBILE_NAV_H }}
            >
                <div
                    className="max-w-lg mx-auto grid grid-cols-3"
                    style={{ height: MOBILE_NAV_H }}
                >
                    {ITEMS.map(({ href, label, Icon }) => {
                        const active =
                            pathname === href || pathname.startsWith(`${href}/`);
                        const isCreate = href === '/create';

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                                    active
                                        ? 'text-brand-deep'
                                        : 'text-muted hover:text-ink active:text-ink'
                                }`}
                            >
                                <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                        active && isCreate
                                            ? 'bg-brand text-ink'
                                            : active
                                              ? 'bg-brand/15 text-brand-deep'
                                              : ''
                                    }`}
                                >
                                    <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
                                </span>
                                <span className="text-[11px] font-semibold leading-none tracking-tight">
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
