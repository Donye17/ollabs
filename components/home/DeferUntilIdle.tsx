"use client";

import React, { useEffect, useState } from 'react';

/**
 * Hold heavy below-fold UI until the browser is idle (or a short timeout).
 * Keeps canvas/calendar work out of the LCP window on throttled mobile audits.
 */
export function DeferUntilIdle({
    children,
    fallback,
    timeoutMs = 2500,
}: {
    children: React.ReactNode;
    fallback: React.ReactNode;
    timeoutMs?: number;
}) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;
        let idleHandle: number | undefined;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const go = () => {
            if (!cancelled) setReady(true);
        };

        // Prefer idle, but always fall through so real users still see content quickly.
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            idleHandle = window.requestIdleCallback(go, { timeout: timeoutMs });
        } else {
            timer = setTimeout(go, Math.min(timeoutMs, 1200));
        }

        return () => {
            cancelled = true;
            if (idleHandle != null && 'cancelIdleCallback' in window) {
                window.cancelIdleCallback(idleHandle);
            }
            if (timer) clearTimeout(timer);
        };
    }, [timeoutMs]);

    if (!ready) return <>{fallback}</>;
    return <>{children}</>;
}
