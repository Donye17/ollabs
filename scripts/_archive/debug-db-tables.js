const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkTables() {
    const client = await pool.connect();
    try {
        console.log("Checking tables in database...");
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log("Tables found:", res.rows.map(r => r.table_name));

        if (res.rows.find(r => r.table_name === 'users')) {
            const usersCount = await client.query('SELECT COUNT(*) FROM users');
            console.log("Users count:", usersCount.rows[0].count);
        }

        if (res.rows.find(r => r.table_name === 'frames')) {
            const framesCount = await client.query('SELECT COUNT(*) FROM frames');
            console.log("Frames count:", framesCount.rows[0].count);
        }

    } catch (err) {
        console.error("Error checking tables:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

checkTables();
