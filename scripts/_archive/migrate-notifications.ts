import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
    console.log('Connecting to database...');
    try {
        const client = await pool.connect();

        console.log('Creating "notifications" table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id TEXT NOT NULL,
                actor_id TEXT NOT NULL,
                type TEXT NOT NULL, -- 'like', 'comment', 'remix'
                entity_id UUID NOT NULL, -- frame_id
                read BOOLEAN DEFAULT FALSE,
                metadata TEXT, -- JSON string for extra info (e.g., actor_name, actor_image)
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);

        // Index for fast fetching of user's notifications
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
        `);

        // Index for sorting by date
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
        `);

        console.log('✅ "notifications" table created successfully.');
        client.release();
    } catch (e) {
        console.error('❌ Migration failed:', e);
    } finally {
        await pool.end();
    }
}
migrate();
