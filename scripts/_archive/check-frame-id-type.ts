import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type, udt_name 
            FROM information_schema.columns 
            WHERE table_name = 'frames' AND column_name = 'id';
        `);
        console.log('Frames ID Type:', res.rows[0]);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}
check();
