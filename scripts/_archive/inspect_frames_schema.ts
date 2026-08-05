
import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in .env.local');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function inspect() {
    console.log('Connecting to DB...');
    try {
        const client = await pool.connect();

        const result = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'frames';
        `);

        console.log('Frames table schema:');
        console.table(result.rows);

        client.release();
    } catch (e) {
        console.error('❌ Inspection failed:', e);
    } finally {
        await pool.end();
    }
}

inspect();
