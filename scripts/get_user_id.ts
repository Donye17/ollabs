
import { pool } from '../lib/neon';

async function main() {
    try {
        const result = await pool.query('SELECT id, name FROM "user" LIMIT 1');
        if (result.rows.length === 0) {
            // Fallback table check
            const result2 = await pool.query('SELECT id, name FROM users LIMIT 1');
            console.log('Found user (fallback):', result2.rows[0]);
        } else {
            console.log('Found user:', result.rows[0]);
        }
    } catch (e) {
        console.error(e);
    } finally {
        // process.exit(0); // neon driver might need manual exit
    }
}

main();
