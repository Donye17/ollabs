
import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env before anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    console.log('Inspecting Likes table (Standalone)...');
    try {
        const result = await pool.query('SELECT * FROM likes LIMIT 10');
        console.log('Likes:', result.rows);

        const count = await pool.query('SELECT COUNT(*) FROM likes');
        console.log('Total Likes:', count.rows[0].count);

        // Mismatch check
        const diffCheck = await pool.query(`
            SELECT f.id, f.name, f.likes_count, COUNT(l.user_id) as computed_count
            FROM frames f
            LEFT JOIN likes l ON f.id = l.frame_id
            GROUP BY f.id
            HAVING f.likes_count != COUNT(l.user_id)
        `);

        if (diffCheck.rows.length > 0) {
            console.log('⚠️ MISMATCH FOUND:', diffCheck.rows);
        } else {
            console.log('✅ Counts are consistent.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

main();
