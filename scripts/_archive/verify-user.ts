
export { };
const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function verifyUser(email: string) {
    if (!email) {
        console.error('Please provide an email address');
        process.exit(1);
    }

    console.log(`Verifying user: ${email}...`);

    try {
        const result = await pool.query(
            'UPDATE "user" SET isVerified = true WHERE email = $1 RETURNING *',
            [email]
        );

        if (result.rows.length > 0) {
            console.log(`Successfully verified user: ${result.rows[0].name} (${result.rows[0].email})`);
        } else {
            console.log(`User not found: ${email}`);
        }
    } catch (e) {
        console.error('Verification failed:', e);
    } finally {
        await pool.end();
    }
}

const email = process.argv[2];
verifyUser(email);
