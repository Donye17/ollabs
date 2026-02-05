const { Pool } = require('@neondatabase/serverless');

const connectionString = 'postgresql://neondb_owner:npg_WxCfyvpr26sU@ep-quiet-bread-afblbqx8-pooler.c-2.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

const pool = new Pool({ connectionString });

async function inspect() {
    try {
        console.log("Connecting to database...");
        const client = await pool.connect();
        console.log("Connected. Querying schema...");

        const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'verification';
    `);

        console.log("Columns in 'verification' table:");
        console.log(JSON.stringify(result.rows, null, 2));

        client.release();
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

inspect();
