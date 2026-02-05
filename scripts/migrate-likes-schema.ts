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

        // 1. Create 'likes' table
        console.log('Checking/Creating "likes" table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS likes (
                user_id TEXT NOT NULL,
                frame_id UUID NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                PRIMARY KEY (user_id, frame_id)
            );
        `);
        console.log('✅ "likes" table ready.');

        // 2. Add 'likes_count' to 'frames' table if missing
        console.log('Checking "frames" table for "likes_count"...');
        const colsResult = await client.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'frames';
        `);
        const existingCols = colsResult.rows.map(r => r.column_name);

        if (!existingCols.includes('likes_count')) {
            console.log('Adding "likes_count" column to frames...');
            await client.query('ALTER TABLE frames ADD COLUMN likes_count INTEGER DEFAULT 0;');
            console.log('✅ Added "likes_count" column.');
        } else {
            console.log('✓ "likes_count" column already exists.');
        }

        client.release();
    } catch (e) {
        console.error('❌ Migration failed:', e);
    } finally {
        await pool.end();
    }
}

migrate();
