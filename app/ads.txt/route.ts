/**
 * AdSense seller authorization. Served as a Route Handler (not public/) so
 * Vercel always returns a clean 200 text/plain without static-asset quirks
 * that have made AdSense flip between "found" and "not found" after crawls.
 *
 * Format: https://support.google.com/adsense/answer/7532444
 */
export function GET() {
    const body = 'google.com, pub-5665798404376894, DIRECT, f08c47fec0942fa0\n';
    return new Response(body, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
            // Avoid Content-Disposition from static file serving.
            'X-Content-Type-Options': 'nosniff',
        },
    });
}
