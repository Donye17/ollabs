'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

type Props = {
    /** Where to go if there is no in-app history (cold open / deep link). */
    fallbackHref?: string;
    className?: string;
    label?: string;
};

/**
 * Phone back for organizer flows. BrandMark always jumps home and wipes
 * mid-create / mid-hub work; this walks the stack when we have one.
 */
export function BackControl({
    fallbackHref = '/',
    className = '',
    label = 'Back',
}: Props) {
    const router = useRouter();

    const goBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
            return;
        }
        router.push(fallbackHref);
    };

    return (
        <button
            type="button"
            onClick={goBack}
            aria-label={label}
            className={`inline-flex min-h-[44px] min-w-[44px] -ml-2 items-center justify-center rounded-xl text-ink hover:bg-ink/5 active:bg-ink/10 transition-colors ${className}`}
        >
            <ChevronLeft size={22} strokeWidth={2.25} aria-hidden />
        </button>
    );
}
