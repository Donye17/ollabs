import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fix() {
    console.log('Connecting...');
    try {
        const client = await pool.connect();

        console.log('Dropping incorrect table...');
        await client.query('DROP TABLE IF EXISTS frame_comments;');

        console.log('Re-creating "frame_comments" with UUID support...');
        await client.query(`
            CREATE TABLE frame_comments (
                id SERIAL PRIMARY KEY,
                frame_id UUID NOT NULL, 
                user_id TEXT NOT NULL,
                content TEXT NOT NULL,
                user_name TEXT,
                user_image TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ "frame_comments" table fixed.');

        await client.query(`
            CREATE INDEX idx_frame_comments_frame_id ON frame_comments(frame_id);
        `);
        console.log('✅ Index recreated.');

        client.release();
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}
fix();
