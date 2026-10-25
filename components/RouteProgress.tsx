'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * One 250ms bar at the top of every navigation. A full-page fade would hide
 * the framed photo, which is the product. Reduced motion skips the bar.
 */
export function RouteProgress() {
    const pathname = usePathname();
    const [on, setOn] = useState(false);

    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        const start = () => {
            if (reduce.matches) return;
            setOn(true);
        };
        const onClick = (event: MouseEvent) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
            const anchor = (event.target as Element | null)?.closest?.('a');
            if (!anchor) return;
            if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('#')) return;
            let url: URL;
            try {
                url = new URL(anchor.href, window.location.href);
            } catch {
                return;
            }
            if (url.origin !== window.location.origin) return;
            if (url.pathname === window.location.pathname && url.search === window.location.search) return;
            start();
        };
        document.addEventListener('click', onClick);
        window.addEventListener('popstate', start);
        return () => {
            document.removeEventListener('click', onClick);
            window.removeEventListener('popstate', start);
        };
    }, []);

    useEffect(() => {
        if (!on) return;
        const timer = window.setTimeout(() => setOn(false), 260);
        return () => window.clearTimeout(timer);
    }, [on, pathname]);

    if (!on) return null;

    return (
        <div
            className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-1"
            aria-hidden
        >
            <div className="route-progress h-full w-full origin-left bg-brand" />
        </div>
    );
}
