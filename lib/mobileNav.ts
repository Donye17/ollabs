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
 * Primary organizer action: Continue, Save hub, Publish.
 * Ink fill, 48px, semibold. Brand stays for marketing CTAs and accents.
 */
export const ORGANIZER_PRIMARY_BTN =
    'min-h-[48px] rounded-xl bg-ink text-paper text-[15px] font-semibold hover:bg-ink/90 active:bg-ink/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';


/**
 * Organizer thumb nav only. Supporters on /c and visitors on /u or SEO pages
 * should not see Mine · Create · Hub — it steals thumb space from Save/Share
 * and implies the wrong product job.
 */
export function shouldShowMobileOrganizerNav(pathname: string): boolean {
    const path = pathname || '/';

    if (path.startsWith('/admin')) return false;

    // Public campaign page only; /c/[slug]/manage keeps the organizer shell.
    if (path.startsWith('/c/') && !path.includes('/manage')) return false;

    // Public hub pages.
    if (path.startsWith('/u/')) return false;

    // Marketing / SEO surfaces — keep them lean.
    if (path === '/for' || path.startsWith('/for/')) return false;
    if (path === '/day' || path.startsWith('/day/')) return false;
    if (path === '/vs' || path.startsWith('/vs/')) return false;
    if (path === '/privacy' || path === '/terms') return false;

    const localeRoots = ['/pt', '/id', '/tl', '/hi', '/es'] as const;
    for (const root of localeRoots) {
        if (path === root || path.startsWith(`${root}/`)) return false;
    }

    return true;
}

/**
 * Language offer must never cover a thumb-zone save/publish bar.
 * Soft offer stays on home and browse; hide wherever a primary bottom CTA lives.
 * Public /c is included so Save/Share stays unobstructed on phones.
 */
export function shouldHideLanguageBanner(pathname: string): boolean {
    const path = pathname || '/';
    if (path.startsWith('/c/') && !path.includes('/manage')) return true;
    if (path === '/create' || path.startsWith('/create/')) return true;
    if (path === '/hub' || path.startsWith('/hub/')) return true;
    if (path.startsWith('/day/')) return true;
    return false;
}
