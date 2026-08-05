import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in .env.local');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function migrate() {
    console.log('Connecting to DB...');
    try {
        const client = await pool.connect();

        // Check for 'user' table (it might be "user" or "users" depending on better-auth setup)
        // We know from previous context better-auth usually defaults to "user" but we saw a fallback to "users" in profile page.
        // Let's check which one is the main one.

        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name IN ('user', 'users');
        `);

        const validTables = tables.rows.map(t => t.table_name);
        console.log('Found user tables:', validTables);

        // We will target BOTH if they exist, or just the one found.
        // Usually better-auth uses "user".

        for (const tableName of validTables) {
            console.log(`Migrating table: "${tableName}"...`);

            const colsResult = await client.query(`
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = '${tableName}';
            `);
            const existingCols = colsResult.rows.map(r => r.column_name);

            if (!existingCols.includes('bio')) {
                console.log(`Adding 'bio' to ${tableName}`);
                await client.query(`ALTER TABLE "${tableName}" ADD COLUMN bio TEXT;`);
            }

            if (!existingCols.includes('location')) {
                console.log(`Adding 'location' to ${tableName}`);
                await client.query(`ALTER TABLE "${tableName}" ADD COLUMN location TEXT;`);
            }

            if (!existingCols.includes('website')) {
                console.log(`Adding 'website' to ${tableName}`);
                await client.query(`ALTER TABLE "${tableName}" ADD COLUMN website TEXT;`);
            }

            if (!existingCols.includes('social_links')) {
                console.log(`Adding 'social_links' to ${tableName}`);
                await client.query(`ALTER TABLE "${tableName}" ADD COLUMN social_links JSONB DEFAULT '{}';`);
            }

            console.log(`✅ Table "${tableName}" migrated successfully.`);
        }

        client.release();
    } catch (e) {
        console.error('❌ Migration failed:', e);
    } finally {
        await pool.end();
    }
}

migrate();
