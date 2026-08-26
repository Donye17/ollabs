'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const LOCAL_KEY = 'ollabs_my_campaigns';

/**
 * Returning organizers: strengthen My campaigns when this browser already
 * published something. First-time visitors keep the quiet secondary link only.
 */
export function HomeResumeLink() {
    const [hasLocal, setHasLocal] = useState(false);

    useEffect(() => {
        try {
            const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
            setHasLocal(Array.isArray(list) && list.length > 0);
        } catch {
            setHasLocal(false);
        }
    }, []);

    if (!hasLocal) {
        return (
            <Link
                href="/mine"
                className="min-h-[44px] px-4 text-sm font-semibold text-muted hover:text-brand-deep transition-colors inline-flex items-center"
            >
                My campaigns
            </Link>
        );
    }

    return (
        <Link
            href="/mine"
            className="min-h-[48px] px-5 rounded-xl border border-ink/15 text-ink font-bold text-sm inline-flex items-center hover:bg-ink/5 active:bg-ink/10 transition-colors"
        >
            Continue in My campaigns
        </Link>
    );
}
