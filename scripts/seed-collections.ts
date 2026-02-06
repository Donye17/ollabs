
import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seedCollections() {
    try {
        // Get a user
        const userRes = await pool.query('SELECT id, name FROM "user" LIMIT 1');
        if (userRes.rows.length === 0) {
            console.log("No users found");
            return;
        }
        const user = userRes.rows[0];
        console.log(`Seeding for user: ${user.name} (${user.id})`);

        // Create Collection
        const colRes = await pool.query(`
            INSERT INTO collections (user_id, name, description, is_public)
            VALUES ($1, 'Cyberpunk Favorites', 'Best neon styles I found', true)
            RETURNING id
        `, [user.id]);
        const collectionId = colRes.rows[0].id;
        console.log(`Created collection: ${collectionId}`);

        // Add items
        const framesRes = await pool.query('SELECT id FROM frames LIMIT 3');
        for (const frame of framesRes.rows) {
            await pool.query(`
                INSERT INTO collection_items (collection_id, frame_id)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING
            `, [collectionId, frame.id]);
        }
        console.log(`Added ${framesRes.rows.length} items to collection`);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

seedCollections();
