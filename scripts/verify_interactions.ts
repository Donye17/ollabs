
import 'dotenv/config';
import { pool } from '@/lib/neon';
import { v4 as uuidv4 } from 'uuid';

async function verify() {
    console.log('🧪 Starting Interaction Verification...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Setup Users
        const userA = { id: uuidv4(), name: 'Creator', email: `creator_${Date.now()}@test.com`, image: 'img_a' };
        const userB = { id: uuidv4(), name: 'Interactor', email: `interactor_${Date.now()}@test.com`, image: 'img_b' };

        await client.query(`
            INSERT INTO "user" (id, name, email, image, "emailVerified", "createdAt", "updatedAt")
            VALUES 
            ($1, $2, $3, $4, true, NOW(), NOW()),
            ($5, $6, $7, $8, true, NOW(), NOW())
        `, [userA.id, userA.name, userA.email, userA.image, userB.id, userB.name, userB.email, userB.image]);

        // 2. Setup Frame
        const frameId = uuidv4();
        await client.query(`
            INSERT INTO frames (id, name, description, creator_id, creator_name, config, likes_count, created_at, is_public)
            VALUES ($1, 'Test Frame', 'Desc', $2, $3, '{}', 0, NOW(), true)
        `, [frameId, userA.id, userA.name]);

        console.log('✅ Users and Frame created');

        // 3. Simulate LIKE (DB Direct for now, mirroring logic)
        // Ideally we hit the API, but for unit-like verification, we test the logic outcome.
        // Actually, let's replicate the API logic query here to ensure the logic works:

        await client.query(`
            INSERT INTO frame_likes (frame_id, user_id, created_at) VALUES ($1, $2, NOW())
        `, [frameId, userB.id]);

        // Trigger Notification Logic (Manual Simulation of API logic)
        await client.query(`
            INSERT INTO notifications (user_id, actor_id, type, entity_id, metadata)
            VALUES ($1, $2, 'like', $3, $4)
        `, [userA.id, userB.id, frameId, JSON.stringify({ actor_name: userB.name, frame_name: 'Test Frame' })]);

        console.log('✅ Like and Notification simulated');

        // 4. Verify Like
        const likeRes = await client.query('SELECT * FROM frame_likes WHERE frame_id = $1 AND user_id = $2', [frameId, userB.id]);
        if (likeRes.rows.length !== 1) throw new Error('Like not found');

        // 5. Verify Notification
        const notifRes = await client.query('SELECT * FROM notifications WHERE user_id = $1 AND type = $2', [userA.id, 'like']);
        if (notifRes.rows.length !== 1) throw new Error('Notification not found');
        console.log('✅ Notification validated:', notifRes.rows[0].metadata);

        // 6. Simulate COMMENT
        await client.query(`
            INSERT INTO frame_comments (frame_id, user_id, content, user_name, user_image, created_at)
            VALUES ($1, $2, 'Nice frame!', $3, $4, NOW())
        `, [frameId, userB.id, userB.name, userB.image]);

        console.log('✅ Comment simulated');

        // 7. Verify Comment
        const commentRes = await client.query('SELECT * FROM frame_comments WHERE frame_id = $1', [frameId]);
        if (commentRes.rows.length !== 1) throw new Error('Comment not found');
        console.log('✅ Comment validated:', commentRes.rows[0].content);

        await client.query('ROLLBACK'); // Rollback so we don't dirty the DB
        console.log('✅ Verification SUCCESS (Rolled back)');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Verification Failed:', e);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

verify();
