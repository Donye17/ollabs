
export { };
const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkVerification(email: string) {
    if (!email) {
        console.error('Please provide an email address');
        process.exit(1);
    }

    try {
        const result = await pool.query(
            'SELECT name, email, isVerified FROM "user" WHERE email = $1',
            [email]
        );

        if (result.rows.length > 0) {
            console.log(`User: ${result.rows[0].name}`);
            console.log(`Email: ${result.rows[0].email}`);
            console.log(`Verified: ${result.rows[0].isVerified}`);
        } else {
            console.log(`User not found: ${email}`);
        }
    } catch (e) {
        console.error('Check failed:', e);
    } finally {
        await pool.end();
    }
}

const email = process.argv[2];
checkVerification(email);
