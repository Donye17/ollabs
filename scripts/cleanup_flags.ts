
import 'dotenv/config';
import { pool } from '@/lib/neon';

async function main() {
    console.log('Cleaning up seeded flag frames...');

    // Delete frames created by 'FlagMaster2026' (based on the previous script's behavior)
    // We can identify them by the creator_name or a tag we added.
    // The previous script added tags: ['flag', 'country', ...]

    // Let's target the user 'FlagMaster2026' if possible, or just the tags if the user ID is dynamic.
    // Actually, I can search for frames with specific names like "% Flag" created recently.

    try {
        const result = await pool.query(
            `DELETE FROM frames 
             WHERE name LIKE '%Flag%'
             RETURNING id, name, creator_name, created_at, tags`
        );

        console.log(`Deleted ${result.rows.length} frames.`);
        result.rows.forEach(r => console.log(` - ${r.name}`));

    } catch (e) {
        console.error('Cleanup failed:', e);
    }

    console.log('Done.');
}

main();
