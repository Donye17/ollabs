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

        // Create 'frame_comments' table
        console.log('Checking/Creating "frame_comments" table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS frame_comments (
                id SERIAL PRIMARY KEY,
                frame_id UUID NOT NULL, 
                user_id TEXT NOT NULL,
                content TEXT NOT NULL,
                user_name TEXT,
                user_image TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ "frame_comments" table ready.');

        // Add index for performance
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_frame_comments_frame_id ON frame_comments(frame_id);
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
