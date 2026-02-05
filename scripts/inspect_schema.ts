
import 'dotenv/config';
import { pool } from '@/lib/neon';

async function main() {
    try {
        const client = await pool.connect();
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'user' OR table_name = 'users'
        `);
        console.log('User Table Columns:', res.rows);
        client.release();
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
main();
