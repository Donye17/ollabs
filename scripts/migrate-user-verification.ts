
const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
    console.log('Starting migration for User Verification...');

    try {
        await pool.query(`
            ALTER TABLE "user" 
            ADD COLUMN IF NOT EXISTS isVerified BOOLEAN DEFAULT FALSE;
        `);

        console.log('Added isVerified column to user table');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await pool.end();
    }
}

migrate();
