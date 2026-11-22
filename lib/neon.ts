import { Pool } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Neon closes idle WebSocket connections. Without a listener, the pool
// re-emits that as an unhandled 'error' event and the whole request crashes
// ("Error: Unhandled error. ()" in Vercel, 97 hits Aug to Nov). The pool
// already drops the dead client and opens a new one on the next query, so
// logging is all that is needed here.
pool.on('error', (err: Error) => {
    console.warn('[neon] idle client error, client discarded:', err?.message ?? err);
});
