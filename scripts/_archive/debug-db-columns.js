const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function inspect() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM "frames" LIMIT 1');
        if (res.rows.length > 0) {
            console.log("Frames Columns:", Object.keys(res.rows[0]));
        } else {
            console.log("No frames found, checking information schema");
            const res2 = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'frames'
            `);
            console.log("Columns from Schema:", res2.rows.map(r => r.column_name));
        }
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        await pool.end();
    }
}

inspect();
