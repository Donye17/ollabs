// Best-effort, in-memory rate limiter.
//
// On Vercel serverless each isolate has its own Map, so this is a speed bump
// against burst abuse from a single client hitting one instance — not a global
// quota. That is enough for campaign use/view spam and create floods. A hard
// multi-instance cap would need Redis/Upstash; we deliberately keep this
// dependency-free until abuse volume justifies it.
type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const b = buckets.get(key);
    if (!b || now > b.reset) {
        buckets.set(key, { count: 1, reset: now + windowMs });
        return true;
    }
    if (b.count >= limit) return false;
    b.count += 1;
    return true;
}

export function clientIp(req: Request): string {
    const xff = req.headers.get('x-forwarded-for') || '';
    const first = xff.split(',')[0].trim();
    return first || req.headers.get('x-real-ip') || 'unknown';
}
