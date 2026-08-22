'use client';

import { usePathname } from 'next/navigation';
import {
    MOBILE_NAV_CONTENT_PAD,
    shouldShowMobileOrganizerNav,
} from '@/lib/mobileNav';

/** In-flow pad matching the fixed organizer tab bar. Hidden with the bar. */
export function MobileNavSpacer() {
    const pathname = usePathname() || '/';
    if (!shouldShowMobileOrganizerNav(pathname)) return null;

    return (
        <div
            className="lg:hidden shrink-0 pointer-events-none"
            style={{ height: MOBILE_NAV_CONTENT_PAD }}
            aria-hidden
        />
    );
}
