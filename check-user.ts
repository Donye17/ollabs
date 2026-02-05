
import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL missing');
    process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
    try {
        const result = await pool.query('SELECT * FROM "user" LIMIT 1');
        console.log('Row:', result.rows[0]);
        console.log('Created At Type:', typeof result.rows[0].created_at);
        console.log('Created At Value:', result.rows[0].created_at);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

check();
