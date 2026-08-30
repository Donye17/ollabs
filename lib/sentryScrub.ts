/**
 * Shared Sentry beforeSend / beforeSendTransaction.
 *
 * Supporter photos, emails, and campaign/admin secrets must never leave the
 * process. The first version of this scrubber stripped body fields and cookies
 * but copied request.url and query_string through unchanged. Manage loads
 * send ?token=, admin tools send ?key=, and recovery lives at /recover/{hex},
 * so those values would ride error events and the 10% transaction sample
 * straight into Sentry.
 *
 * Keep this isomorphic so server and edge configs stay identical.
 */

type SentryRequest = {
    url?: string;
    data?: unknown;
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
    query_string?: unknown;
    env?: unknown;
};

export type SentryLikeEvent = {
    request?: SentryRequest;
    extra?: Record<string, unknown>;
    contexts?: Record<string, unknown>;
    user?: { email?: string; ip_address?: string; [k: string]: unknown };
    breadcrumbs?: Array<{ data?: Record<string, unknown>; message?: string }>;
    culprit?: string;
    transaction?: string;
    tags?: Record<string, unknown>;
};

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const DATA_URL = /data:image\/[a-z0-9+.-]+;base64,[a-z0-9+/=]+/gi;
// Owner tokens, login codes, admin keys. `k` is the manage-link query param.
const SENSITIVE_QUERY = /(^|[?&])(token|k|code|key|secret|owner_token)=([^&#]*)/gi;
const RECOVER_PATH = /\/recover\/[a-f0-9]{64}/gi;

function isSensitiveKey(key: string): boolean {
    const k = key.toLowerCase();
    return (
        k.includes('email')
        || k.includes('photo')
        || k.includes('image')
        || k.includes('dataurl')
        || k.includes('frame')
        || k.includes('token')
        || k.includes('secret')
        || k.includes('password')
        || k.includes('cookie')
        || k === 'file'
        || k === 'blob'
        || k === 'code'
        || k === 'key'
        || k === 'k'
        || k === 'authorization'
    );
}

export function scrubString(value: string): string {
    return value
        .replace(EMAIL, '[email]')
        .replace(DATA_URL, '[image]')
        .replace(SENSITIVE_QUERY, '$1$2=[redacted]')
        .replace(RECOVER_PATH, '/recover/[redacted]');
}

function scrubQueryString(value: unknown): unknown {
    if (typeof value === 'string') return scrubString(value);
    if (Array.isArray(value)) {
        return value.map((pair) => {
            if (Array.isArray(pair) && pair.length >= 2 && typeof pair[0] === 'string') {
                const name = String(pair[0]);
                if (isSensitiveKey(name)) return [pair[0], '[redacted]'];
                return [pair[0], typeof pair[1] === 'string' ? scrubString(pair[1]) : pair[1]];
            }
            return scrubUnknown(pair);
        });
    }
    if (value && typeof value === 'object') {
        return scrubUnknown(value);
    }
    return value;
}

function scrubUnknown(value: unknown, depth = 0): unknown {
    if (depth > 6) return '[truncated]';
    if (typeof value === 'string') return scrubString(value);
    if (Array.isArray(value)) return value.map((v) => scrubUnknown(v, depth + 1));
    if (value && typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            if (isSensitiveKey(k)) {
                out[k] = '[redacted]';
                continue;
            }
            out[k] = scrubUnknown(v, depth + 1);
        }
        return out;
    }
    return value;
}

export function scrubSentryEvent<T extends SentryLikeEvent>(event: T): T {
    if (event.user) {
        event.user = { ...event.user, email: undefined, ip_address: undefined };
    }
    if (event.request) {
        event.request = {
            ...event.request,
            url: typeof event.request.url === 'string' ? scrubString(event.request.url) : event.request.url,
            query_string: event.request.query_string != null
                ? scrubQueryString(event.request.query_string)
                : undefined,
            data: event.request.data ? scrubUnknown(event.request.data) : undefined,
            cookies: undefined,
            env: undefined,
            headers: event.request.headers
                ? Object.fromEntries(
                    Object.entries(event.request.headers).map(([k, v]) => {
                        const header = k.toLowerCase();
                        if (
                            header === 'cookie'
                            || header === 'authorization'
                            || header === 'x-owner-token'
                            || header === 'x-admin-key'
                            || header === 'x-cron-secret'
                        ) {
                            return [k, '[redacted]'];
                        }
                        return [k, typeof v === 'string' ? scrubString(v) : v];
                    })
                )
                : undefined,
        };
    }
    if (event.extra) event.extra = scrubUnknown(event.extra) as Record<string, unknown>;
    if (event.contexts) event.contexts = scrubUnknown(event.contexts) as Record<string, unknown>;
    if (event.tags) event.tags = scrubUnknown(event.tags) as Record<string, unknown>;
    if (typeof event.culprit === 'string') event.culprit = scrubString(event.culprit);
    if (typeof event.transaction === 'string') event.transaction = scrubString(event.transaction);
    if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((b) => ({
            ...b,
            message: b.message ? scrubString(b.message) : b.message,
            data: b.data ? (scrubUnknown(b.data) as Record<string, unknown>) : b.data,
        }));
    }
    return event;
}
