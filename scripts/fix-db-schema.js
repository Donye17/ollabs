const { Pool } = require('@neondatabase/serverless');

const connectionString = 'postgresql://neondb_owner:npg_WxCfyvpr26sU@ep-quiet-bread-afblbqx8-pooler.c-2.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

const pool = new Pool({ connectionString });

async function fixSchema() {
    try {
        console.log("Connecting to database...");
        const client = await pool.connect();
        console.log("Connected. Fixing schema constraints...");

        // 1. Make 'expiresAt' nullable
        console.log("Altering 'expiresAt' to DROP NOT NULL...");
        await client.query(`ALTER TABLE verification ALTER COLUMN "expiresAt" DROP NOT NULL;`);

        // 2. Make 'expires_at' nullable (just in case)
        console.log("Altering 'expires_at' to DROP NOT NULL...");
        await client.query(`ALTER TABLE verification ALTER COLUMN "expires_at" DROP NOT NULL;`);

        console.log("✅ Schema fixed! Duplicate columns can now accept NULL values.");

        client.release();
    } catch (err) {
        console.error("❌ Error fixing schema:", err);
    } finally {
        await pool.end();
    }
}

fixSchema();
