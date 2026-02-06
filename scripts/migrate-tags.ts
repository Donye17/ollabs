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

async function migrate() {
    console.log('Connecting to DB...');
    try {
        const client = await pool.connect();

        // Add tags column if it doesn't exist
        console.log('Checking/Adding "tags" column to "frames" table...');
        await client.query(`
            ALTER TABLE frames 
            ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
        `);
        console.log('✅ "tags" column added.');

        // Add GIN index for fast array searching
        console.log('Adding GIN index for tags...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_frames_tags ON frames USING GIN (tags);
        `);
        console.log('✅ Index created.');

        client.release();
    } catch (e) {
        console.error('❌ Migration failed:', e);
    } finally {
        await pool.end();
    }
}

migrate();
