
import 'dotenv/config';
import { pool } from '@/lib/neon';

async function main() {
    console.log('📦 Starting Phase 12 Migration...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Add views_count to frames
        console.log('Adding views_count to frames...');
        await client.query(`
      ALTER TABLE frames 
      ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
    `);

        // 2. Create collections table
        console.log('Creating collections table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS collections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

        // 3. Create collection_items table
        console.log('Creating collection_items table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS collection_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
        frame_id UUID NOT NULL REFERENCES frames(id) ON DELETE CASCADE,
        added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(collection_id, frame_id)
      );
    `);

        await client.query('COMMIT');
        console.log('✅ Phase 12 Migration Complete!');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Migration Failed:', e);
        process.exit(1);
    } finally {
        client.release();
        pool.end();
    }
}

main();
