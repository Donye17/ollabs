
import 'dotenv/config';
import { pool } from '@/lib/neon';

async function main() {
    console.log("Inspecting schema...");

    const userResult = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'user';
    `);

    console.log("User Table Columns:", userResult.rows);

    const verificationResult = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'verification';
    `);

    console.log("Verification Table Columns:", verificationResult.rows);

    process.exit(0);
}
main();
