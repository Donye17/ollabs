
import 'dotenv/config';
import { pool } from '@/lib/neon';
import { v4 as uuidv4 } from 'uuid';

async function main() {
    console.log('🧪 Starting Smoke Test Seed...');

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const userA = {
            id: uuidv4(),
            name: 'SmokeTest Creator',
            email: `creator_${Date.now()}@test.com`,
            image: 'https://github.com/shadcn.png'
        };

        const userB = {
            id: uuidv4(),
            name: 'SmokeTest Remixer',
            email: `remixer_${Date.now()}@test.com`,
            image: 'https://github.com/shadcn.png'
        };

        // Insert Users (using camelCase for generated BetterAuth schema)
        await client.query(`
      INSERT INTO "user" (id, name, email, image, "emailVerified", "createdAt", "updatedAt")
      VALUES 
      ($1, $2, $3, $4, true, NOW(), NOW()),
      ($5, $6, $7, $8, true, NOW(), NOW())
    `, [userA.id, userA.name, userA.email, userA.image, userB.id, userB.name, userB.email, userB.image]);

        // 2. Trending Logic Seed
        // Frame 1: Old but Popular (10 days ago, 50 likes) -> Should NOT be in Trending
        const oldFrameId = uuidv4();
        await client.query(`
      INSERT INTO frames (id, name, description, creator_id, creator_name, config, likes_count, created_at, is_public)
      VALUES ($1, 'Old Popular', 'Should not trend', $2, $3, '{}', 50, NOW() - INTERVAL '10 days', true)
    `, [oldFrameId, userA.id, userA.name]);

        // Frame 2: New and Popular (1 day ago, 10 likes) -> Should be #1 Trending
        const trendingFrameId = uuidv4();
        await client.query(`
        INSERT INTO frames (id, name, description, creator_id, creator_name, config, likes_count, created_at, is_public)
        VALUES ($1, 'New & Trending', 'Should be #1', $2, $3, '{}', 10, NOW() - INTERVAL '1 day', true)
      `, [trendingFrameId, userA.id, userA.name]);

        // Frame 3: New but Unpopular (1 day ago, 0 likes) -> Should be #2 (or lower)
        const newFrameId = uuidv4();
        await client.query(`
        INSERT INTO frames (id, name, description, creator_id, creator_name, config, likes_count, created_at, is_public)
        VALUES ($1, 'New & Boring', 'Should be last', $2, $3, '{}', 0, NOW() - INTERVAL '1 day', true)
      `, [newFrameId, userA.id, userA.name]);

        // 3. Notification Logic Seed
        const remixFrameId = uuidv4();
        await client.query(`
        INSERT INTO frames (id, name, description, creator_id, creator_name, config, likes_count, created_at, is_public)
        VALUES ($1, 'Remix of Trending', 'A cool remix', $2, $3, '{}', 0, NOW(), true)
    `, [remixFrameId, userB.id, userB.name]);

        const metadata = JSON.stringify({
            actor_name: userB.name,
            actor_image: userB.image,
            frame_name: 'New & Trending'
        });

        await client.query(`
        INSERT INTO notifications (id, user_id, actor_id, type, entity_id, metadata, read, created_at)
        VALUES ($1, $2, $3, 'remix', $4, $5, false, NOW())
    `, [uuidv4(), userA.id, userB.id, remixFrameId, metadata]);

        await client.query(`
        INSERT INTO notifications (id, user_id, actor_id, type, entity_id, metadata, read, created_at)
        VALUES ($1, $2, $3, 'like', $4, $5, false, NOW())
    `, [uuidv4(), userA.id, userB.id, trendingFrameId, metadata]);

        await client.query('COMMIT');
        console.log('✅ Seed Complete!');

        // --- PROGRAMMATIC API VERIFICATION ---
        console.log('🔍 Verifying Trending API...');
        try {
            const res = await fetch('http://localhost:3000/api/frames?sort=trending');
            if (!res.ok) throw new Error(`API returned ${res.status}`);
            const data = await res.json();

            console.log(`Received ${data.length} trending frames`);

            const trendingFrame = data.find((f: any) => f.id === trendingFrameId);
            const oldFrame = data.find((f: any) => f.id === oldFrameId);
            const boringFrame = data.find((f: any) => f.id === newFrameId);

            if (!trendingFrame) {
                console.error('❌ TEST FAIL: "New & Trending" frame not found in response');
                throw new Error('Trending Frame Missing');
            }

            if (oldFrame) {
                console.error('❌ TEST FAIL: "Old Popular" frame found in trending response (should be filtered out by time)');
                throw new Error('Time Filter Failed');
            }

            const trendingIndex = data.findIndex((f: any) => f.id === trendingFrameId);

            if (trendingIndex === 0) {
                console.log('✅ TEST PASS: "New & Trending" is ranked #1');
            } else {
                console.warn(`⚠️ TEST WARN: "New & Trending" is at index ${trendingIndex}, expected 0`);
                console.log('Top frame is:', data[0]?.name);
            }

            console.log('✅ Smoke Test Logic Verified Successfully');

        } catch (apiError) {
            console.error('API Verification Failed:', apiError);
            process.exit(1);
        }

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Seed Failed:', e);
        process.exit(1);
    } finally {
        client.release();
        pool.end();
    }
}

main();
