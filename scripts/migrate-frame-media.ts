
const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
    console.log('Starting migration for Frame Media...');

    try {
        await pool.query(`
            ALTER TABLE frames 
            ADD COLUMN IF NOT EXISTS preview_url TEXT,
            ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image/png';
        `);

        console.log('Added preview_url and media_type columns to frames table');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await pool.end();
    }
}

migrate();
