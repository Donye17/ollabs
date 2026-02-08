
import 'dotenv/config';
import { pool } from '@/lib/neon';

async function main() {
    console.log("Fixing verification table schema...");
    const client = await pool.connect();
    try {
        // checkpoint: check if columns exist before renaming to avoid errors if run multiple times
        const check = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'verification'
        `);
        const columns = check.rows.map(r => r.column_name);

        if (columns.includes('created_at')) {
            console.log("Renaming created_at -> createdAt");
            await client.query('ALTER TABLE verification RENAME COLUMN created_at TO "createdAt"');
        } else {
            console.log("created_at not found");
        }

        if (columns.includes('updated_at')) {
            console.log("Renaming updated_at -> updatedAt");
            await client.query('ALTER TABLE verification RENAME COLUMN updated_at TO "updatedAt"');
        } else {
            console.log("updated_at not found");
        }

        if (columns.includes('expires_at')) {
            console.log("Renaming expires_at -> expiresAt");
            await client.query('ALTER TABLE verification RENAME COLUMN expires_at TO "expiresAt"');
        }

        console.log("Schema fix complete.");
    } catch (e) {
        console.error("Error fixing schema:", e);
    } finally {
        client.release();
        pool.end();
    }
}
main();
