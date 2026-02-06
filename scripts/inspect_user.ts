
import 'dotenv/config';
import { pool } from '@/lib/neon';

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error("Please provide an email.");
        process.exit(1);
    }

    const res = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
    if (res.rows.length === 0) {
        console.log("No user found with that email.");
    } else {
        console.log("User found:", res.rows[0]);
        console.log("To delete this user run: npx tsx scripts/delete_user.ts " + email);
    }
    await pool.end();
}

main();
