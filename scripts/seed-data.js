const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const USERS = [
    { name: 'Sarah Chen', email: 'sarah.c@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4' },
    { name: 'Marcus Rodriguez', email: 'm.rodriguez@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=c0aede' },
    { name: 'Emma Wilson', email: 'emma.w@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=ffdfbf' },
    { name: 'David Kim', email: 'david.k@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=d1d4f9' },
    { name: 'Jessica Patel', email: 'j.patel@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&backgroundColor=ffd5dc' },
    { name: 'Alex Thompson', email: 'alex.t@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=c0aede' },
    { name: 'Olivia Brown', email: 'olivia.b@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia&backgroundColor=b6e3f4' },
    { name: 'Ryan Connor', email: 'ryan.c@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan&backgroundColor=d1d4f9' },
    { name: 'Sofia Garcia', email: 'sofia.g@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&backgroundColor=ffd5dc' },
    { name: 'Lucas Wright', email: 'lucas.w@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas&backgroundColor=ffdfbf' }
];

const FRAME_TEMPLATES = [
    { name: 'Cyberpunk Neon', type: 'NEON', color1: '#00ff9d', color2: '#00b8ff', width: 15 },
    { name: 'Sunset Gradient', type: 'GRADIENT', color1: '#ff6b6b', color2: '#feca57', width: 20 },
    { name: 'Royal Gold', type: 'DOUBLE', color1: '#ffd700', color2: '#b8860b', width: 25 },
    { name: 'Minimalist White', type: 'SOLID', color1: '#ffffff', width: 10 },
    { name: 'Glitch Effect', type: 'DASHED', color1: '#ff0055', color2: '#00ffff', width: 12 },
    { name: 'Memphis Pop', type: 'MEMPHIS', color1: '#ff9ff3', color2: '#54a0ff', width: 18 },
    { name: 'Geometric Tech', type: 'GEOMETRIC', color1: '#5f27cd', color2: '#341f97', width: 22 },
    { name: 'Love Core', type: 'HEART', color1: '#ff4757', color2: '#ff6b81', width: 16 },
    { name: 'Starlight', type: 'STAR', color1: '#f1c40f', color2: '#f39c12', width: 14 },
    { name: 'Hex Shield', type: 'HEXAGON', color1: '#2ecc71', color2: '#27ae60', width: 20 },
    { name: 'Vaporwave', type: 'GRADIENT', color1: '#ff71ce', color2: '#01cdfe', width: 24 },
    { name: 'Stealth Ops', type: 'DASHED', color1: '#2f3542', color2: '#57606f', width: 15 },
    { name: 'Golden Hour', type: 'NEON', color1: '#ff9ff3', color2: '#feca57', width: 20 },
    { name: 'Ice & Fire', type: 'DOUBLE', color1: '#ee5253', color2: '#48dbfb', width: 22 },
    { name: 'Forest Deep', type: 'SOLID', color1: '#10ac84', width: 18 }
];

const COMMENTS = [
    "This is amazing! 🔥",
    "Love the colors on this one.",
    "Going to use this for my Discord profile.",
    "So clean! ✨",
    "Can you make a version in blue?",
    "Best frame I've seen yet.",
    "Remixing this immediately.",
    "Vibes serve immaculate energy.",
    "Awesome work!",
    "How did you get that glow effect?"
];

async function seed() {
    const client = await pool.connect();
    try {
        console.log('🌱 Starting Seed Process...');

        // 1. Clean Database
        console.log('🧹 Cleaning old data...');
        const tables = ['notifications', 'comments', 'likes', 'frames', 'users'];
        for (const table of tables) {
            try {
                await client.query(`TRUNCATE TABLE ${table} CASCADE`);
            } catch (e) {
                // Ignore table not found errors
                if (e.code !== '42P01') {
                    console.warn(`⚠️ Could not truncate ${table}: ${e.message}`);
                }
            }
        }

        // 2. Create Users
        console.log('👥 Creating 10 Users...');
        const users = [];
        for (const u of USERS) {
            // Use "user" table (singular)
            // Added emailVerified: new Date() to satisfy NOT NULL constraint
            const res = await client.query(
                `INSERT INTO "user" (id, name, email, image, "emailVerified", "createdAt", "updatedAt") 
                 VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW(), NOW()) 
                 RETURNING *`,
                [u.name, u.email, u.image]
            );
            users.push(res.rows[0]);
        }

        // 3. Create Frames
        console.log('🖼️ Creating 25 Frames...');
        const frames = [];
        for (let i = 0; i < 25; i++) {
            const template = FRAME_TEMPLATES[Math.floor(Math.random() * FRAME_TEMPLATES.length)];
            const creator = users[Math.floor(Math.random() * users.length)];

            const config = {
                id: crypto.randomUUID(),
                ...template,
                // Small variations to make them unique
                width: template.width + Math.floor(Math.random() * 5 - 2)
            };

            const res = await client.query(
                `INSERT INTO frames (user_id, name, config, created_at)
             VALUES ($1, $2, $3, NOW() - (random() * interval '30 days'))
             RETURNING *`,
                [creator.id, `${template.name} ${Math.floor(Math.random() * 100)}`, JSON.stringify(config)]
            );
            frames.push(res.rows[0]);
        }

        // 4. Create Likes (Random)
        console.log('❤️ Generating Likes...');
        for (const user of users) {
            // Each user likes 5-15 random frames
            const numLikes = 5 + Math.floor(Math.random() * 10);
            for (let i = 0; i < numLikes; i++) {
                const frame = frames[Math.floor(Math.random() * frames.length)];
                await client.query(
                    `INSERT INTO likes (user_id, frame_id, created_at)
                 VALUES ($1, $2, NOW() - (random() * interval '10 days'))
                 ON CONFLICT DO NOTHING`,
                    [user.id, frame.id]
                );
            }
        }

        // 5. Create Comments
        console.log('💬 Generating Comments...');
        for (const frame of frames) {
            // 30% chance a frame has comments
            if (Math.random() > 0.3) {
                const numComments = 1 + Math.floor(Math.random() * 4);
                for (let i = 0; i < numComments; i++) {
                    const commenter = users[Math.floor(Math.random() * users.length)];
                    const text = COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
                    await client.query(
                        `INSERT INTO comments (user_id, frame_id, text, created_at)
                     VALUES ($1, $2, $3, NOW() - (random() * interval '5 days'))`,
                        [commenter.id, frame.id, text]
                    );
                }
            }
        }

        // 6. Remixes (Frames with parent_id)
        console.log('🔄 Generating Remixes...');
        for (let i = 0; i < 8; i++) {
            const parent = frames[Math.floor(Math.random() * frames.length)];
            const creator = users[Math.floor(Math.random() * users.length)];

            // Parse config to modifying it slightly
            const parentConfig = parent.config; // pg driver returns JSON automatically usually, but let's be sure
            const baseConfig = typeof parentConfig === 'string' ? JSON.parse(parentConfig) : parentConfig;

            const newConfig = {
                ...baseConfig,
                id: crypto.randomUUID(),
                color1: parent.color2 || '#ffffff', // Swap colors or something
                color2: baseConfig.color1,
                name: `${baseConfig.name} Remix`
            };

            await client.query(
                `INSERT INTO frames (user_id, name, config, parent_id, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
                [creator.id, `${parent.name} Remix`, JSON.stringify(newConfig), parent.id]
            );
        }

        console.log('✅ Seeding Complete! Database is populated with new data.');

    } catch (err) {
        console.error('❌ Seeding Failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
