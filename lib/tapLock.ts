'use client';

import { useRef } from 'react';

/**
 * Blocks a second tap until the first handler finishes.
 * `disabled` on the button is not enough: the click that lands before React
 * re-renders still runs the handler.
 */
export function useTapGuard() {
    const locked = useRef(false);
    return {
        start(): boolean {
            if (locked.current) return false;
            locked.current = true;
            return true;
        },
        end() {
            locked.current = false;
        },
    };
}
