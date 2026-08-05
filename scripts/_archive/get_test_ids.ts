
import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in .env.local');
    process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getIds() {
    try {
        const userRes = await pool.query('SELECT id, name FROM "user" LIMIT 1');
        const user = userRes.rows[0];
        console.log(`USER_ID: ${user.id}`);

        const colRes = await pool.query('SELECT id, name FROM collections WHERE user_id = $1 LIMIT 1', [user.id]);
        if (colRes.rows.length > 0) {
            console.log(`COLLECTION_ID: ${colRes.rows[0].id}`);
        } else {
            console.log('NO_COLLECTIONS_FOUND');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

getIds();
