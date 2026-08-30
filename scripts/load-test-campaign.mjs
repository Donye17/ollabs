/**
 * Hit a campaign page repeatedly to approximate a 10x August-weekend spike.
 *
 * Usage: node --experimental-strip-types scripts/load-test-campaign.mjs [url] [concurrency] [total]
 * Default: http://127.0.0.1:3000/c/foto-com-drpitagoras-o9qr  20  400
 *
 * ISR answer lives in docs/OLLABS_PLAN.md section 6. This script only measures
 * whether the HTML stays fast when many clients ask for the same slug.
 */

const url = process.argv[2] || 'http://127.0.0.1:3000/c/foto-com-drpitagoras-o9qr';
const concurrency = Math.max(1, parseInt(process.argv[3] || '20', 10));
const total = Math.max(concurrency, parseInt(process.argv[4] || '400', 10));

async function one() {
    const t0 = Date.now();
    try {
        const res = await fetch(url, { cache: 'no-store', headers: { 'cache-control': 'no-cache' } });
        const body = await res.text();
        return { ok: res.ok, status: res.status, ms: Date.now() - t0, bytes: body.length };
    } catch (e) {
        return { ok: false, status: 0, ms: Date.now() - t0, bytes: 0, err: String(e) };
    }
}

async function main() {
    const started = Date.now();
    const results = [];
    let next = 0;
    async function worker() {
        while (next < total) {
            const i = next++;
            results[i] = await one();
        }
    }
    await Promise.all(Array.from({ length: concurrency }, () => worker()));
    const elapsed = Date.now() - started;
    const ok = results.filter((r) => r.ok);
    const times = ok.map((r) => r.ms).sort((a, b) => a - b);
    const pct = (p) => times[Math.min(times.length - 1, Math.floor((p / 100) * times.length))] ?? 0;
    const failed = results.length - ok.length;
    console.log(JSON.stringify({
        url,
        total,
        concurrency,
        elapsed_ms: elapsed,
        rps: +(total / (elapsed / 1000)).toFixed(1),
        ok: ok.length,
        failed,
        p50_ms: pct(50),
        p95_ms: pct(95),
        p99_ms: pct(99),
        statuses: results.reduce((acc, r) => {
            acc[r.status] = (acc[r.status] || 0) + 1;
            return acc;
        }, {}),
    }, null, 2));
}

main();
