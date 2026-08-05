
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
    console.log('Starting migration for Collections...');

    try {
        // Create collections table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS collections (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                is_public BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created collections table');

        // Create collection_items table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS collection_items (
                collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
                frame_id UUID NOT NULL REFERENCES frames(id) ON DELETE CASCADE,
                added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (collection_id, frame_id)
            );
        `);
        console.log('Created collection_items table');

        // Add indexes
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON collection_items(collection_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_collection_items_frame_id ON collection_items(frame_id);`);

        console.log('Indexes created');
        console.log('Migration completed successfully');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await pool.end();
    }
}

migrate();
