"use client";

import React, { useEffect, useRef, useState } from 'react';

/**
 * Mount children only after the sentinel enters (or nears) the viewport.
 * Unlike idle deferral, this keeps below-fold work out of Lighthouse's
 * network-idle window until the user actually scrolls toward it.
 */
export function DeferUntilVisible({
    children,
    fallback,
    rootMargin = '200px 0px',
}: {
    children: React.ReactNode;
    fallback: React.ReactNode;
    rootMargin?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (ready) return;
        const el = ref.current;
        if (!el) return;

        if (typeof IntersectionObserver === 'undefined') {
            setReady(true);
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setReady(true);
                    io.disconnect();
                }
            },
            { rootMargin }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [ready, rootMargin]);

    return <div ref={ref}>{ready ? children : fallback}</div>;
}
