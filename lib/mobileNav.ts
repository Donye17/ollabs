/**
 * Shared geometry for the fixed mobile Create / Mine / Hub bar.
 * Must match the content row height in MobileOrganizerNav (not including
 * safe-area). An undersized value parks create/hub action bars under the tabs.
 */
export const MOBILE_NAV_H = '3.5rem';

/** Space reserved under page content for the fixed tab bar. */
export const MOBILE_NAV_CONTENT_PAD =
    `calc(${MOBILE_NAV_H} + env(safe-area-inset-bottom, 0px))` as const;

/** CSS length: tab bar height + iOS home indicator (action bars sit above this). */
export const ABOVE_MOBILE_NAV =
    `calc(${MOBILE_NAV_H} + env(safe-area-inset-bottom, 0px))` as const;

/**
 * Primary organizer action: Continue, Save hub, Publish, Sign in.
 * Ink fill, 48px, semibold. Brand stays for marketing CTAs and accents.
 */
export const ORGANIZER_PRIMARY_BTN =
    'min-h-[48px] rounded-xl bg-ink text-paper text-[15px] font-semibold hover:bg-ink/90 active:bg-ink/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Top padding under the fixed NavBar (notch-safe). Paste into className.
 * sm: matches NavBar h-16.
 */
export const PAGE_TOP_UNDER_NAV =
    'pt-[calc(3.5rem+env(safe-area-inset-top,0px)+1.25rem)] sm:pt-[calc(4rem+env(safe-area-inset-top,0px)+1.5rem)]' as const;

/**
 * Organizer thumb nav only. Supporters on /c and visitors on /u or SEO pages
 * should not see Mine · Create · Hub. It steals thumb space from Save/Share
 * and implies the wrong product job.
 */
export function shouldShowMobileOrganizerNav(pathname: string): boolean {
    const path = pathname || '/';

    if (path.startsWith('/admin')) return false;

    // Public campaign page only; /c/[slug]/manage keeps the organizer shell.
    if (path.startsWith('/c/') && !path.includes('/manage')) return false;

    // Public hub pages.
    if (path.startsWith('/u/')) return false;

    // Marketing homepage. Mine · Create · Hub is organizer chrome; a first
    // visit should not lose the thumb zone to it.
    if (path === '/') return false;

    // Marketing / SEO surfaces. Keep them lean.
    if (path === '/for' || path.startsWith('/for/')) return false;
    if (path === '/day' || path.startsWith('/day/')) return false;
    if (path === '/vs' || path.startsWith('/vs/')) return false;
    if (path === '/guides' || path.startsWith('/guides/')) return false;
    if (path === '/privacy' || path === '/terms') return false;
    if (path === '/about' || path === '/contact' || path === '/updates' || path === '/explore') return false;

    const localeRoots = ['/pt', '/hi'] as const;
    for (const root of localeRoots) {
        if (path === root || path.startsWith(`${root}/`)) return false;
    }

    return true;
}

/**
 * Language offer must never cover a thumb-zone save/publish bar.
 * Soft offer stays on home and browse; hide wherever a primary bottom CTA lives.
 * All /c routes (public + manage) so Save stays clear.
 */
export function shouldHideLanguageBanner(pathname: string): boolean {
    const path = pathname || '/';
    if (path.startsWith('/c/')) return true;
    if (path === '/create' || path.startsWith('/create/')) return true;
    if (path === '/hub' || path.startsWith('/hub/')) return true;
    if (path.startsWith('/day/')) return true;
    if (path === '/login' || path.startsWith('/login')) return true;
    if (path === '/recover' || path.startsWith('/recover')) return true;
    return false;
}
