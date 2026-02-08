
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

        if (columns.includes('createdAt')) {
            console.log("Renaming createdAt -> created_at");
            await client.query('ALTER TABLE verification RENAME COLUMN "createdAt" TO created_at');
        } else {
            console.log("createdAt not found (already renamed?)");
        }

        if (columns.includes('updatedAt')) {
            console.log("Renaming updatedAt -> updated_at");
            await client.query('ALTER TABLE verification RENAME COLUMN "updatedAt" TO updated_at');
        } else {
            console.log("updatedAt not found (already renamed?)");
        }

        // Also ensure expiresAt -> expires_at if mixed
        if (columns.includes('expiresAt')) {
            console.log("Renaming expiresAt -> expires_at");
            await client.query('ALTER TABLE verification RENAME COLUMN "expiresAt" TO expires_at');
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
