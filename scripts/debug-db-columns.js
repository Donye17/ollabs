const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkColumns() {
    const client = await pool.connect();
    try {
        console.log("Checking columns in frames tables...");
        const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'frames'
    `);
        console.log("Columns:", res.rows);
    } catch (err) {
        console.error("Error checking columns:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

checkColumns();
