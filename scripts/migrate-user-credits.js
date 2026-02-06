const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Running migration: Add credits to users table...');

        // Add credits column if not exists
        await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 3;
    `);

        // Add subscription_status column if not exists
        await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
    `);

        console.log('✅ Migration successful: Added credits and subscription_status columns.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
