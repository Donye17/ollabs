
import 'dotenv/config';
import { pool } from '@/lib/neon';

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error("Please provide an email.");
        process.exit(1);
    }

    try {
        const res = await pool.query('DELETE FROM "user" WHERE email = $1 RETURNING *', [email]);
        if (res.rows.length === 0) {
            console.log("No user found with that email to delete.");
        } else {
            console.log("Deleted user:", res.rows[0]);
        }
    } catch (e) {
        console.error(e);
    }
    await pool.end();
}

main();
