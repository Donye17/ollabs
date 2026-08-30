/**
 * Shared Sentry beforeSend. Supporter photos and emails must never leave the
 * process. Keep this isomorphic so server and edge configs stay identical.
 *
 * Typed as Sentry's ErrorEvent (not the DOM one) so next build accepts the
 * beforeSend callback. A looser local type dropped `type: undefined` and
 * failed production TypeScript.
 */

import type { ErrorEvent as SentryErrorEvent } from '@sentry/core';

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const DATA_URL = /data:image\/[a-z0-9+.-]+;base64,[a-z0-9+/=]+/gi;

function scrubString(value: string): string {
    return value.replace(EMAIL, '[email]').replace(DATA_URL, '[image]');
}

function scrubUnknown(value: unknown, depth = 0): unknown {
    if (depth > 6) return '[truncated]';
    if (typeof value === 'string') return scrubString(value);
    if (Array.isArray(value)) return value.map((v) => scrubUnknown(v, depth + 1));
    if (value && typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            const key = k.toLowerCase();
            if (
                key.includes('email')
                || key.includes('photo')
                || key.includes('image')
                || key.includes('dataurl')
                || key.includes('frame')
                || key === 'file'
                || key === 'blob'
            ) {
                out[k] = '[redacted]';
                continue;
            }
            out[k] = scrubUnknown(v, depth + 1);
        }
        return out;
    }
    return value;
}

export function scrubSentryEvent(event: SentryErrorEvent): SentryErrorEvent {
    if (event.user) {
        event.user = { ...event.user, email: undefined, ip_address: undefined };
    }
    if (event.request) {
        const headers = event.request.headers;
        event.request = {
            ...event.request,
            data: event.request.data ? scrubUnknown(event.request.data) : undefined,
            cookies: undefined,
            headers: headers
                ? Object.fromEntries(
                    Object.entries(headers).map(([k, v]) =>
                        k.toLowerCase() === 'cookie' || k.toLowerCase() === 'authorization'
                            ? [k, '[redacted]']
                            : [k, scrubString(v)]
                    )
                )
                : undefined,
        };
    }
    if (event.extra) event.extra = scrubUnknown(event.extra) as typeof event.extra;
    if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((b) => ({
            ...b,
            message: b.message ? scrubString(b.message) : b.message,
            data: b.data ? (scrubUnknown(b.data) as typeof b.data) : b.data,
        }));
    }
    return event;
}
