import 'dotenv/config';
import { pool } from '@/lib/neon'; // Adjust import based on your project structure. 
// If specific env vars are needed, command line -e .env is safer but this helps.

async function main() {
    console.log('Checking flags for text layers...');
    try {
        const res = await pool.query(`
            SELECT id, name, created_at, config 
            FROM frames 
            WHERE name LIKE '%Flag%' 
            ORDER BY created_at DESC
        `);

        console.log(`Found ${res.rows.length} flag frames.`);

        let dirtyCount = 0;
        for (const row of res.rows) {
            const config = typeof row.config === 'string' ? JSON.parse(row.config) : row.config;
            if (config.textLayers && config.textLayers.length > 0) {
                console.log(`[DIRTY] ID: ${row.id} | Name: ${row.name} | Created: ${row.created_at}`);
                console.log('  Text:', config.textLayers.map((t: any) => t.text).join(', '));
                dirtyCount++;
            }
        }

        if (dirtyCount === 0) {
            console.log('All flag frames are clean!');
        } else {
            console.log(`Found ${dirtyCount} dirty frames.`);
        }

    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

main();
