// Best-effort, in-memory rate limiter. On serverless this is per-instance,
// so it is a speed bump against spam, not a hard guarantee. Good enough to
// blunt abusive bursts of campaign creation from a single client.
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
